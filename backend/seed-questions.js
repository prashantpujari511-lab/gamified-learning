const mongoose = require("mongoose");
const Question = require("./models/Question");

mongoose.connect("mongodb://127.0.0.1:27017/gamifiedDB")
  .then(() => console.log("✅ MongoDB Connected for seeding"))
  .catch(err => console.log("❌ MongoDB Error:", err));

const QUESTIONS = [
  // Grade 1 - Easy
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 1,
    difficulty: "easy",
    question_text: "How many apples are there? 🍎🍎🍎",
    options: ["1", "2", "3", "4"],
    correct_answer: 2,
    explanation: "Count the apples: one, two, three = 3 apples",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 1,
    difficulty: "easy",
    question_text: "What number comes after 5?",
    options: ["4", "5", "6", "7"],
    correct_answer: 2,
    explanation: "After 5 comes 6",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 1,
    difficulty: "easy",
    question_text: "Count the stars: ⭐⭐",
    options: ["1", "2", "3", "4"],
    correct_answer: 1,
    explanation: "There are 2 stars",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 1,
    difficulty: "easy",
    question_text: "What number is this? 8",
    options: ["Seven", "Eight", "Nine", "Six"],
    correct_answer: 1,
    explanation: "The number 8 is pronounced Eight",
    xpReward: 10,
  },

  // Grade 2 - Easy to Medium
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 2,
    difficulty: "medium",
    question_text: "What comes between 15 and 17?",
    options: ["14", "15", "16", "18"],
    correct_answer: 2,
    explanation: "16 comes between 15 and 17",
    xpReward: 15,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 2,
    difficulty: "medium",
    question_text: "Count by 2s: 2, 4, 6, ___",
    options: ["7", "8", "9", "10"],
    correct_answer: 1,
    explanation: "When counting by 2s, we add 2 each time: 2, 4, 6, 8",
    xpReward: 15,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 2,
    difficulty: "easy",
    question_text: "Which number is the largest? 12, 8, 15, 9",
    options: ["12", "8", "15", "9"],
    correct_answer: 2,
    explanation: "15 is the largest number",
    xpReward: 12,
  },

  // Grade 3 - Medium
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 3,
    difficulty: "medium",
    question_text: "What is 100 + 23?",
    options: ["120", "123", "130", "103"],
    correct_answer: 1,
    explanation: "100 + 23 = 123",
    xpReward: 20,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 3,
    difficulty: "medium",
    question_text: "Skip count by 5s: 5, 10, 15, ___",
    options: ["18", "20", "25", "30"],
    correct_answer: 1,
    explanation: "5, 10, 15, 20 - adding 5 each time",
    xpReward: 20,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 3,
    difficulty: "hard",
    question_text: "What is the place value of 7 in 375?",
    options: ["7", "70", "700", "7000"],
    correct_answer: 1,
    explanation: "In 375, the 7 is in the tens place, so its place value is 70",
    xpReward: 25,
  },

  // Grade 4 - Hard
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 4,
    difficulty: "hard",
    question_text: "What is 256 + 489?",
    options: ["745", "735", "765", "755"],
    correct_answer: 0,
    explanation: "256 + 489 = 745",
    xpReward: 30,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 4,
    difficulty: "hard",
    question_text: "Which number has 3 hundreds, 5 tens, and 2 ones?",
    options: ["235", "325", "352", "532"],
    correct_answer: 2,
    explanation: "3 hundreds = 300, 5 tens = 50, 2 ones = 2. Total: 300 + 50 + 2 = 352",
    xpReward: 30,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "numbers-and-counting",
    grade: 4,
    difficulty: "hard",
    question_text: "What is 1000 - 456?",
    options: ["544", "554", "564", "644"],
    correct_answer: 0,
    explanation: "1000 - 456 = 544",
    xpReward: 30,
  },
];

async function seedQuestions() {
  try {
    // Clear existing questions
    await Question.deleteMany({ subtopicId: "numbers-and-counting" });
    console.log("✅ Cleared existing questions");

    // Insert new questions
    await Question.insertMany(QUESTIONS);
    console.log(`✅ Seeded ${QUESTIONS.length} questions for Numbers and Counting`);

    // Show summary
    const byGrade = {};
    QUESTIONS.forEach(q => {
      byGrade[q.grade] = (byGrade[q.grade] || 0) + 1;
    });
    console.log("📊 Questions by Grade:", byGrade);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
}

seedQuestions();
