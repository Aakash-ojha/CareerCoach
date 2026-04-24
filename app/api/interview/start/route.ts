import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Ensure your .env.local has GROQ_API_KEY
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const { userText, history } = await req.json();

    // System prompt defines the AI's personality
    const systemMessage = {
      role: "system",
      content:
        "You are a professional technical interviewer. Acknowledge the candidate's answer briefly and ask the next logical interview question. Keep responses to 1-2 sentences.",
    };

    // If it's the first message, history will be empty
    const messages = [
      systemMessage,
      ...(history || []),
      {
        role: "user",
        content: userText || "Hello, I am ready to start the interview.",
      },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 150,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ question: responseText });
  } catch (error: any) {
    console.error("GROQ ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
