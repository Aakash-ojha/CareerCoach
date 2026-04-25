"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Zap, Target, CheckCircle } from "lucide-react";
import type { Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const featureVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const features = [
  {
    title: "AI-Powered",
    description:
      "Advanced AI interviewer that adapts to your skill level and experience",
    icon: Brain,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
  },
  {
    title: "Instant Feedback",
    description:
      "Get real-time feedback on your answers, tone, and body language",
    icon: Zap,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
  },
  {
    title: "Job-Specific",
    description:
      "Practice for your target role with relevant questions and scenarios",
    icon: Target,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
  },
];

const steps = [
  {
    step: "01",
    title: "Choose Type",
    description: "Select your interview category and difficulty level.",
  },
  {
    step: "02",
    title: "Start Interview",
    description: "AI conducts a realistic mock interview session.",
  },
  {
    step: "03",
    title: "Get Feedback",
    description: "Receive detailed analysis and improvement tips.",
  },
];

const benefits = [
  "Voice-based real interview experience",
  "AI-generated smart follow-up questions",
  "Performance score after every interview",
  "Confidence and communication analysis",
  "Unlimited practice sessions",
  "Role-specific technical preparation",
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer",
    text: "This AI interview platform helped me clear 3 technical interviews in a row.",
  },
  {
    name: "Ananya Verma",
    role: "Frontend Developer",
    text: "The AI asks follow-up questions just like real interviewers. Super realistic!",
  },
  {
    name: "Aayush Khatri",
    role: "CS Student",
    text: "I used this daily before placements. It boosted my confidence massively.",
  },
  {
    name: "Sneha Joshi",
    role: "Backend Developer",
    text: "Best mock interview experience I’ve ever used. Feedback is very accurate.",
  },
];

function FeatureCard({ item }: any) {
  const Icon = item.icon;

  return (
    <motion.div
      variants={featureVariants}
      whileHover={{ y: -5 }}
      className="group relative h-full flex flex-col p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm hover:border-blue-500/30 hover:bg-zinc-900/70 transition-all duration-300 shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${item.iconBg}`}>
            <Icon size={24} className={item.iconColor} />
          </div>

          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
        </div>

        <p className="text-sm text-slate-400">{item.description}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ item }: any) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6 }}
      className="group relative h-full flex flex-col p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm hover:border-blue-500/30 hover:bg-zinc-900/70 transition-all duration-300 shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="flex flex-row gap-5 items-center">
          <div className="text-green-400 text-3xl font-bold mb-4">
            {item.step}
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">
            {item.title}
          </h3>
        </div>

        <p className="text-slate-500 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

function BenefitCard({ item }: any) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group relative h-full flex flex-col p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm hover:border-blue-500/30 hover:bg-zinc-900/70 transition-all duration-300 shadow-lg overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start gap-4 z-10">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-400/20 flex items-center justify-center">
          <CheckCircle className="text-green-400" size={20} />
        </div>

        <p className="text-white text-base md:text-lg font-medium leading-relaxed">
          {item}
        </p>
      </div>
    </motion.div>
  );
}
const looped = [...testimonials, ...testimonials];
function TestimonialMarquee() {
  return (
    <section className="w-full py-3 overflow-hidden bg-transparent">
      {/* Marquee Container */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          /* This mask makes the slow movement look much more natural/pro */
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <motion.div
          className="flex gap-6 md:gap-10 w-max px-4"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 50,
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {looped.map((item, i) => (
            <div
              key={i}
              className="
                relative shrink-0 
                w-75 sm:w-95 lg:w-112.5 xl:w-125
                p-px rounded-3xl overflow-hidden group
              "
            >
              {/* card body */}
              <div className="relative h-full p-8 lg:p-10 rounded-3xl bg-zinc-900/60 backdrop-blur-md flex flex-col gap-6">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-linear-to-br from-green-400 to-cyan-400 flex items-center justify-center text-zinc-950 font-bold text-sm lg:text-base">
                    {item.name.charAt(0)}
                  </div>

                  <div className="text-left">
                    <p className="text-white font-bold text-base lg:text-xl tracking-wide">
                      {item.name}
                    </p>
                    <p className="text-green-400/90 text-xs lg:text-sm font-mono uppercase tracking-widest mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>
                <p className="text-white text-base lg:text-0.5xl leading-relaxed relative z-10 font-medium italic text-left">
                  “{item.text}”
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
function AcePareCTA() {
  return (
    <section className="relative mt-20 py-28 md:py-36 px-6 border bg-zinc-900/50 rounded-3xl">
      {/* content */}
      <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
        {/* heading */}
        <div
          className="absolute w-72 h-52 rounded-full -z-10 pointer-events-none 
            bg-white/30 opacity-100 
            group-hover:bg-white/35 group-hover:h-62
            blur-[120px] 
            transition-all duration-1000 
            ease-out"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
        >
          Ready to{" "}
          <span className="bg-linear-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
            Ace
          </span>{" "}
          Your Next Interview?
        </motion.h2>

        {/* subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
        >
          Practice with real interview simulations, get AI feedback, and improve
          faster than ever before.
        </motion.p>

        {/* button */}
        <Link href="interview">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="group relative h-12 px-8 text-lg  bg-slate-900 text-white rounded-full flex items-center gap-2 
          after:absolute after:inset-0 after:rounded-full after:bg-green-500/20 after:blur-xl after:transition-all after:duration-500
          hover:after:bg-green-400/40 hover:after:blur-2xl
          transition-all duration-300 border border-slate-800 hover:border-green-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span className="relative z-10">Start Your Mock Interview</span>

            <ArrowRight
              size={20}
              className="relative z-10 transition-transform group-hover:translate-x-1"
            />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center gap-8 py-20">
      {/* Hero */}
      <motion.div
        className="space-y-6 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex flex-col items-center group relative">
            <div
              className="absolute w-72 h-52 rounded-full -z-10 pointer-events-none 
            bg-white/30 opacity-100 
            group-hover:bg-white/35 group-hover:h-62
            blur-[120px] 
            transition-all duration-1000 
            ease-out"
            />
            <Image
              className="will-change-transform transition-transform duration-500 hover:scale-105"
              src="/robot-new.png"
              width={200}
              height={200}
              alt="robot"
              priority
            />

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Master Your
              <span className="bg-linear-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Interview Skills
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400">
              Get AI-powered interview coaching tailored to your dream job
            </p>
          </div>
        </motion.div>

        <motion.p
          className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Practice with our intelligent AI interviewer, receive detailed
          feedback, and land your next opportunity with confidence.
        </motion.p>

        <motion.div
          className="flex justify-center pt-4"
          variants={itemVariants}
        >
          <Link href="/interview">
            <Button
              className="group relative h-12 px-8 text-lg font-semibold bg-slate-900 text-white rounded-full flex items-center gap-2 
              after:absolute after:inset-0 after:rounded-full after:bg-green-500/20 after:blur-xl after:transition-all after:duration-500
              hover:after:bg-green-400/40 hover:after:blur-2xl
              transition-all duration-300 border border-slate-800 hover:border-green-500/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight
                size={20}
                className="relative z-10 transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features */}
      <motion.div
        className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((item, index) => (
          <FeatureCard key={index} item={item} />
        ))}
      </motion.div>

      {/* How It Works */}
      <section className="py-20 px-6 w-full max-w-6xl">
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 border-t border-white/20" />
          <h2 className="text-4xl font-bold text-white whitespace-nowrap">
            How It Works
          </h2>
          <div className="flex-1 border-t border-white/20" />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((item, index) => (
            <StepCard key={index} item={item} />
          ))}
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 md:px-10 lg:px-20 py-6 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-16">
            <div className="w-full max-w-55 border-t border-white/10" />
            <h2 className="text-4xl md:text-4xl font-bold whitespace-nowrap tracking-tight">
              Why Choose Us
            </h2>
            <div className="w-full max-w-55 border-t border-white/10" />
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((item, index) => (
              <BenefitCard key={index} item={item} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* What Users Says */}
      <div className="py-6 md:px-10 lg:px-10 w-full">
        <div className="flex flex-row items-center gap-6">
          <div className="flex-1 border-t border-white/20" />
          <h2 className="text-4xl font-bold text-white whitespace-nowrap">
            What users Says
          </h2>
          <div className="flex-1 border-t border-white/20" />
        </div>
      </div>
      <TestimonialMarquee />

      {/* Ready To Ace Your Interview */}
      <AcePareCTA />
    </section>
  );
}
