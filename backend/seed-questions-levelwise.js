const mongoose = require("mongoose");
const Question = require("./models/Question");

mongoose.connect("mongodb://127.0.0.1:27017/gamifiedDB")
  .then(() => console.log("✅ MongoDB Connected for seeding"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// 🎮 Level-Wise Questions for Indian Syllabus (Grade 1-4)
const LEVELWISE_QUESTIONS = [
  // ============= LEVEL 1: EASY (Grades 1-2) =============
  
  // Numbers and Counting - Easy
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 1,
    difficulty: "easy",
    question_text: "How many? 🍎🍎🍎",
    options: ["2", "3", "4", "5"],
    correct_answer: 1,
    explanation: "Count: one, two, three = 3 apples",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
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
    subtopicId: "MATH_P_G1_001",
    grade: 1,
    difficulty: "easy",
    question_text: "Count the stars ⭐⭐",
    options: ["1", "2", "3", "4"],
    correct_answer: 1,
    explanation: "There are 2 stars",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 1,
    difficulty: "easy",
    question_text: "Which is bigger? 7 or 3?",
    options: ["3", "7", "Same", "Cannot tell"],
    correct_answer: 1,
    explanation: "7 is bigger than 3",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 1,
    difficulty: "easy",
    question_text: "Count by 1s: 1, 2, 3, ___",
    options: ["2", "3", "4", "5"],
    correct_answer: 2,
    explanation: "The next number is 4",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 2,
    difficulty: "easy",
    question_text: "What comes between 15 and 17?",
    options: ["14", "15", "16", "18"],
    correct_answer: 2,
    explanation: "16 comes between 15 and 17",
    xpReward: 12,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 2,
    difficulty: "easy",
    question_text: "Which is smallest? 25, 12, 8, 20",
    options: ["25", "12", "8", "20"],
    correct_answer: 2,
    explanation: "8 is the smallest number",
    xpReward: 12,
  },

  // Addition - Easy
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 1,
    difficulty: "easy",
    question_text: "1 + 1 = ?",
    options: ["1", "2", "3", "4"],
    correct_answer: 1,
    explanation: "One plus one equals two",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 1,
    difficulty: "easy",
    question_text: "2 + 2 = ?",
    options: ["2", "3", "4", "5"],
    correct_answer: 2,
    explanation: "Two plus two equals four",
    xpReward: 10,
  },
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 1,
    difficulty: "easy",
    question_text: "1 + 2 = ?",
    options: ["1", "2", "3", "4"],
    correct_answer: 2,
    explanation: "One plus two equals three",
    xpReward: 10,
  },

  // ============= LEVEL 2: MEDIUM (Grades 2-3) =============

  // Numbers and Counting - Medium
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
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
    subtopicId: "MATH_P_G1_001",
    grade: 2,
    difficulty: "medium",
    question_text: "Count by 5s: 5, 10, 15, ___",
    options: ["20", "25", "30", "35"],
    correct_answer: 0,
    explanation: "When counting by 5s, we add 5 each time: 5, 10, 15, 20",
    xpReward: 15,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 3,
    difficulty: "medium",
    question_text: "Arrange from smallest to largest: 34, 12, 45, 23",
    options: ["12, 23, 34, 45", "34, 45, 23, 12", "45, 34, 23, 12", "23, 12, 45, 34"],
    correct_answer: 0,
    explanation: "Order from smallest to largest: 12, 23, 34, 45",
    xpReward: 15,
  },

  // Addition - Medium
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 2,
    difficulty: "medium",
    question_text: "5 + 3 = ?",
    options: ["6", "7", "8", "9"],
    correct_answer: 1,
    explanation: "Five plus three equals eight",
    xpReward: 15,
  },
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 2,
    difficulty: "medium",
    question_text: "10 + 5 = ?",
    options: ["14", "15", "16", "17"],
    correct_answer: 1,
    explanation: "Ten plus five equals fifteen",
    xpReward: 15,
  },
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 3,
    difficulty: "medium",
    question_text: "23 + 15 = ?",
    options: ["35", "36", "37", "38"],
    correct_answer: 2,
    explanation: "23 + 15 = 38",
    xpReward: 15,
  },

  // Subtraction - Medium
  {
    subject: "Mathematics",
    subtopic: "Subtraction",
    subtopicId: "MATH_P_G1_003",
    grade: 2,
    difficulty: "medium",
    question_text: "5 - 2 = ?",
    options: ["2", "3", "4", "5"],
    correct_answer: 1,
    explanation: "Five minus two equals three",
    xpReward: 15,
  },
  {
    subject: "Mathematics",
    subtopic: "Subtraction",
    subtopicId: "MATH_P_G1_003",
    grade: 2,
    difficulty: "medium",
    question_text: "10 - 3 = ?",
    options: ["6", "7", "8", "9"],
    correct_answer: 1,
    explanation: "Ten minus three equals seven",
    xpReward: 15,
  },

  // ============= LEVEL 3: HARD (Grades 3-4) =============

  // Numbers and Counting - Hard
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 3,
    difficulty: "hard",
    question_text: "What is the place value of 5 in 456?",
    options: ["5", "50", "500", "5000"],
    correct_answer: 1,
    explanation: "The 5 is in the tens place, so its value is 50",
    xpReward: 20,
  },
  {
    subject: "Mathematics",
    subtopic: "Numbers and Counting",
    subtopicId: "MATH_P_G1_001",
    grade: 4,
    difficulty: "hard",
    question_text: "Write 756 in expanded form: ___",
    options: ["700 + 50 + 6", "700 + 5 + 60", "7 + 50 + 600", "7000 + 56"],
    correct_answer: 0,
    explanation: "756 = 700 + 50 + 6 (place value breakdown)",
    xpReward: 20,
  },

  // Addition - Hard
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 3,
    difficulty: "hard",
    question_text: "47 + 28 = ?",
    options: ["73", "74", "75", "76"],
    correct_answer: 2,
    explanation: "47 + 28 = 75 (carry the tens)",
    xpReward: 20,
  },
  {
    subject: "Mathematics",
    subtopic: "Addition",
    subtopicId: "MATH_P_G1_002",
    grade: 4,
    difficulty: "hard",
    question_text: "345 + 278 = ?",
    options: ["620", "621", "622", "623"],
    correct_answer: 3,
    explanation: "345 + 278 = 623",
    xpReward: 20,
  },

  // Subtraction - Hard
  {
    subject: "Mathematics",
    subtopic: "Subtraction",
    subtopicId: "MATH_P_G1_003",
    grade: 3,
    difficulty: "hard",
    question_text: "45 - 18 = ?",
    options: ["25", "26", "27", "28"],
    correct_answer: 2,
    explanation: "45 - 18 = 27 (borrow from tens)",
    xpReward: 20,
  },
  {
    subject: "Mathematics",
    subtopic: "Subtraction",
    subtopicId: "MATH_P_G1_003",
    grade: 4,
    difficulty: "hard",
    question_text: "500 - 234 = ?",
    options: ["264", "265", "266", "267"],
    correct_answer: 2,
    explanation: "500 - 234 = 266",
    xpReward: 20,
  },

  // Multiplication - Hard
  {
    subject: "Mathematics",
    subtopic: "Multiplication Basics",
    subtopicId: "MATH_P_G1_004",
    grade: 3,
    difficulty: "hard",
    question_text: "3 × 4 = ?",
    options: ["10", "11", "12", "13"],
    correct_answer: 2,
    explanation: "3 groups of 4 = 12",
    xpReward: 20,
  },
  {
    subject: "Mathematics",
    subtopic: "Multiplication Basics",
    subtopicId: "MATH_P_G1_004",
    grade: 4,
    difficulty: "hard",
    question_text: "7 × 8 = ?",
    options: ["54", "55", "56", "57"],
    correct_answer: 2,
    explanation: "7 × 8 = 56",
    xpReward: 20,
  },

  // Division - Hard
  {
    subject: "Mathematics",
    subtopic: "Division Basics",
    subtopicId: "MATH_P_G1_005",
    grade: 3,
    difficulty: "hard",
    question_text: "12 ÷ 3 = ?",
    options: ["3", "4", "5", "6"],
    correct_answer: 1,
    explanation: "12 divided by 3 equals 4",
    xpReward: 20,
  },
  {
    subject: "Mathematics",
    subtopic: "Division Basics",
    subtopicId: "MATH_P_G1_005",
    grade: 4,
    difficulty: "hard",
    question_text: "56 ÷ 7 = ?",
    options: ["6", "7", "8", "9"],
    correct_answer: 2,
    explanation: "56 divided by 7 equals 8",
    xpReward: 20,
  },

  // ============= ENGLISH QUESTIONS =============

  // Alphabet - Easy
  {
    subject: "English",
    subtopic: "Alphabet Recognition",
    subtopicId: "ENG_P_G1_001",
    grade: 1,
    difficulty: "easy",
    question_text: "What letter comes after B?",
    options: ["A", "C", "D", "E"],
    correct_answer: 1,
    explanation: "The letter C comes after B",
    xpReward: 10,
  },

  // ============= EVS QUESTIONS =============

  // My Family - Easy
  {
    subject: "Environmental Studies",
    subtopic: "My Family",
    subtopicId: "EVS_P_G1_001",
    grade: 1,
    difficulty: "easy",
    question_text: "Who is your mother's brother called?",
    options: ["Father", "Uncle", "Cousin", "Grandfather"],
    correct_answer: 1,
    explanation: "Your mother's brother is your uncle",
    xpReward: 10,
  },
];

// Function to clear existing questions and seed new ones
async function seedQuestions() {
  try {
    // Clear existing questions
    await Question.deleteMany({});
    console.log("🗑️  Cleared existing questions");

    // Insert new questions
    const result = await Question.insertMany(LEVELWISE_QUESTIONS);
    console.log(`✅ Seeded ${result.length} level-wise questions`);

    // Show breakdown by difficulty
    const easyCount = await Question.countDocuments({ difficulty: "easy" });
    const mediumCount = await Question.countDocuments({ difficulty: "medium" });
    const hardCount = await Question.countDocuments({ difficulty: "hard" });

    console.log(`\n📊 Question Breakdown:`);
    console.log(`   Easy: ${easyCount}`);
    console.log(`   Medium: ${mediumCount}`);
    console.log(`   Hard: ${hardCount}`);

    // Show breakdown by subject
    const subjects = await Question.distinct("subject");
    console.log(`\n📚 Subjects:`);
    for (const subject of subjects) {
      const count = await Question.countDocuments({ subject });
      console.log(`   ${subject}: ${count}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding questions:", error);
    process.exit(1);
  }
}

seedQuestions();
