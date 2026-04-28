import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";

/**
 * Calculates the exact remaining seconds based on the original start time.
 * This ensures the timer persists correctly across page refreshes.
 */
const getRemainingTime = (session: any) => {
  // 1. Total seconds allowed (e.g., 10 minutes * 60)
  const totalAllowedSeconds = session.timePreference * 60;

  // 2. The exact moment the interview began
  const startTime = new Date(session.startedAt).getTime();

  // 3. Current moment
  const now = Date.now();

  // 4. Calculate how many seconds have ticked away since the start
  const elapsedSeconds = Math.floor((now - startTime) / 1000);

  // 5. Subtract elapsed from total, ensuring we don't return a negative number
  return Math.max(totalAllowedSeconds - elapsedSeconds, 0);
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    await connectDB();

    // Resolve params for Next.js 15+ compatibility
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId" },
        { status: 400 },
      );
    }

    // Fetch the session from MongoDB
    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        _id: session._id,
        userId: session.userId,
        topic: session.topic,
        difficulty: session.difficulty,
        timePreference: session.timePreference,
        timeRemaining: getRemainingTime(session),
        startedAt: session.startedAt,
        domain: session.domain,
        status: session.status,
        messages: session.messages,
        score: session.score,
        report: session.report,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("GET Session Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
