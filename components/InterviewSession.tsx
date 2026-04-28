"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

export default function InterviewSession({ sessionId, config, onFinish }: any) {
  const [question, setQuestion] = useState("Initializing AI Interviewer...");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionCounter, setQuestionCounter] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // ---------------- SPEAK ----------------
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  // ---------------- SEND ANSWER ----------------
  const handleSendAnswer = async (finalTranscript: string) => {
    if (!finalTranscript.trim()) return;

    const userMessage = { role: "user", content: finalTranscript };
    const updated = [...messages, userMessage];
    setMessages(updated);

    setQuestion("Thinking...");

    await fetch("/api/interview/save-message", {
      method: "POST",
      body: JSON.stringify({ sessionId, message: userMessage }),
    });

    const res = await fetch("/api/interview/chat", {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        userText: finalTranscript,
      }),
    });

    const data = await res.json();

    setQuestion(data.question);
    setQuestionCounter((p) => p + 1);

    const assistantMsg = { role: "assistant", content: data.question };

    setMessages([...updated, assistantMsg]);

    speak(data.question);
    setTranscript("");
  };

  // ---------------- SPEECH RECOGNITION ----------------
  const toggleSpeech = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      handleSendAnswer(transcript);
      return;
    }

    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SR) return alert("Speech recognition not supported");

    const recog = new SR();
    recog.continuous = true;
    recog.interimResults = true;

    recog.onresult = (e: any) => {
      const text = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setTranscript(text);
    };

    recognitionRef.current = recog;
    recog.start();
    setIsRecording(true);
  };

  // ---------------- INIT ----------------
  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const res = await fetch("/api/interview/start", {
        method: "POST",
        body: JSON.stringify({ sessionId, ...config }),
      });

      const data = await res.json();

      setQuestion(data.question);
      setMessages([{ role: "assistant", content: data.question }]);

      speak(data.question);
    };

    init();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis.cancel();
    };
  }, [sessionId]);

  // ---------------- TOGGLES ----------------
  const toggleMic = () => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    }
  };

  const toggleCam = () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsCamOn(track.enabled);
    }
  };

  // ---------------- FINISH ----------------
  const hangUp = async () => {
    setIsEvaluating(true);

    const res = await fetch("/api/interview/evaluate", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    });

    const report = await res.json();
    onFinish(report);
  };

  // ---------------- UI ----------------
  return (
    <div className=" text-white flex flex-col mt-30">
      <main className="flex flex-1 items-center justify-center gap-10">
        {/* AI */}
        {/* AI */}
        <div className="w-150 h-[400px] rounded-xl overflow-hidden bg-zinc-900/50 text-white flex flex-col items-center justify-center">
          <motion.div
            animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-80 h-80 rounded-full border border-white/20 flex items-center justify-center text-8xl"
          >
            🤖
          </motion.div>

          <p className="mt-6 text-xl font-semibold">AI Interviewer</p>

          <p className="text-sm text-gray-400 text-center px-6 mt-2">
            {question}
          </p>
        </div>

        {/* USER */}
        <div className="w-[600px] h-[400px] rounded-xl overflow-hidden bg-zinc-900/50">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        </div>
      </main>

      {/* CONTROLS */}
      <footer className="h-24 flex items-center justify-center gap-6 mb-5">
        <button onClick={toggleMic}>{isMicOn ? <Mic /> : <MicOff />}</button>
        <button onClick={toggleCam}>
          {isCamOn ? <Video /> : <VideoOff />}
        </button>
        <button
          onClick={toggleSpeech}
          className={
            isRecording ? "bg-red-600 px-6 py-3" : "bg-blue-600 px-6 py-3"
          }
        >
          {isRecording ? "Stop" : "Speak"}
        </button>
        <button onClick={hangUp} className="bg-red-600 p-3 rounded-full">
          <PhoneOff />
        </button>
      </footer>

      {/* LOADING */}
      <AnimatePresence>
        {isEvaluating && (
          <motion.div className="fixed inset-0 bg-black flex items-center justify-center">
            <p>Evaluating Interview...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
