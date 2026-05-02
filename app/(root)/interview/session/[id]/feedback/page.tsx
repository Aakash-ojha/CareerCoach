"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import EvaluationReport from "@/components/EvaluationReport";

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  const fetchSession = async () => {
    const res = await fetch(`/api/interview/session/${id}`);
    const data = await res.json();
    return data?.session;
  };

  const evaluateIfNeeded = async (sessionData: any) => {
    if (sessionData?.report) return sessionData;

    setEvaluating(true);

    const evalRes = await fetch("/api/interview/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId: id }),
    });

    const evalData = await evalRes.json();

    if (!evalData.success) {
      setEvaluating(false);
      return sessionData;
    }

    // Re-fetch updated session with the report generated
    const updated = await fetchSession();
    setEvaluating(false);

    return updated;
  };

  useEffect(() => {
    const load = async () => {
      try {
        let sessionData = await fetchSession();

        if (!sessionData) {
          setLoading(false);
          return;
        }

        sessionData = await evaluateIfNeeded(sessionData);

        setSession(sessionData);
      } catch (err) {
        console.error("Feedback load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading || evaluating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
          <h2 className="text-2xl font-bold">
            {evaluating ? "Analyzing Your Interview..." : "Loading..."}
          </h2>
          <p className="mt-2 text-slate-400">
            AI is preparing your performance report
          </p>
        </div>
      </div>
    );
  }

  const report = session?.report;

  // Handle case where evaluation failed or returned without report
  if (!report) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-white md:p-12">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/interview/setup"
            className="group mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400"
          >
            <ChevronLeft size={18} />
            Back to Interview Setup
          </Link>

          <div className="mt-12 text-center">
            <h2 className="text-3xl font-bold text-red-400">No Report Found</h2>
            <p className="mt-2 text-slate-400">
              We encountered an issue generating your feedback report or the
              analysis is still incomplete.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EvaluationReport
      session={session}
      report={report}
      onBack="/interview/setup"
    />
  );
}
