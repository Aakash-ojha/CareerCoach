import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { userText, history, topic, difficulty } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a technical interviewer. The candidate is answering a ${difficulty} level question about ${topic}. 
          Acknowledge their answer briefly, then ask the next logical technical question. Max 2 sentences.`,
        },
        ...history,
        { role: "user", content: userText },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, // Lower temperature for more focused technical questions
    });

    return NextResponse.json({ question: response.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
