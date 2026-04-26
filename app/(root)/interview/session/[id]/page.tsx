"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Bot } from "lucide-react";

export default function InterviewSession({ config, onFinish }: any) {
  const [question, setQuestion] = useState("Initializing AI Interviewer...");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionCounter, setQuestionCounter] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // --- LOGIC ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const handleSendAnswer = async (finalTranscript: string) => {
    if (!finalTranscript || finalTranscript.trim() === "") return;
    const userMessage = { role: "user", content: finalTranscript };
    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setQuestion("Thinking...");

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        body: JSON.stringify({ userText: finalTranscript, history: messages }),
      });
      const data = await res.json();
      setQuestion(data.question);
      setQuestionCounter((prev) => prev + 1);
      setMessages([
        ...updatedHistory,
        { role: "assistant", content: data.question },
      ]);
      speak(data.question);
      setTranscript("");
    } catch (err) {
      setQuestion("I'm sorry, I had trouble connecting.");
    }
  };

  const toggleSpeech = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      handleSendAnswer(transcript);
    } else {
      const SR =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      if (!SR) return alert("Speech recognition not supported.");
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (e: any) => {
        const text = Array.from(e.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setTranscript(text);
      };
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        const res = await fetch("/api/interview/start", {
          method: "POST",
          body: JSON.stringify(config),
        });
        const data = await res.json();
        setQuestion(data.question);
        setMessages([{ role: "assistant", content: data.question }]);
        speak(data.question);
      } catch (e) {
        console.error(e);
      }
    }
    setup();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis.cancel();
    };
  }, [config]);

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

  const hangUp = async () => {
    setIsEvaluating(true);
    const res = await fetch("/api/interview/evaluate", {
      method: "POST",
      body: JSON.stringify({ history: messages, topic: config.topic }),
    });
    const report = await res.json();
    onFinish(report);
  };

  return (
    <div className=" bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex items-center justify-center px-10 gap-10">
        {/* LEFT: AI INTERVIEWER */}
        <div className="flex flex-col items-center gap-4 flex-1">
          <div className="relative">
            {/* Animated Ring */}
            <motion.div
              animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-64 h-64 rounded-full border-2 border-blue-500/30 flex items-center justify-center bg-blue-900/10 backdrop-blur-sm shadow-[0_0_50px_rgba(59,130,246,0.1)]"
            >
              <div className="text-7xl">🤖</div>
            </motion.div>
            {/* Tag */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase">
              Interviewer
            </div>
          </div>
        </div>

        {/* RIGHT: USER VIDEO */}
        <div className="flex-[1.5] relative h-100">
          <div className="w-full h-full rounded-[32px] overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl relative">
            {isCamOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <VideoOff className="w-16 h-16 text-zinc-700" />
              </div>
            )}

            {/* Listening Indicator */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-600/20 backdrop-blur-md border border-red-500/50 px-8 py-3 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 font-medium text-sm">
                    Listening...
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="h-24  rounded-2xl flex items-center justify-center gap-6 border-t border-white/5 bg-black/40">
        <button
          onClick={toggleMic}
          className={`p-4 rounded-full transition-all ${isMicOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-red-600"}`}
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={toggleCam}
          className={`p-4 rounded-full transition-all ${isCamOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-red-600"}`}
        >
          {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={toggleSpeech}
          className={`px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all ${isRecording ? "bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-500"}`}
        >
          {isRecording ? "Stop Recording" : "Start Speaking"}
        </button>

        <button
          onClick={hangUp}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
        >
          <PhoneOff size={20} />
        </button>
      </footer>

      {/* EVALUATION OVERLAY */}
      <AnimatePresence>
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-xl font-medium tracking-wide">
              Analyzing your interview...
            </h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
