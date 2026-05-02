import { InterviewSession } from "@/models/InterviewSession";
import { connectDB } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const authenticatedUserId = payload.id as string;

    const { topic, difficulty, timePreference } = await req.json();

    if (!topic || !difficulty || !timePreference) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: topic, difficulty, and timePreference are required",
        },
        { status: 400 },
      );
    }

    const session = await InterviewSession.create({
      userId: authenticatedUserId,
      topic,
      difficulty,
      timePreference,
      status: "active",
      messages: [],
      startedAt: null,
    });

    return NextResponse.json({
      success: true,
      sessionId: session._id,
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
