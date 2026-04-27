import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 4. Decode the token to get the REAL userId
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const authenticatedUserId = payload.id as string;

    const { topic, difficulty, timePreference } = await req.json();

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
           You are a Senior Technical Interviewer. Start a ${difficulty} level interview on the topic of ${topic}. The interview duration is ${timePreference} minutes. Introduce yourself briefly and ask ONLY the first interview question.
          `,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    const firstQuestion = response.choices[0].message.content;

    const session = await InterviewSession.create({
      userId: authenticatedUserId,
      topic,
      difficulty,
      timePreference,
      status: "active",
      messages: [
        {
          role: "assistant",
          content: firstQuestion,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      sessionId: session._id,
      question: firstQuestion,
      config: {
        topic: session.topic,
        difficulty: session.difficulty,
        timePreference: session.timePreference,
      },
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
