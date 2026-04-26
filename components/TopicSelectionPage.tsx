"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InterviewConfigModal from "./InterviewConfigModal";

export default function TopicSelectionPage({
  onStart,
}: {
  onStart: (topic: string, domain: string) => void;
}) {
  const [groupedCategories, setGroupedCategories] = useState<
    Record<string, string[]>
  >({});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch("/api/topics"); //
        const data = await res.json();
        setGroupedCategories(data);
      } catch (err) {
        console.error("Failed to load topics", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-blue-500">
        Loading Interview Tracks...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-center mb-12">
          Choose Your Interview Topic
        </h1>

        <div className="space-y-12">
          {Object.entries(groupedCategories).map(([domain, topics]) => (
            <div key={domain}>
              <h2 className="text-2xl font-bold mb-6 text-blue-400 border-l-4 border-blue-500 pl-4">
                {domain}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {topics.map((topic) => (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedTopic(topic);
                      setSelectedDomain(domain);
                    }}
                    className={`p-6 rounded-3xl border transition-all text-left ${
                      selectedTopic === topic
                        ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        : "border-gray-800 bg-[#141414] hover:border-gray-600"
                    }`}
                  >
                    <h3 className="text-xl font-bold">{topic}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Practice {topic} interview questions.
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            onClick={() =>
              selectedTopic &&
              selectedDomain &&
              onStart(selectedTopic, selectedDomain)
            }
            disabled={!selectedTopic}
            className="px-12 py-4 rounded-full font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
          >
            Start {selectedTopic || "Interview"}
          </button>
        </div>

        {isModalOpen && (
          <InterviewConfigModal
            isModelOpen={isModalOpen}
            setIsModelOpen={setIsModalOpen}
            selectedTopic={selectedTopic}
          />
        )}
      </div>
    </div>
  );
}
