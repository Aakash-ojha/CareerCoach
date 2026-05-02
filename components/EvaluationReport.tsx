"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  MessageSquare,
  Target,
  ChevronLeft,
  Calendar,
  CheckCircle,
  AlertCircle,
  Mic,
  Brain,
} from "lucide-react";
import Link from "next/link";

export default function EvaluationReport({
  session,
  report,
  onBack,
}: {
  session: any;
  report: any;
  onBack: string;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white md:p-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href={onBack}
          className="group mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400"
        >
          <ChevronLeft size={18} />
          Back to Interview Setup
        </Link>

        {/* HEADER */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <Badge className="border-green-500/20 bg-green-500/10 text-green-400">
              Completed
            </Badge>

            <span className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar size={14} />
              {session?.createdAt
                ? new Date(session?.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>

          <h1 className="text-5xl font-black">
            Interview <span className="text-green-400">Feedback</span>
          </h1>

          <p className="mt-3 text-sm tracking-widest text-slate-400 uppercase">
            {session?.topic} • {session?.difficulty}
          </p>
        </header>

        {/* STATS */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-slate-700 bg-zinc-900">
            <CardContent className="pt-6">
              <Trophy className="mb-2 text-green-400" size={28} />
              <p className="text-xs text-slate-500 uppercase">Score</p>
              <h2 className="text-5xl font-black">
                {report?.score || session?.score || 0}%
              </h2>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-zinc-900">
            <CardContent className="pt-6">
              <Brain className="mb-2 text-cyan-400" size={28} />
              <p className="text-xs text-slate-500 uppercase">Confidence</p>
              <h2 className="text-2xl font-bold">
                {report?.confidenceLevel || "N/A"}
              </h2>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-zinc-900">
            <CardContent className="pt-6">
              <Target className="mb-2 text-yellow-400" size={28} />
              <p className="text-xs text-slate-500 uppercase">Domain</p>
              <h2 className="text-2xl font-bold">
                {session?.domain || "General"}
              </h2>
            </CardContent>
          </Card>
        </div>

        {/* STRENGTHS / WEAKNESSES */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <Card className="border-slate-700 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle size={20} />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-slate-300">
                {report?.strengths?.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle size={20} />
                Weaknesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-slate-300">
                {report?.weaknesses?.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* DETAILS */}
        <div className="space-y-6">
          <Card className="border-slate-700 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-cyan-400">
                <Mic size={20} />
                Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">{report?.communication}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-cyan-400">
                <MessageSquare size={20} />
                Technical Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">{report?.technicalFeedback}</p>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-base text-green-400">
                Final Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">{report?.finalSuggestion}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
