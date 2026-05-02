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

TopicSchema.index({ domain: 1, name: 1 }, { unique: true });

export const Topic =
  mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
