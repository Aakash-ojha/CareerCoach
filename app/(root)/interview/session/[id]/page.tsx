"use client";

import InterviewSession from "@/components/InterviewSession";
import { use } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const { id } = use(params);

  const handleFinish = (report: any) => {
    console.log("Final Report:", report);

    // later you can redirect to report page here
    // example:
    // router.push("/interview/report")
  };

  return <InterviewSession sessionId={id} onFinish={handleFinish} />;
}
