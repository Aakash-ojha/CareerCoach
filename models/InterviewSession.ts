import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const InterviewSessionSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },

    topic: {
      type: String,
      required: true,
    },

    domain: {
      type: String,
      default: "software",
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    timePreference: {
      type: Number, // minutes
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },

    score: {
      type: Number,
      default: null,
    },

    report: {
      type: Object,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const InterviewSession =
  models.InterviewSession ||
  mongoose.model("InterviewSession", InterviewSessionSchema);
