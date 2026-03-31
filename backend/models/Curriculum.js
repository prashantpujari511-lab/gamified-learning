/**
 * Curriculum Model
 * Stores all subject, grade, subtopic, and game activity information
 */

const mongoose = require("mongoose");

const curriculumSchema = new mongoose.Schema(
  {
    subjectId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    description: String,
    icon: String,
    color: String,
    learningObjectives: [String],
    grades: [
      {
        grade: Number,
        gradeLabel: String,
        difficulty: String,
        xpMultiplier: Number,
        subtopics: [
          {
            subtopicId: {
              type: String,
              required: true,
            },
            subtopicName: String,
            description: String,
            xpValue: Number,
            difficulty: String,
            microConcepts: [String],
            gameActivityTypes: [String],
            tags: [String],
            estimatedTime: String,
            isCompleted: {
              type: Boolean,
              default: false,
            },
            completedBy: [
              {
                userId: mongoose.Schema.Types.ObjectId,
                completedAt: Date,
                score: Number,
              },
            ],
          },
        ],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "curriculum" }
);

// Index for quick queries
curriculumSchema.index({ subjectId: 1, "grades.grade": 1 });
curriculumSchema.index({ tags: 1 });

module.exports = mongoose.model("Curriculum", curriculumSchema);
