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
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
        <div className="flex flex-col items-center space-y-5 text-center">
          <div className="relative">
            <div className="h-14 w-14 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 h-14 w-14 animate-spin rounded-full border-4 border-green-400 border-t-transparent" />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Loading Interview Setup
            </h2>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Preparing topics and interview configuration for you...
            </p>
          </div>

          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse bg-green-400/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 text-center">
          <h1 className="mb-4 bg-linear-to-r from-white to-green-500 bg-clip-text text-5xl font-black text-transparent">
            Choose Your Interview Topic
          </h1>
          <p className="text-gray-400">
            Select a path or create your own custom challenge.
          </p>
        </header>

        {/* CUSTOM BUTTON */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.button
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => handleOpenModal(null, "Custom")}
            className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-green-500/50 bg-green-500/5 p-8 text-center transition-all hover:bg-green-500/10"
          >
            <div className="rounded-full bg-green-500 p-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black">Custom Topic</h3>
              <p className="text-sm text-green-300/70">
                Type any role or technology
              </p>
            </div>
          </motion.button>
        </div>

        {/* PRE-DEFINED TOPICS */}
        <div className="space-y-16">
          {Object.entries(groupedCategories).map(([domain, topics]) => (
            <section key={domain}>
              <h2 className="mb-8 flex items-center gap-3 bg-green-500 bg-clip-text text-3xl font-bold text-transparent">
                <span className="h-8 w-1 rounded-full bg-green-500" />
                {domain}
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                  <motion.button
                    key={topic}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleOpenModal(topic, domain)}
                    className={`rounded-3xl border p-6 text-left transition-all ${
                      selectedTopic === topic
                        ? "border-green-500 bg-green-500/10 shadow-[0_0_25px_rgba(34,197,94,0.15)]"
                        : "border-gray-800 bg-[#111] hover:border-gray-600"
                    }`}
                  >
                    <h3 className="text-xl font-bold">{topic}</h3>
                    <p className="mt-2 text-sm text-gray-500">
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
