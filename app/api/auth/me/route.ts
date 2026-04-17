import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const token = cookies().get("token")?.value;

    if (!token) {
      return Response.json({ user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findById(decoded.id).select("-password");

    return Response.json({ user });
  } catch {
    return Response.json({ user: null }, { status: 401 });
  }
}
