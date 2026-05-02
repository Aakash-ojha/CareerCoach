import { InterviewSession } from "@/models/InterviewSession";
import { connectDB } from "@/lib/db";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = cookies();

    const token = (await cookieStore).get("token")?.value;

    let userId: string | null = null;

    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        userId = payload.id as string;
      } catch (err) {
        userId = null;
      }
    }

    if (!userId) {
      const session = await getServerSession(authOptions);

      if (session?.user) {
        // IMPORTANT: ensure you store user id in session (email fallback)
        userId = (session.user as any).id || session.user.email;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { topic, difficulty, timePreference } = await req.json();

    if (!topic || !difficulty || !timePreference) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 },
      );
    }

    const session = await InterviewSession.create({
      userId,
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
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
