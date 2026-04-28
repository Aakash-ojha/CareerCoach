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
      staggerChildren: 0.3,
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-900/70"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className={`rounded-lg p-2 ${item.iconBg}`}>
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-900/70"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex flex-row items-center gap-5">
          <div className="mb-4 text-3xl font-bold text-green-400">
            {item.step}
          </div>

          <h3 className="mb-2 text-xl font-semibold text-white">
            {item.title}
          </h3>
        </div>

        <p className="leading-relaxed text-slate-500">{item.description}</p>
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-900/70"
    >
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-green-400/20 bg-green-500/10">
          <CheckCircle className="text-green-400" size={20} />
        </div>

        <p className="text-base leading-relaxed font-medium text-white md:text-lg">
          {item}
        </p>
      </div>
    </motion.div>
  );
}
const looped = [...testimonials, ...testimonials];
function TestimonialMarquee() {
  return (
    <section className="w-full overflow-hidden bg-transparent py-3">
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
          className="flex w-max gap-6 px-4 md:gap-10"
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
              className="group relative w-75 shrink-0 overflow-hidden rounded-3xl p-px sm:w-95 lg:w-112.5 xl:w-125"
            >
              {/* card body */}
              <div className="relative flex h-full flex-col gap-6 rounded-3xl bg-zinc-900/60 p-8 backdrop-blur-md lg:p-10">
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-green-400 to-cyan-400 text-sm font-bold text-zinc-950 lg:h-14 lg:w-14 lg:text-base">
                    {item.name.charAt(0)}
                  </div>

                  <div className="text-left">
                    <p className="text-base font-bold tracking-wide text-white lg:text-xl">
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs tracking-widest text-green-400/90 uppercase lg:text-sm">
                      {item.role}
                    </p>
                  </div>
                </div>
                <p className="lg:text-0.5xl relative z-10 text-left text-base leading-relaxed font-medium text-white italic">
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
    <section className="relative mt-20 rounded-3xl border bg-zinc-900/50 px-6 py-28 md:py-36">
      {/* content */}
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
        {/* heading */}
        <div className="pointer-events-none absolute -z-10 h-52 w-72 rounded-full bg-white/30 opacity-100 blur-[120px] transition-all duration-1000 ease-out group-hover:h-62 group-hover:bg-white/35" />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
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
          className="max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
        >
          Practice with real interview simulations, get AI feedback, and improve
          faster than ever before.
        </motion.p>

        {/* button */}
        <Link href="/interview/setup">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="group relative flex h-12 cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-8 text-lg text-white transition-all duration-300 after:absolute after:inset-0 after:rounded-full after:bg-green-500/20 after:blur-xl after:transition-all after:duration-500 hover:scale-[1.02] hover:border-green-500/30 hover:after:bg-green-400/40 hover:after:blur-2xl active:scale-95"
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
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 py-20 text-center">
      {/* Hero */}
      <motion.div
        className="max-w-3xl space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="group relative flex flex-col items-center">
            <div className="pointer-events-none absolute -z-10 h-52 w-72 rounded-full bg-white/30 opacity-100 blur-[120px] transition-all duration-1000 ease-out group-hover:h-62 group-hover:bg-white/35" />
            <Image
              className="transition-transform duration-500 will-change-transform hover:scale-105"
              src="/robot-new.png"
              width={200}
              height={200}
              alt="robot"
              priority
            />

            <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
              Master Your
              <span className="bg-linear-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Interview Skills
              </span>
            </h1>

            <p className="text-xl text-slate-400 md:text-2xl">
              Get AI-powered interview coaching tailored to your dream job
            </p>
          </div>
        </motion.div>

        <motion.p
          className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-500"
          variants={itemVariants}
        >
          Practice with our intelligent AI interviewer, receive detailed
          feedback, and land your next opportunity with confidence.
        </motion.p>

        <motion.div
          className="flex justify-center pt-4"
          variants={itemVariants}
        >
          <Link href="/interview/setup">
            <Button className="group relative flex h-12 cursor-pointer items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-8 text-lg font-semibold text-white transition-all duration-300 after:absolute after:inset-0 after:rounded-full after:bg-green-500/20 after:blur-xl after:transition-all after:duration-500 hover:scale-[1.02] hover:border-green-500/30 hover:after:bg-green-400/40 hover:after:blur-2xl active:scale-95">
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
        className="mt-20 grid w-full max-w-6xl gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((item, index) => (
          <FeatureCard key={index} item={item} />
        ))}
      </motion.div>

      {/* How It Works */}
      <section className="w-full max-w-6xl px-6 py-20">
        <div className="mb-16 flex items-center gap-4">
          <div className="flex-1 border-t border-white/20" />
          <h2 className="text-4xl font-bold whitespace-nowrap text-white">
            How It Works
          </h2>
          <div className="flex-1 border-t border-white/20" />
        </div>

        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
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
      <section className="w-full px-6 py-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex items-center justify-center gap-6">
            <div className="w-full max-w-55 border-t border-white/10" />
            <h2 className="text-4xl font-bold tracking-tight whitespace-nowrap md:text-4xl">
              Why Choose Us
            </h2>
            <div className="w-full max-w-55 border-t border-white/10" />
          </div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
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
      <div className="w-full py-6 md:px-10 lg:px-10">
        <div className="flex flex-row items-center gap-6">
          <div className="flex-1 border-t border-white/20" />
          <h2 className="text-4xl font-bold whitespace-nowrap text-white">
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
