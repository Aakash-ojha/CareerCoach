import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. connect DB
    await connectDB();

    // 2. check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return Response.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
