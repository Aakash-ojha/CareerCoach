"use client";

import { useState } from "react";

export default function InterviewPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  // Get question from API
  const getQuestion = async () => {
    const res = await fetch("/api/generate-question", {
      method: "POST",
    });

    const data = await res.json();
    setQuestion(data.question);
    setFeedback("");
    setAnswer("");
  };

  // Fake submit (we’ll connect AI later)
  const submitAnswer = async () => {
    setFeedback("Good attempt! Improve clarity and add examples.");
  };

  return (
    <div className="p-10 max-w-xl">
      <h1 className="text-xl font-bold mb-4">AI Interview</h1>

      <button
        onClick={getQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Question
      </button>

      {question && (
        <div className="mt-6">
          <p className="font-semibold">{question}</p>

          <textarea
            className="w-full border mt-3 p-2"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />

          <button
            onClick={submitAnswer}
            className="bg-green-500 text-white px-4 py-2 rounded mt-3"
          >
            Submit Answer
          </button>
        </div>
      )}

      {feedback && (
        <div className="mt-5 p-4 border rounded">
          <h2 className="font-bold">Feedback</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
