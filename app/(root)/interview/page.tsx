"use client";
import { useState } from "react";
import TopicSelectionPage from "@/components/TopicSelectionPage"; // Your selection UI
import InterviewSession from "@/components/InterviewSession"; // Your live session UI
import EvaluationReport from "@/components/EvaluationReport"; // Your scorecard UI

export default function InterviewPage() {
  // Stages: 'select' -> 'chat' -> 'report'
  const [stage, setStage] = useState<"select" | "chat" | "report">("select");

  // Data passed between components
  const [sessionConfig, setSessionConfig] = useState({
    domain: "",
    topic: "",
    difficulty: "",
  });
  const [finalReport, setFinalReport] = useState(null);

  // 1. Logic to transition from Selection to Live Chat
  const handleStartInterview = (data: {
    domain: string;
    topic: string;
    difficulty: string;
  }) => {
    setSessionConfig(data);
    setStage("chat");
  };

  // 2. Logic to transition from Live Chat to Final Report
  const handleFinishInterview = (reportData: any) => {
    setFinalReport(reportData);
    setStage("report");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. TOPIC SELECTION STAGE */}
      {stage === "select" && (
        <TopicSelectionPage onStart={handleStartInterview} />
      )}

      {/* 2. LIVE INTERVIEW SESSION STAGE */}
      {stage === "chat" && (
        <InterviewSession
          config={sessionConfig}
          onFinish={handleFinishInterview}
        />
      )}

      {/* 3. EVALUATION REPORT STAGE */}
      {stage === "report" && (
        <EvaluationReport
          report={finalReport}
          onReset={() => setStage("select")}
        />
      )}
    </div>
  );
}
