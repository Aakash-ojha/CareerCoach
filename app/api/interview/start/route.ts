import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    await connectDB(); // Ensures DB is ready if you decide to create a session record
    const { domain, topic, difficulty } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a Senior Interviewer for ${domain}. 
          Start an interview for a ${difficulty} level candidate on the topic of ${topic}. 
          Introduce yourself briefly and ask the first foundational question.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    return NextResponse.json({ question: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
