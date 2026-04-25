import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { history, topic, difficulty } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert career coach. Analyze the interview transcript for ${topic} at ${difficulty} level.
          Provide a JSON response with these keys: 
          "score" (number 0-100), 
          "feedback" (string), 
          "strengths" (array), 
          "weaknesses" (array).`,
        },
        ...history,
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
