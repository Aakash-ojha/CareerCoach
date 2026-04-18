import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }

    const decoded = jwt.verify(token, secret) as { id: string };

    // Fetch user and exclude sensitive fields
    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Auth Me Error:", err);
    return NextResponse.json(
      { user: null, message: "Unauthorized" },
      { status: 401 },
    );
  }
}
