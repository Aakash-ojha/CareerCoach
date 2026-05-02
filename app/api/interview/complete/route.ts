import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { InterviewSession } from "@/models/InterviewSession";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID is required",
        },
        { status: 400 },
      );
    }

    // Find session
    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Session not found",
        },
        { status: 404 },
      );
    }

    // Already completed → no need to update again
    if (session.status === "completed") {
      return NextResponse.json({
        success: true,
        message: "Session already completed",
      });
    }

    // Mark interview as completed when user hangs up
    session.status = "completed";

    await session.save();

    return NextResponse.json({
      success: true,
      message: "Interview ended successfully",
    });
  } catch (error: any) {
    console.error("Complete API Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
