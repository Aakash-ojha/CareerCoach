import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// This ensures we don't get duplicate topics in the same domain
TopicSchema.index({ domain: 1, name: 1 }, { unique: true });

export const Topic =
  mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
