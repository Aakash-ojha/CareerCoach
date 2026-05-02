import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    await connectDB();

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 },
      );
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // SET START TIME (only once)
    if (!session.startedAt) {
      session.startedAt = new Date();
      session.status = "active";
      await session.save();
    }

    // GENERATE FIRST QUESTION (only if not already generated)
    let firstQuestion = "";

    // Check if the first message is already an assistant message (question already generated)
    const hasFirstQuestion =
      session.messages.length > 0 && session.messages[0].role === "assistant";

    if (!hasFirstQuestion) {
      // Generate the first question using Groq
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a technical interviewer. You are conducting a ${session.difficulty} level interview on the topic: "${session.topic}".

Your task: Ask ONLY the first interview question. Be concise and clear. Do not ask multiple questions in one response.

Remember: This is the opening question, so make it welcoming and set the tone for the interview.`,
          },
          {
            role: "user",
            content:
              "Let's begin the interview. What's your first question for me?",
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 200,
      });

      firstQuestion = response.choices[0].message.content || "";

      if (!firstQuestion) {
        throw new Error("Failed to generate first question");
      }

      // SAVE THE FIRST QUESTION TO SESSION
      session.messages.push({
        role: "assistant",
        content: firstQuestion,
      });

      await session.save();
    } else {
      // First question already exists, retrieve it
      firstQuestion = session.messages[0].content;
    }

    //  RETURN RESPONSE
    return NextResponse.json({
      success: true,
      sessionId: session._id,
      startedAt: session.startedAt,
      question: firstQuestion,
      config: {
        topic: session.topic,
        difficulty: session.difficulty,
        timePreference: session.timePreference,
      },
    });
  } catch (error: any) {
    console.error("Start interview error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to start interview",
      },
      { status: 500 },
    );
  }
}
