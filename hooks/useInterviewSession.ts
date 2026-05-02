"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Config = {
  domain: string;
  topic: string;
  difficulty: string;
};

export function useInterviewSession(
  sessionId: string,
  onFinish: (report: any) => void,
  config?: Config,
) {
  // ================= STATE =================
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );
  const [isReady, setIsReady] = useState(false);

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
  const [isCompleted, setIsCompleted] = useState(false);

  const [countdown, setCountdown] = useState<number | null>(null);

  // ================= REFS =================
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const configRef = useRef<any>(null);
  const sessionDataRef = useRef<any>(null);
  const isCompletedRef = useRef(false);

  // Keep ref in sync so event handlers always read the latest value
  useEffect(() => {
    isCompletedRef.current = isCompleted;
  }, [isCompleted]);

  // ================= INIT =================
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        setPermissionGranted(true);
        if (videoRef.current) videoRef.current.srcObject = stream;
        setIsReady(true);
      } catch (err) {
        console.error(err);
        setPermissionGranted(false);
        setIsReady(false);
        toast.error("Camera & microphone permission required");
      }
    };

    requestPermission();
  }, []);

  // ================= FINISH =================
  const finishInterview = async () => {
    if (isCompletedRef.current) return;
    setIsEvaluating(true);

    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to evaluate the session");
      }

      if (onFinish) onFinish(data);
    } catch (error: any) {
      console.error("Evaluation Error:", error);
      alert(error.message || "Something went wrong while evaluating.");
    } finally {
      setIsEvaluating(false);
      setIsCompleted(true);
    }
  };

  // ================= NAVIGATION GUARD =================
  // Ends the interview ONLY when the user navigates to a different route.
  //
  // ✅ Triggers completion:   Back/Forward button, router.push(), <Link> clicks
  // ❌ Does NOT trigger:      Reload, tab switch, tab close, window minimize
  //
  // Strategy:
  //   - Record `currentPath` when the effect mounts.
  //   - Listen to `popstate` (Back/Forward) and patch `pushState`/`replaceState`
  //     (used by the Next.js router for all client-side transitions).
  //   - If the pathname changes → call completeSession.
  //   - Reload does NOT fire popstate and does NOT change the pathname → ignored.
  //   - Tab/window close does NOT change the pathname → ignored.
  useEffect(() => {
    const completeSession = () => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true; // guard against double-calls
      fetch("/api/interview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
        keepalive: true,
      }).catch(() => {});
    };

    const currentPath = window.location.pathname;

    // Back / Forward navigation
    const handlePopState = () => {
      if (window.location.pathname !== currentPath) {
        completeSession();
      }
    };

    // Patch pushState — Next.js <Link> and router.push() use this
    const originalPushState = history.pushState.bind(history);
    history.pushState = function (
      ...args: Parameters<typeof history.pushState>
    ) {
      originalPushState(...args);
      if (window.location.pathname !== currentPath) {
        completeSession();
      }
    };

    // Patch replaceState — Next.js uses this on some transitions
    const originalReplaceState = history.replaceState.bind(history);
    history.replaceState = function (
      ...args: Parameters<typeof history.replaceState>
    ) {
      originalReplaceState(...args);
      if (window.location.pathname !== currentPath) {
        completeSession();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [sessionId]);

  // ================= START SESSION =================
  useEffect(() => {
    if (!isReady) return;

    const startSession = async () => {
      try {
        const res = await fetch(`/api/interview/session/${sessionId}`);
        const data = await res.json();

        if (!res.ok) {
          setIsCompleted(true);
          setQuestion(
            data.error || "This interview session has already been completed.",
          );
          return;
        }

        if (!data?.session) return;

        if (data.session.isCompleted || data.session.status === "completed") {
          setIsCompleted(true);
          setQuestion(
            "This interview is already completed or has ended. You cannot re-enter.",
          );
          return;
        }

        sessionDataRef.current = data.session;
        setSessionData(data.session);

        const activeConfig = {
          domain: data.session.domain,
          topic: data.session.topic,
          difficulty: data.session.difficulty,
        };
        configRef.current = activeConfig;

        if (data.session.startedAt) {
          const totalDurationInSeconds =
            Number(data.session.timePreference) * 60;
          const startedAtTime = new Date(data.session.startedAt).getTime();
          const elapsedSeconds = Math.floor(
            (Date.now() - startedAtTime) / 1000,
          );
          const remainingSeconds = totalDurationInSeconds - elapsedSeconds;

          if (remainingSeconds > 0) {
            setTimeRemaining(remainingSeconds);

            try {
              const startRes = await fetch("/api/interview/start", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, ...activeConfig }),
              });

              if (startRes.ok) {
                const startData = await startRes.json();
                setQuestion(startData.question);
                setMessages([
                  { role: "assistant", content: startData.question },
                ]);
                speak(startData.question);
              }
            } catch (err) {
              console.error("Failed to restore the question on reload", err);
            }
          } else {
            setTimeRemaining(0);
            finishInterview();
          }
        } else {
          setCountdown(5);
        }
      } catch (err) {
        console.error("Failed to initialize session data:", err);
      }
    };

    startSession();
  }, [isReady, sessionId]);

  // ================= COUNTDOWN =================
  useEffect(() => {
    if (countdown === null || !isReady || isCompleted) return;

    if (countdown === 0) {
      const startInterview = async () => {
        try {
          const startRes = await fetch("/api/interview/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, ...configRef.current }),
          });

          const startData = await startRes.json();

          setQuestion(startData.question);
          setMessages([{ role: "assistant", content: startData.question }]);
          speak(startData.question);

          if (sessionDataRef.current) {
            const totalDurationInSeconds =
              Number(sessionDataRef.current.timePreference) * 60;
            setTimeRemaining(totalDurationInSeconds);
          }
        } catch (err) {
          console.error("Start error:", err);
          toast.error("Failed to start the interview session");
        }
      };

      startInterview();
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, sessionId, isReady, isCompleted]);

  // ================= TIMER =================
  useEffect(() => {
    if (timeRemaining === null || countdown !== null || !isReady || isCompleted)
      return;

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

    return () => clearTimeout(timer);
  }, [timeRemaining, countdown, isReady, isCompleted]);

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
    if (!cleaned || isCompleted) return;

    const userMessage = { role: "user", content: cleaned };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setQuestion("Thinking...");

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: cleaned }),
      });

      if (!res.ok)
        throw new Error(`API returned error with status: ${res.status}`);

      const data = await res.json();
      if (!data.success)
        throw new Error(data.error || "Failed to process chat message");

      setQuestion(data.reply);
      setMessages([...updated, { role: "assistant", content: data.reply }]);
      speak(data.reply);
      setTranscript("");
      setIsRecording(false);
      setAnswerStarted(false);
    } catch (err) {
      console.error(err);
      toast.error(
        "Error submitting your response. Please check the AI connection.",
      );
      setQuestion(
        "Could not generate a response. Try speaking your answer again.",
      );
    }
  };

  // ================= SPEECH RECOGNITION =================
  const toggleSpeech = () => {
    if (isCompleted) return;
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
        if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
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

  // ================= CONTROLS =================
  const toggleMic = () => {
    if (isCompleted) return;
    const t = streamRef.current?.getAudioTracks()[0];
    if (t) {
      t.enabled = !t.enabled;
      setIsMicOn(t.enabled);
    }
  };

  const toggleCam = () => {
    if (isCompleted) return;
    const t = streamRef.current?.getVideoTracks()[0];
    if (t) {
      t.enabled = !t.enabled;
      setIsCamOn(t.enabled);
    }
  };

  if (permissionGranted === null) {
    return { permissionGranted, videoRef };
  }

  if (permissionGranted === false || isCompleted) {
    return {
      permissionGranted,
      videoRef,
      question: isCompleted
        ? "This interview is already completed or has ended. You cannot re-enter."
        : "Permission required",
      messages: [],
      transcript: "",
      isRecording: false,
      answerStarted: false,
      isMicOn: false,
      isCamOn: false,
      isSpeaking: false,
      timeRemaining: null,
      sessionData: null,
      isEvaluating: false,
      countdown: null,
      toggleSpeech: () => {},
      toggleMic: () => {},
      toggleCam: () => {},
      finishInterview,
      setTranscript,
      isCompleted,
    };
  }

  return {
    permissionGranted,
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
    countdown,
    videoRef,
    toggleSpeech,
    toggleMic,
    toggleCam,
    finishInterview,
    setTranscript,
    isCompleted,
  };
}
