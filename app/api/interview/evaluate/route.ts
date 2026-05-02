import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    await connectDB();

    // We expect only the sessionId from the frontend
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Fetch the session directly from the database
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Safely extract the messages array and convert to history format
    const messages = Array.isArray(session.messages) ? session.messages : [];

    const history = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert career coach. Analyze the interview transcript for ${session.topic || "the interview"} at ${session.difficulty || "medium"} level.
Provide a JSON response with these keys: 
"score" (number 0-100), 
"feedback" (string), 
"strengths" (array), 
"weaknesses" (array).`,
        },
        ...history, // This will no longer throw an error since it is safely extracted
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const contentText = response.choices[0]?.message?.content;
    if (!contentText) {
      throw new Error("Failed to generate evaluation from Groq");
    }

    const result = JSON.parse(contentText);

    // Update the session in DB as completed
    await InterviewSession.findByIdAndUpdate(sessionId, {
      $set: { status: "completed", endedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Evaluation API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
