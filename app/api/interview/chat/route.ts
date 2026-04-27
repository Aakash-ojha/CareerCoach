import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db"; // Ensure you have a DB connection helper
import { InterviewSession } from "@/models/InterviewSession";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    await connectDB();

    // 1. Get sessionId from the request
    const { userText, sessionId } = await req.json();

    // 2. Fetch the session from MongoDB to get history and config
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const groqMessages = [
      {
        role: "system",
        content: `You are a technical interviewer. The candidate is interviewing for a ${session.difficulty} level position regarding ${session.topic}. 
        Acknowledge their answer briefly, then ask the next logical technical question. Max 2 sentences.`,
      },
      ...session.messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: userText },
    ];

    const response = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const aiQuestion = response.choices[0].message.content;

    session.messages.push({ role: "user", content: userText });
    session.messages.push({ role: "assistant", content: aiQuestion });
    await session.save();

    return NextResponse.json({ question: aiQuestion });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
