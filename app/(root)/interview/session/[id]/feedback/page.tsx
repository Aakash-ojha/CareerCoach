"use client";

import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  MessageSquare,
  Target,
  ChevronLeft,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResults = async () => {
      try {
        const res = await fetch(`/api/interview/session/${id}`);
        const data = await res.json();
        if (data.success) {
          setSession(data.session);
        }
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      } finally {
        setLoading(false);
      }
    };
    getResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
        <div className="flex flex-col items-center space-y-6">
          {/* Loader */}
          <div className="relative">
            <div className="h-20 w-20 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          </div>

          {/* Text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">Generating Your Report</h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              We are analyzing your interview performance and preparing
              feedback...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950/50 p-6 text-white md:p-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/interview/setup"
          className="group mb-8 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-cyan-400"
        >
          <ChevronLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Topic section
        </Link>

        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <Badge className="border-green-500/20 bg-green-500/10 text-green-400">
              Completed
            </Badge>
            <span className="flex items-center gap-1 text-sm text-slate-500">
              <Calendar size={14} />{" "}
              {new Date(session?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">
            Interview <span className="text-green-400">Analysis.</span>
          </h1>
          <p className="text-lg font-bold tracking-widest text-slate-400 uppercase">
            {session?.topic} • {session?.difficulty}
          </p>
        </header>

        {/* STATS CARDS */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-slate-700 bg-zinc-900 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Trophy className="mb-2 text-green-500" size={28} />
              <p className="text-xs font-bold text-slate-500 uppercase">
                Overall Performance
              </p>
              <h2 className="mt-1 text-5xl font-black">
                {session?.score || 0}%
              </h2>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-zinc-900 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Target className="mb-2 text-green-500" size={28} />
              <p className="text-xs font-bold text-slate-500 uppercase">
                Domain
              </p>
              <h2 className="mt-2 truncate text-2xl font-bold">
                {session?.domain || "General"}
              </h2>
            </CardContent>
          </Card>
        </div>

        {/* DETAILED REPORT */}
        <Card className="border-slate-700 bg-zinc-900 shadow-2xl">
          <CardHeader className="border-b border-slate-700 px-8 py-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <MessageSquare className="text-cyan-400" />
              Detailed Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-line text-slate-300">
                {session?.report ||
                  "Your detailed analysis is being finalized. Please refresh in a moment."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
