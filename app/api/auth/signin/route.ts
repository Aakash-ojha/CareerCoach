import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }

    // JWT create
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          }),
        },
      },
    );
  } catch (err) {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
