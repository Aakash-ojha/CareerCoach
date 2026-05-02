import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    // CONNECT DATABASE

    await connectDB();

    const { sessionId } = await req.json();

    // VALIDATION

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID is required",
        },
        { status: 400 },
      );
    }

    // FETCH SESSION

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Interview session not found",
        },
        { status: 404 },
      );
    }

    // Prevent duplicate evaluation
    if (session.status === "completed" && session.report) {
      return NextResponse.json({
        success: true,
        report: session.report,
        score: session.score,
        message: "Session already evaluated",
      });
    }

    // EARLY EXIT FOR INCOMPLETE / CUT SHORT SESSIONS

    const userMessages = session.messages.filter((m: any) => m.role === "user");
    if (userMessages.length === 0) {
      const emptyReport = {
        score: 0,
        confidenceLevel: "Low",
        strengths: ["None"],
        weaknesses: [
          "Interview session was exited early without providing any answers.",
        ],
        communication: "No responses were recorded to evaluate.",
        technicalFeedback: "No answers provided.",
        finalSuggestion:
          "Start a new session and complete the interview questions to receive a valid report.",
      };

      const updatedSession = await InterviewSession.findByIdAndUpdate(
        sessionId,
        {
          score: 0,
          report: emptyReport,
          status: "completed",
        },
        { new: true },
      );

      return NextResponse.json({
        success: true,
        message: "Interview session was cut short. Evaluated as incomplete.",
        report: emptyReport,
        score: 0,
        sessionId: updatedSession?._id || sessionId,
        status: "completed",
      });
    }

    // BUILD TRANSCRIPT

    const transcript = session.messages
      .map(
        (msg: any) =>
          `${msg.role === "assistant" ? "INTERVIEWER" : "CANDIDATE"}: ${msg.content}`,
      )
      .join("\n");

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No interview messages found to evaluate",
        },
        { status: 400 },
      );
    }

    // AI PROMPT

    const evaluationPrompt = `
You are an expert senior technical interviewer.

Analyze the following interview transcript and evaluate the candidate.

Return ONLY valid JSON.
Do not add markdown.
Do not add explanation.
Do not wrap in triple backticks.

Required JSON format:

{
  "score": number,
  "strengths": [
    "string",
    "string",
    "string"
  ],
  "weaknesses": [
    "string",
    "string",
    "string"
  ],
  "communication": "string",
  "technicalFeedback": "string",
  "confidenceLevel": "Low / Medium / High",
  "finalSuggestion": "string"
}

Evaluation Rules:
- score must be between 0 and 100
- strengths must be practical observations
- weaknesses must be constructive
- technicalFeedback must evaluate actual answer quality
- communication must evaluate clarity and structure
- confidenceLevel should reflect candidate confidence
- finalSuggestion should be specific and useful

Interview Details:
Topic: ${session.topic}
Domain: ${session.domain}
Difficulty: ${session.difficulty}

Interview Transcript:
${transcript}
`;

    // GROQ AI CALL

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: evaluationPrompt,
        },
      ],
    });

    const rawResponse = completion.choices[0]?.message?.content;

    if (!rawResponse) {
      throw new Error("No evaluation response received from AI");
    }

    // SANITIZE & SAFE JSON PARSE

    let cleanedResponse = rawResponse.trim();

    // Strip markdown formatting if the model included it
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.slice(7);
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.slice(3);
    }

    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }

    cleanedResponse = cleanedResponse.trim();

    let parsedReport;

    try {
      parsedReport = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON Parse Failed for response:", rawResponse);
      throw new Error("Failed to parse AI evaluation response");
    }

    // SAVE REPORT TO DATABASE

    const updatedSession = await InterviewSession.findByIdAndUpdate(
      sessionId,
      {
        score: parsedReport.score || 0,
        report: parsedReport,
        status: "completed",
      },
      { new: true },
    );

    if (!updatedSession) {
      throw new Error("Failed to update interview session");
    }

    // SUCCESS RESPONSE

    return NextResponse.json({
      success: true,
      message: "Interview evaluated successfully",
      report: parsedReport,
      score: parsedReport.score || 0,
      sessionId: updatedSession._id,
      status: updatedSession.status,
    });
  } catch (error: any) {
    console.error("Evaluation Route Error:", error);

    let errorMessage =
      error.message || "Something went wrong during evaluation";

    if (error.message?.includes("GROQ_API_KEY")) {
      errorMessage = "Missing GROQ API key configuration";
    } else if (error.message?.includes("401")) {
      errorMessage = "Groq authentication failed";
    } else if (error.message?.includes("rate")) {
      errorMessage = "Groq rate limit exceeded. Please try again shortly";
    } else if (error.message?.includes("network")) {
      errorMessage = "Network issue while contacting AI service";
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
