"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  User,
  Clock,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { useRouter } from "next/navigation";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { useEffect, useRef } from "react";

export default function InterviewSession({ sessionId, config, onFinish }: any) {
  const router = useRouter();
  const {
    permissionGranted,
    question,
    transcript,
    isRecording,
    answerStarted,
    isMicOn,
    isCamOn,
    isSpeaking,
    isEvaluating,
    timeRemaining,
    sessionData,
    videoRef,
    setTranscript,
    toggleSpeech,
    countdown,
    toggleMic,
    toggleCam,
    finishInterview,
  } = useInterviewSession(sessionId, onFinish);

  const transcriptInputRef = useRef<HTMLTextAreaElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (countdown !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup to ensure normal scroll is restored if the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [countdown]);

  if (permissionGranted === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  if (permissionGranted === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-white">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-green-500">
            Permission Required
          </div>
          <p className="mb-6 text-slate-400">
            Camera and microphone access is required to start the interview.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-cyan-600 px-6 py-3 font-bold hover:bg-cyan-700"
          >
            Retry Permission
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {countdown !== null && (
        <div className="bg-background/90 fixed inset-0 z-100 flex h-screen w-screen flex-col items-center justify-center backdrop-blur-sm">
          <h2 className="mb-4 text-3xl font-bold">Starting in</h2>
          <span className="text-primary animate-ping text-6xl font-extrabold">
            {countdown}
          </span>

          <span className="mt-6 text-2xl">
            Note: Leaving the page will end your interview
          </span>
        </div>
      )}

      <div className="min-h-screen px-3 py-4 text-white sm:px-6 sm:py-10">
        <main className="mx-auto max-w-7xl">
          {/* HEADER WITH TIMER AND SESSION INFO */}

          <div className="mb-6 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="bg-white bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                Live AI Interview
              </h1>

              <p className="mt-1 text-sm text-slate-300 sm:text-base">
                Answer naturally and improve your performance
              </p>

              {/* Session Info Badges */}

              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                <div className="rounded-full border border-green-500/50 px-3 py-1.5 text-xs font-medium sm:text-sm">
                  <span className="text-green-300">📌 Topic:</span>

                  <span className="ml-2 text-slate-200">
                    {sessionData?.topic || "Loading..."}
                  </span>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-full border border-green-500/50 px-3 py-1.5 text-xs font-medium sm:text-sm"
                >
                  <span className="text-green-300">⚡ Level:</span>

                  <span className="ml-2 text-slate-200 capitalize">
                    {sessionData?.difficulty || "Loading..."}
                  </span>
                </motion.div>

                <div className="rounded-full border border-green-500/50 px-3 py-1.5 text-xs font-medium sm:text-sm">
                  <span className="text-green-300">⏱️ Duration:</span>

                  <span className="ml-2 text-slate-200">
                    {sessionData?.timePreference || "Loading..."} min
                  </span>
                </div>
              </div>
            </div>

            {/* Timer Display */}

            {timeRemaining > 0 && (
              <motion.div
                animate={{
                  scale: timeRemaining < 60 ? [1, 1.05, 1] : 1,
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`flex shrink-0 items-center gap-2 rounded-full border-2 px-4 py-3 text-lg font-bold backdrop-blur-sm sm:text-xl ${
                  timeRemaining < 60
                    ? "border-red-500 bg-red-500/20 text-green-400"
                    : "border-green-500 bg-cyan-500/20 text-green-400"
                }`}
              >
                <Clock size={20} />

                <span>{formatTime(timeRemaining)}</span>
              </motion.div>
            )}
          </div>

          {/* MAIN PANELS - Responsive Grid */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:gap-8 lg:grid-cols-2">
            {/* AI PANEL */}

            <Card className="relative min-h-75 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-2xl backdrop-blur-sm sm:min-h-125 sm:rounded-3xl">
              <CardContent className="relative flex h-full flex-col items-center justify-center p-4 text-center sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-40" />

                <div
                  className={`z-10 flex h-30 w-30 shrink-0 items-center justify-center rounded-full border-2 bg-linear-to-br from-slate-700 to-slate-800 text-5xl shadow-[0_0_60px_rgba(34,211,238,0.15)] transition-all duration-300 sm:h-44 sm:w-44 sm:text-8xl md:h-52 md:w-52 ${
                    isSpeaking
                      ? "scale-105 border-cyan-400"
                      : "border-slate-600"
                  }`}
                >
                  🤖
                </div>

                <h2 className="z-10 mt-4 text-xl font-bold sm:mt-6 sm:text-2xl">
                  AI Interviewer
                </h2>

                <p className="z-10 mt-3 max-w-xs text-center text-sm leading-relaxed text-slate-300 sm:mt-4 sm:max-w-md sm:text-base">
                  {question}
                </p>
              </CardContent>
            </Card>

            {/* USER PANEL - VIDEO */}

            <Card className="relative min-h-100 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-0 shadow-2xl backdrop-blur-sm sm:min-h-125 sm:rounded-3xl">
              <CardContent className="relative h-full p-0">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    isCamOn ? "block opacity-100" : "hidden opacity-0"
                  }`}
                />

                {!isCamOn && (
                  <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center bg-slate-800">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-700 sm:h-40 sm:w-40">
                      <User className="h-12 w-12 text-slate-400 sm:h-20 sm:w-20" />
                    </div>

                    <h2 className="mt-4 text-xl font-bold sm:mt-6 sm:text-2xl">
                      Camera Off
                    </h2>

                    <p className="mt-2 text-sm text-slate-400 sm:text-base">
                      Your camera is disabled
                    </p>
                  </div>
                )}

                <Badge className="absolute bottom-3 left-3 rounded-full border border-slate-600 bg-black/60 px-3 py-2 text-slate-300 backdrop-blur-md hover:bg-black/60 sm:bottom-4 sm:left-4 sm:px-4">
                  You (Candidate)
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* LIVE TRANSCRIPT - Editable */}

          {answerStarted && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 rounded-xl border-2 border-l-4 border-slate-700 border-l-cyan-500 bg-slate-800/50 p-4 backdrop-blur-sm sm:mb-8 sm:rounded-2xl sm:p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold tracking-widest text-cyan-400 uppercase">
                    🎤 {isRecording ? "Listening..." : "Review your answer"}
                  </p>

                  {!isRecording && (
                    <p className="text-xs text-slate-400">Click to edit</p>
                  )}
                </div>

                <textarea
                  ref={transcriptInputRef}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full resize-none rounded-lg border border-slate-600 bg-slate-700/50 p-3 text-base text-white placeholder-slate-400 transition-all outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-70 sm:text-lg"
                  rows={3}
                  placeholder="Your speech will appear here. You can edit it before submitting."
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* CONTROLS - Mobile Optimized */}

          <footer className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6">
            {/* Mic Button */}

            <button
              onClick={toggleMic}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold transition-all sm:h-14 sm:w-14 ${
                isMicOn
                  ? "border-green-600 bg-slate-700 text-white hover:bg-slate-600"
                  : "border-red-500/50 bg-red-500/20 text-red-400"
              }`}
              title={isMicOn ? "Mute" : "Unmute"}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Camera Button */}

            <button
              onClick={toggleCam}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold transition-all sm:h-14 sm:w-14 ${
                isCamOn
                  ? "border-green-600 bg-slate-700 text-white hover:bg-slate-600"
                  : "border-red-500/50 bg-red-500/20 text-red-400"
              }`}
              title={isCamOn ? "Turn off camera" : "Turn on camera"}
            >
              {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            <button
              onClick={toggleSpeech}
              disabled={
                (isRecording || answerStarted) && transcript.trim().length === 0
              }
              className={`h-12 rounded-full px-6 text-sm font-bold shadow-lg transition-all sm:h-14 sm:px-10 sm:text-base ${
                isRecording
                  ? "border-2 border-red-500 bg-red-600 hover:bg-red-700"
                  : "border-2 border-cyan-500/50 bg-linear-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700"
              } disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale`}
            >
              {isRecording || answerStarted ? "Stop & Submit" : "Start Answer"}
            </button>

            {/* End Interview Button */}

            <button
              onClick={finishInterview}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-500/50 bg-red-600 shadow-lg transition-all hover:bg-red-700 sm:h-14 sm:w-14"
              title="End interview"
            >
              <PhoneOff size={20} />
            </button>
          </footer>
        </main>

        {/* EVALUATION LOADER */}

        <AnimatePresence>
          {isEvaluating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 backdrop-blur-xl"
            >
              <div className="max-w-sm text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="mx-auto mb-6 h-16 w-16 rounded-full border-4 border-cyan-500 border-t-transparent sm:mb-8 sm:h-24 sm:w-24"
                />

                <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
                  Generating Report
                </h2>

                <p className="text-sm text-slate-400 sm:text-base">
                  Our AI is analyzing your performance, transcript, and
                  sentiment. This will just take a moment...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
