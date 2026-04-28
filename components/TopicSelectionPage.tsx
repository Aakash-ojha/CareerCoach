"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InterviewConfigModal from "./InterviewConfigModal";
import { Plus } from "lucide-react";

export default function TopicSelectionPage() {
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
        const res = await fetch("/api/topics");
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

  const handleOpenModal = (topic: string | null, domain: string | null) => {
    setSelectedTopic(topic);
    setSelectedDomain(domain);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
    setSelectedDomain(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-green-500">
        <div className="animate-pulse font-bold text-xl">
          Loading Interview Tracks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black mb-4 bg-linear-to-r from-white to-green-500 bg-clip-text text-transparent">
            Choose Your Interview Topic
          </h1>
          <p className="text-gray-400">
            Select a path or create your own custom challenge.
          </p>
        </header>

        {/* CUSTOM BUTTON */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <motion.button
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => handleOpenModal(null, "Custom")}
            className="p-8 rounded-3xl border-2 border-dashed border-green-500/50 bg-green-500/5 hover:bg-green-500/10 transition-all flex flex-col items-center justify-center gap-4 text-center"
          >
            <div className="p-4 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black">Custom Topic</h3>
              <p className="text-green-300/70 text-sm">
                Type any role or technology
              </p>
            </div>
          </motion.button>
        </div>

        {/* PRE-DEFINED TOPICS */}
        <div className="space-y-16">
          {Object.entries(groupedCategories).map(([domain, topics]) => (
            <section key={domain}>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 bg-green-500 bg-clip-text text-transparent">
                <span className="h-8 w-1 bg-green-500 rounded-full" />
                {domain}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleOpenModal(topic, domain)}
                    className={`p-6 rounded-3xl border text-left transition-all ${
                      selectedTopic === topic
                        ? "border-green-500 bg-green-500/10 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
                        : "border-gray-800 bg-[#111] hover:border-gray-600"
                    }`}
                  >
                    <h3 className="text-xl font-bold">{topic}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Practice {topic} targeted questions.
                    </p>
                  </motion.button>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* MODAL TRIGGER */}
        {isModalOpen && (
          <InterviewConfigModal
            isModelOpen={isModalOpen}
            setIsModelOpen={handleCloseModal}
            selectedTopic={selectedTopic}
            selectedDomain={selectedDomain}
          />
        )}
      </div>
    </div>
  );
}
