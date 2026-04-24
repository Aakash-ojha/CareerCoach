"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const categories = [
  {
    title: "IT Field",
    topics: [
      "Frontend Development",
      "Backend Development",
      "Full Stack",
      "Machine Learning",
      "Data Science",
      "Cybersecurity",
      "Cloud Computing",
    ],
  },
  {
    title: "Programming Languages",
    topics: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL"],
  },
  {
    title: "Academic Subjects",
    topics: ["Math", "Physics", "Statistics", "Logical Reasoning"],
  },
];

export default function TopicSelectionPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedTopic) return;

    try {
      setLoading(true);

      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedTopic,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push(`/interview?topic=${encodeURIComponent(selectedTopic)}`);
    } catch (error) {
      console.error(error);
      alert("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Choose Your Interview Track
          </h1>
          <p className="text-gray-400 mt-4 text-lg">
            Select your preferred topic and start your AI-powered mock interview
          </p>
        </div>

        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-bold mb-5 text-blue-400">
                {category.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.topics.map((topic) => {
                  const active = selectedTopic === topic;

                  return (
                    <motion.button
                      key={topic}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTopic(topic)}
                      className={`p-6 rounded-3xl border transition-all text-left shadow-xl ${
                        active
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-800 bg-[#141414] hover:border-gray-600"
                      }`}
                    >
                      <h3 className="text-xl font-bold">{topic}</h3>
                      <p className="text-sm text-gray-400 mt-2">
                        Practice focused interview questions for {topic}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedTopic || loading}
            className="px-10 py-4 rounded-full font-black uppercase tracking-wider bg-white text-black hover:bg-blue-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? "Starting Interview..."
              : selectedTopic
                ? `Continue with ${selectedTopic}`
                : "Select a Topic First"}
          </button>
        </div>
      </div>
    </div>
  );
}

/*
Create this API route:

app/api/interview/start/route.ts

--------------------------------------------------

import { NextResponse } from "next/server";

const allowedTopics = [
  "Frontend Development",
  "Backend Development",
  "Full Stack",
  "Machine Learning",
  "Data Science",
  "Cybersecurity",
  "Cloud Computing",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "SQL",
  "Math",
  "Physics",
  "Statistics",
  "Logical Reasoning",
];

export async function POST(req: Request) {
  try {
    const { selectedTopic } = await req.json();

    if (!selectedTopic) {
      return NextResponse.json(
        { error: "Please select a topic" },
        { status: 400 }
      );
    }

    if (!allowedTopics.includes(selectedTopic)) {
      return NextResponse.json(
        { error: "Invalid topic selected" },
        { status: 400 }
      );
    }

    // Later save to DB here using Prisma

    return NextResponse.json({
      success: true,
      selectedTopic,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

--------------------------------------------------

Paste frontend file inside:

app/select-topic/page.tsx

Then visit:

http://localhost:3000/select-topic
*/
