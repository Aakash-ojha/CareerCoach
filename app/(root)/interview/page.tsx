"use client";
import { useState, useEffect, useRef } from "react";

export default function InterviewPage() {
  const [question, setQuestion] = useState("Loading your interview...");
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  // NEW: Camera and Mic states
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userText: null, history: [] }),
        });
        const data = await res.json();

        setQuestion(data.question);
        speak(data.question);
        setMessages([{ role: "assistant", content: data.question }]);
        setIsLive(true);
      } catch (err) {
        setQuestion("Please enable camera and microphone to start.");
      }
    };
    init();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  // NEW: Toggle Camera track
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  // NEW: Toggle Microphone track
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicOn(audioTrack.enabled);
    }
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRecord = () => {
    // If the mic is toggled OFF manually, don't let them record
    if (!isMicOn) return alert("Please unmute your microphone to answer!");

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsRecording(false);
      if (!transcript.trim()) return;

      setQuestion("Thinking...");
      const updatedHistory = [
        ...messages,
        { role: "user", content: transcript },
      ];

      try {
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userText: transcript,
            history: updatedHistory,
          }),
        });
        const data = await res.json();
        setQuestion(data.question);
        speak(data.question);
        setMessages([
          ...updatedHistory,
          { role: "assistant", content: data.question },
        ]);
      } catch (err) {
        setQuestion("Connection error. Try again.");
      }
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0d0d0d]">
        <h1 className="text-xl font-bold tracking-tight text-blue-400">
          CareerCoach{" "}
          <span className="text-white opacity-50 font-normal">
            | Live Interview
          </span>
        </h1>
        <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-full border border-gray-800">
          <div
            className={`w-2.5 h-2.5 rounded-full ${isLive ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-xs font-bold uppercase tracking-tighter opacity-80">
            {isLive ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 items-center max-w-7xl mx-auto w-full">
        {/* Left Side: AI Interviewer */}
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <div
              className={`w-56 h-56 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center transition-all duration-500 ${isRecording ? "scale-105 border-blue-400" : ""}`}
            >
              <span className="text-7xl z-10">🤖</span>
            </div>
            {isRecording && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                Listening
              </div>
            )}
          </div>
          <div className="w-full max-w-lg bg-[#161616] p-8 rounded-[2rem] border border-gray-800 relative">
            <p className="text-xl font-medium leading-relaxed text-gray-100">
              {question}
            </p>
          </div>
        </div>

        {/* Right Side: User Video & Controls */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-full aspect-video bg-black rounded-[2.5rem] border-2 border-gray-800 overflow-hidden relative shadow-2xl">
            {/* Dark Placeholder when camera is off */}
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#111] z-10">
                <span className="text-gray-500 text-4xl">Camera Hidden</span>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${!isCameraOn ? "opacity-0" : "opacity-100"}`}
            />

            {/* Media Control Overlay */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
              <button
                onClick={toggleMic}
                className={`p-4 rounded-full backdrop-blur-md border ${isMicOn ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-red-500 border-red-400 text-white"}`}
                title={isMicOn ? "Mute" : "Unmute"}
              >
                {isMicOn ? "🎤" : "🔇"}
              </button>
              <button
                onClick={toggleCamera}
                className={`p-4 rounded-full backdrop-blur-md border ${isCameraOn ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-red-500 border-red-400 text-white"}`}
                title={isCameraOn ? "Hide Camera" : "Show Camera"}
              >
                {isCameraOn ? "📹" : "❌"}
              </button>
            </div>
          </div>

          <button
            onClick={handleRecord}
            disabled={!isLive || question === "Thinking..."}
            className={`px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all ${isRecording ? "bg-red-500 text-white" : "bg-white text-black hover:bg-blue-500 hover:text-white"} disabled:opacity-50`}
          >
            {isRecording ? "Stop & Submit" : "Start Answering"}
          </button>
        </div>
      </main>
    </div>
  );
}
