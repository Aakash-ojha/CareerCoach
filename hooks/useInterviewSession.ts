"use client";

import { useEffect, useRef, useState } from "react";

type Config = {
  domain: string;
  topic: string;
  difficulty: string;
};

export function useInterviewSession(
  sessionId: string,
  config: Config,
  onFinish: (report: any) => void,
) {
  // ================= STATE =================
  const [question, setQuestion] = useState("Loading your first question...");
  const [messages, setMessages] = useState<any[]>([]);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [answerStarted, setAnswerStarted] = useState(false);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // ================= REFS =================
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`/api/interview/session/${sessionId}`);
        const data = await res.json();

        if (data?.session) {
          setSessionData(data.session);

          setTimeRemaining(
            data.session.timeRemaining ?? data.session.timePreference * 60,
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const startRes = await fetch("/api/interview/start", {
          method: "POST",
          body: JSON.stringify({ sessionId, ...config }),
        });

        const startData = await startRes.json();

        setQuestion(startData.question);

        setMessages([{ role: "assistant", content: startData.question }]);

        speak(startData.question);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    init();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionId]);

  // ================= TIMER =================
  useEffect(() => {
    if (timeRemaining === null) return;

    if (timeRemaining <= 0) {
      finishInterview();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;

        if (prev <= 1) {
          clearInterval(timer);
          finishInterview();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // ================= SPEAK =================
  const speak = (text: string) => {
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);

    u.rate = 1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(u);
  };

  // ================= SEND ANSWER =================
  const handleSendAnswer = async (finalTranscript: string) => {
    const cleaned = finalTranscript.trim();
    if (!cleaned) return;

    const userMessage = {
      role: "user",
      content: cleaned,
    };

    const updated = [...messages, userMessage];
    setMessages(updated);

    setQuestion("Thinking...");

    try {
      await fetch("/api/interview/save-message", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          message: userMessage,
        }),
      });

      const res = await fetch("/api/interview/chat", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          userText: cleaned,
        }),
      });

      const data = await res.json();

      setQuestion(data.question);

      const aiMsg = {
        role: "assistant",
        content: data.question,
      };

      setMessages([...updated, aiMsg]);

      speak(data.question);

      setTranscript("");
      setIsRecording(false);
      setAnswerStarted(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SPEECH RECOGNITION =================
  const toggleSpeech = () => {
    if (!answerStarted) setAnswerStarted(true);

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      handleSendAnswer(transcript);
      return;
    }

    const SR =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SR) return alert("Speech not supported");

    const recog = new SR();

    recog.continuous = true;
    recog.interimResults = true;

    recog.onresult = (e: any) => {
      let final = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript + " ";
        }
      }

      if (final.trim()) {
        setTranscript((prev) =>
          prev ? prev + " " + final.trim() : final.trim(),
        );
      }
    };

    recognitionRef.current = recog;
    recog.start();
    setIsRecording(true);
  };

  // ================= FINISH =================
  const finishInterview = async () => {
    setIsEvaluating(true);

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        body: JSON.stringify({ sessionId }),
      });

      const data = await res.json();

      onFinish(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CONTROLS =================
  const toggleMic = () => {
    const t = streamRef.current?.getAudioTracks()[0];
    if (t) {
      t.enabled = !t.enabled;
      setIsMicOn(t.enabled);
    }
  };

  const toggleCam = () => {
    const t = streamRef.current?.getVideoTracks()[0];
    if (t) {
      t.enabled = !t.enabled;
      setIsCamOn(t.enabled);
    }
  };

  // ================= RETURN =================
  return {
    // state
    question,
    messages,
    transcript,
    isRecording,
    answerStarted,
    isMicOn,
    isCamOn,
    isSpeaking,
    timeRemaining,
    sessionData,
    isEvaluating,

    // refs
    videoRef,

    // actions
    toggleSpeech,
    toggleMic,
    toggleCam,
    finishInterview,
    setTranscript,
  };
}
