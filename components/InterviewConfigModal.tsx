"use client";

import {
  useState,
  useEffect,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";

type InterviewConfigModalProps = {
  isModelOpen: boolean;
  setIsModelOpen: Dispatch<SetStateAction<boolean>>;
  selectedTopic?: string | null;
  selectedDomain?: string | null;
};

const InterviewConfigModal = ({
  isModelOpen,
  setIsModelOpen,
  selectedTopic,
  selectedDomain,
}: InterviewConfigModalProps) => {
  const router = useRouter();

  // Local state
  const [topicInput, setTopicInput] = useState(selectedTopic || "");
  const [difficulty, setDifficulty] = useState("beginner");
  const [time, setTime] = useState("10");
  const [loading, setLoading] = useState(false);

  // Sync topic when selectedTopic changes
  useEffect(() => {
    setTopicInput(selectedTopic || "");
  }, [selectedTopic]);

  const isSelectedTopic = !!selectedTopic;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!topicInput.trim()) return;

    const formData = {
      topic: topicInput,
      difficulty,
      timePreference: time,
      domain: selectedDomain || "General",
    };

    try {
      setLoading(true);

      const res = await fetch("/api/interview/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setIsModelOpen(false);
      router.push(`/interview/session/${data.sessionId}`);
    } catch (error) {
      console.error("ERROR:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DialogContent className="border-gray-800 bg-[#0f0f0f] text-white sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Configure Interview
            </DialogTitle>

            <DialogDescription className="text-gray-400">
              {selectedTopic
                ? `Ready to practice ${selectedTopic}?`
                : "Enter any topic you want to be interviewed on."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-6 py-4">
            {/* TOPIC INPUT */}
            <Field>
              <Label className="text-sm font-medium text-gray-300">
                Interview Topic
              </Label>

              <Input
                className="mt-2 border-gray-700 bg-[#1a1a1a] focus:ring-blue-500"
                placeholder="e.g. Senior Frontend Engineer, Rust Basics"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                required
                readOnly={isSelectedTopic}
              />
            </Field>

            {/* DIFFICULTY */}
            <Field>
              <Label className="mb-3 block text-sm font-medium text-gray-300">
                Expertise Level
              </Label>

              <RadioGroup
                value={difficulty}
                onValueChange={setDifficulty}
                className="grid grid-cols-1 gap-2"
              >
                {["beginner", "intermediate", "advanced"].map((level) => (
                  <label
                    key={level}
                    htmlFor={level}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                      difficulty === level
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-800 bg-[#1a1a1a]"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold capitalize">{level}</span>

                      <span className="text-xs text-gray-500">
                        {level === "beginner" && "Foundational concepts"}
                        {level === "intermediate" && "Practical application"}
                        {level === "advanced" && "Deep architectural knowledge"}
                      </span>
                    </div>

                    <RadioGroupItem
                      value={level}
                      id={level}
                      className="border-gray-500"
                    />
                  </label>
                ))}
              </RadioGroup>
            </Field>

            {/* TIME */}
            <Field>
              <Label className="mb-3 block text-sm font-medium text-gray-300">
                Duration
              </Label>

              <RadioGroup
                value={time}
                onValueChange={setTime}
                className="flex gap-4"
              >
                {["10", "15", "30"].map((t) => (
                  <label
                    key={t}
                    className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border py-2 transition-all ${
                      time === t
                        ? "border-green-400 bg-green-500 text-white"
                        : "border-gray-800 bg-[#1a1a1a] text-white"
                    }`}
                  >
                    <span className="text-sm font-bold">{t} Min</span>

                    <RadioGroupItem value={t} className="sr-only" />
                  </label>
                ))}
              </RadioGroup>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6 gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="border border-green-500 text-white hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="bg-green-600 px-8 text-white hover:bg-green-500"
              disabled={loading || !topicInput.trim()}
            >
              {loading ? "Preparing..." : "Start Interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewConfigModal;
