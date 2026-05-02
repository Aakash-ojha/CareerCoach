import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { sessionId, message } = await req.json();

    // VALIDATION
    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: "Session ID and message are required" },
        { status: 400 },
      );
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Message cannot be empty" },
        { status: 400 },
      );
    }

    // FETCH SESSION
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // VERIFY SESSION IS ACTIVE
    if (session.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: `Session is ${session.status}, cannot add messages`,
        },
        { status: 400 },
      );
    }

    // SAVE USER MESSAGE TO DATABASE
    const userMessage = {
      role: "user" as const,
      content: message.trim(),
      timestamp: new Date(),
    };

    const sessionAfterUserMsg = await InterviewSession.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          messages: userMessage,
        },
      },
      { new: true },
    );

    if (!sessionAfterUserMsg) {
      throw new Error("Failed to save user message");
    }

    // BUILD CONVERSATION HISTORY (including the just-saved message)
    const conversationHistory = sessionAfterUserMsg.messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    //  GENERATE NEXT QUESTION/FEEDBACK FROM GROQ
    const systemPrompt = `You are a professional technical interviewer conducting a ${session.difficulty} level interview on "${session.topic}".

Your responsibilities:
- Evaluate the candidate's answer constructively
- Ask clear, relevant follow-up questions
- Maintain a professional, encouraging tone
- Provide brief feedback before asking the next question
- Ask 1 question per response only
- If the candidate's answers are weak, gently probe deeper

Format your response as:
1. Brief acknowledgment of their answer
2. One follow-up question

Keep responses concise (under 150 words).`;

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...conversationHistory,
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 300,
    });

    const nextResponse = response.choices[0]?.message?.content;

    if (!nextResponse) {
      throw new Error("Failed to generate response from Groq");
    }

    // SAVE ASSISTANT RESPONSE TO DATABASE
    const assistantMessage = {
      role: "assistant" as const,
      content: nextResponse.trim(),
      timestamp: new Date(),
    };

    const updatedSession = await InterviewSession.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          messages: assistantMessage,
        },
      },
      { new: true },
    );

    if (!updatedSession) {
      throw new Error("Failed to save assistant response");
    }

    // RETURN RESPONSE
    return NextResponse.json({
      success: true,
      reply: nextResponse.trim(),
      sessionId: updatedSession._id,
      messageCount: updatedSession.messages.length,
      status: updatedSession.status,
    });
  } catch (error: any) {
    console.error("Chat route error:", error);

    // BETTER ERROR MESSAGES
    let errorMessage = error.message || "Failed to process chat message";

    if (error.message?.includes("GROQ_API_KEY")) {
      errorMessage = "API configuration error - check GROQ_API_KEY";
    } else if (error.message?.includes("401")) {
      errorMessage = "Authentication error with Groq API";
    } else if (error.message?.includes("rate")) {
      errorMessage = "Rate limit exceeded - please try again in a moment";
    } else if (error.message?.includes("network")) {
      errorMessage = "Network error - please check your connection";
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
