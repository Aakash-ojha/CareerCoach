"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Brain, Target } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center gap-8 py-20">
        <motion.div
          className="space-y-6 max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <div className="flex flex-col justify-center items-center">
              <Image
                src="/robot-new.png"
                width={200}
                height={200}
                alt="robot"
                priority
              />
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Master Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Interview Skills
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400">
                Get AI-powered interview coaching tailored to your dream job
              </p>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Practice with our intelligent AI interviewer, receive detailed
            feedback, and land your next opportunity with confidence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            variants={itemVariants}
          >
            <Link href="/sign-up">
              <Button className="h-12 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 w-full sm:w-auto">
                Get Started <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button className="h-12 px-8 text-lg font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Feature 1 */}
          <motion.div
            className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors"
            variants={featureVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Brain size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI-Powered</h3>
            </div>
            <p className="text-sm text-slate-400">
              Advanced AI interviewer that adapts to your skill level and
              experience
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors"
            variants={featureVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Zap size={24} className="text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Instant Feedback
              </h3>
            </div>
            <p className="text-sm text-slate-400">
              Get real-time feedback on your answers, tone, and body language
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-colors"
            variants={featureVariants}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Target size={24} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Job-Specific</h3>
            </div>
            <p className="text-sm text-slate-400">
              Practice for your target role with relevant questions and
              scenarios
            </p>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
