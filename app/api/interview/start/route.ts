import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const { topic, difficulty, timePreference } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are a Senior Technical Interviewer.

Start a ${difficulty} level interview on the topic of ${topic}.

The interview duration is ${timePreference} minutes.

Introduce yourself briefly and ask ONLY the first interview question.
          `,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const firstQuestion = response.choices[0].message.content;

    return NextResponse.json({
      success: true,
      question: firstQuestion,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
