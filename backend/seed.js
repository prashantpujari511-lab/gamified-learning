/**
 * Seed script to populate MongoDB with curriculum data
 * Run with: node seed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gamifiedDB";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected for seeding");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// Define Curriculum Schema
const curriculumSchema = new mongoose.Schema(
  {
    subjectId: String,
    subjectName: String,
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
            subtopicId: String,
            subtopicName: String,
            description: String,
            xpValue: Number,
            difficulty: String,
            microConcepts: [String],
            gameActivityTypes: [String],
            tags: [String],
            estimatedTime: String,
          },
        ],
      },
    ],
  },
  { collection: "curriculum" }
);

const Curriculum = mongoose.model("Curriculum", curriculumSchema);

// Seed function
async function seedCurriculum() {
  try {
    // Read curriculum data
    const curriculumPath = path.join(__dirname, "data", "curriculum.json");
    const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, "utf8"));

    // Clear existing data (optional)
    await Curriculum.deleteMany({});
    console.log("🗑️  Cleared existing curriculum data");

    // Insert all subjects
    const insertedDocuments = await Curriculum.insertMany(
      curriculumData.curriculum.subjects
    );

    console.log(`✅ Successfully seeded ${insertedDocuments.length} subjects`);

    // Print summary
    insertedDocuments.forEach((doc) => {
      const totalSubtopics = doc.grades.reduce(
        (sum, g) => sum + g.subtopics.length,
        0
      );
      console.log(
        `   📚 ${doc.subjectName}: ${doc.grades.length} grades, ${totalSubtopics} total subtopics`
      );
    });

    console.log("\n✨ Curriculum seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run seed
seedCurriculum();
