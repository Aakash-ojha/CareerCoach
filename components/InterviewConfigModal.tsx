"use client";

import { useState } from "react";
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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const InterviewConfigModal = ({
  isModelOpen,
  setIsModelOpen,
  selectedTopic,
}) => {
  const router = useRouter();

  const [difficulty, setDifficulty] = useState("beginner");
  const [time, setTime] = useState("10");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      topic: selectedTopic,
      difficulty,
      timePreference: time,
    };

    console.log("FORM DATA:", formData);

    try {
      setLoading(true);

      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("BACKEND RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // close modal
      setIsModelOpen(false);

      // move to interview page
      // later you can use:
      // router.push(`/interview/${data.sessionId}`);
      router.push("/interview/session");
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DialogContent className="sm:max-w-lg overflow">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Customize your interview</DialogTitle>
            <DialogDescription>
              Select your preferences before starting
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {/* TOPIC */}
            <Field>
              <Label className="mt-6">Interview Topic</Label>
              <Input value={selectedTopic || ""} readOnly />
            </Field>

            {/* DIFFICULTY */}
            <Field>
              <Label>Difficulty Level</Label>

              <RadioGroup
                value={difficulty}
                onValueChange={setDifficulty}
                className="max-w-lg"
              >
                <FieldLabel htmlFor="beginner">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Beginner</FieldTitle>
                      <FieldDescription>
                        Perfect for getting started
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="beginner" id="beginner" />
                  </Field>
                </FieldLabel>

                <FieldLabel htmlFor="intermediate">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Intermediate</FieldTitle>
                      <FieldDescription>
                        Solid foundation required
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="intermediate" id="intermediate" />
                  </Field>
                </FieldLabel>

                <FieldLabel htmlFor="advanced">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Advanced</FieldTitle>
                      <FieldDescription>Deep expertise needed</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="advanced" id="advanced" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </Field>

            {/* TIME */}
            <Field className="mb-5">
              <Label>Time Preferences</Label>

              <RadioGroup
                value={time}
                onValueChange={setTime}
                className="flex flex-row gap-6 items-center"
              >
                <FieldLabel htmlFor="10">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>10 Min</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="10" id="10" />
                  </Field>
                </FieldLabel>

                <FieldLabel htmlFor="15">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>15 Min</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="15" id="15" />
                  </Field>
                </FieldLabel>

                <FieldLabel htmlFor="30">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>30 Min</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value="30" id="30" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              {loading ? "Starting..." : "Start Interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewConfigModal;
