"use client";

import InterviewSession from "@/components/InterviewSession";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/interview/session/${id}`);
        const data = await response.json();

        // if session not found → show completed UI instead of dashboard
        if (!response.ok || !data?.session) {
          setIsCompleted(true);
          setIsChecking(false);
          return;
        }

        const session = data.session;

        //  if interview already completed
        if (session.status === "completed" || session.isCompleted === true) {
          setIsCompleted(true);
        } else {
          // otherwise show InterviewSession
          setIsCompleted(false);
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Session verify failed:", error);

        // fallback → also show completed UI
        setIsCompleted(true);
        setIsChecking(false);
      }
    };

    verifySession();
  }, [id]);

  const handleFinish = (report: any) => {
    // console.log("Final Report:", report);

    // after interview finishes → show completed UI
    setIsCompleted(true);
  };

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-white">
        <div className="flex flex-col items-center gap-4 text-center">
          <CheckCircle className="h-20 w-20 text-green-400" />
          <h1 className="text-4xl font-black">Interview Completed</h1>

          <p className="max-w-sm text-slate-400">
            Your interview has ended. Your responses are being evaluated.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.replace(`/interview/session/${id}/feedback`)}
            className="cursor-pointer rounded-lg bg-green-600 px-6 py-3 font-bold hover:bg-green-700"
          >
            View Feedback
          </button>

          <button
            onClick={() => router.replace("/interview/setup")}
            className="cursor-pointer rounded-lg border border-slate-600 px-6 py-3 font-bold hover:bg-zinc-900/50"
          >
            Select Another Topic
          </button>
        </div>
      </div>
    );
  }

  // ✅ Otherwise always show InterviewSession
  return <InterviewSession sessionId={id} onFinish={handleFinish} />;
}
