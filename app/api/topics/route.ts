import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Topic } from "@/models/Topics";

export async function GET() {
  try {
    await connectDB();

    // Fetch all active topics
    const topics = await Topic.find({ isActive: true });

    const groupedData = topics.reduce((acc: any, topic: any) => {
      if (!acc[topic.domain]) {
        acc[topic.domain] = [];
      }
      acc[topic.domain].push(topic.name);
      return acc;
    }, {});

    return NextResponse.json(groupedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
