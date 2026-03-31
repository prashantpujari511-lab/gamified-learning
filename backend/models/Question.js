const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    subtopic: { type: String, required: true },
    subtopicId: { type: String, required: true },
    grade: { type: Number, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    question_text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_answer: { type: Number, required: true },
    explanation: { type: String },
    xpReward: { type: Number, default: 10 },
    type: { type: String, enum: ["multiple-choice"], default: "multiple-choice" },
  },
  { timestamps: true }
);

// Index for faster queries
questionSchema.index({ subtopicId: 1, grade: 1 });
questionSchema.index({ subject: 1, subtopic: 1 });

module.exports = mongoose.model("Question", questionSchema);
