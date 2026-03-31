/**
 * Curriculum Routes
 * Handles all curriculum and learning content queries
 * Methods: GET curriculum by subject, grade, difficulty, tags, etc.
 */

const express = require("express");
const router = express.Router();
const Curriculum = require("../models/Curriculum");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * GET /api/curriculum/subjects
 * Get all available subjects with metadata
 */
router.get("/subjects", async (req, res) => {
  try {
    const subjects = await Curriculum.find(
      {},
      {
        subjectId: 1,
        subjectName: 1,
        description: 1,
        icon: 1,
        color: 1,
        learningObjectives: 1,
        "grades.grade": 1,
      }
    );

    res.json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/subjects/:subjectId
 * Get a specific subject with all grades
 */
router.get("/subjects/:subjectId", async (req, res) => {
  try {
    const subject = await Curriculum.findOne({
      subjectId: req.params.subjectId,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subject",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/subjects/:subjectId/grades/:grade
 * Get curriculum for a specific grade in a subject
 */
router.get("/subjects/:subjectId/grades/:grade", async (req, res) => {
  try {
    const { subjectId, grade } = req.params;
    const gradeNum = parseInt(grade);

    const subject = await Curriculum.findOne({
      subjectId: subjectId,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    const gradeData = subject.grades.find((g) => g.grade === gradeNum);

    if (!gradeData) {
      return res.status(404).json({
        success: false,
        message: `Grade ${grade} not found in this subject`,
      });
    }

    res.json({
      success: true,
      subject: subject.subjectName,
      grade: gradeData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch grade curriculum",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/subtopic/:subtopicId
 * Get details of a specific subtopic
 */
router.get("/subtopic/:subtopicId", async (req, res) => {
  try {
    const { subtopicId } = req.params;

    const subject = await Curriculum.findOne({
      "grades.subtopics.subtopicId": subtopicId,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subtopic not found",
      });
    }

    let foundSubtopic;
    let foundGrade;

    subject.grades.forEach((grade) => {
      const subtopic = grade.subtopics.find((s) => s.subtopicId === subtopicId);
      if (subtopic) {
        foundSubtopic = subtopic;
        foundGrade = grade.grade;
      }
    });

    res.json({
      success: true,
      data: {
        subject: subject.subjectName,
        grade: foundGrade,
        subtopic: foundSubtopic,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subtopic",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/by-difficulty
 * Query 1: difficulty=Easy,Medium,Hard (multiple)
 * Get curriculum by difficulty level
 */
router.get("/by-difficulty", async (req, res) => {
  try {
    const { difficulty } = req.query;
    const difficulties = difficulty ? difficulty.split(",") : [];

    if (difficulties.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please specify difficulty level (Easy, Medium, Hard)",
      });
    }

    const subjects = await Curriculum.find({});

    const filtered = subjects.map((subject) => {
      const filteredGrades = subject.grades
        .map((grade) => {
          const filteredSubtopics = grade.subtopics.filter((subtopic) =>
            difficulties.includes(subtopic.difficulty)
          );
          return {
            ...grade.toObject(),
            subtopics: filteredSubtopics,
          };
        })
        .filter((grade) => grade.subtopics.length > 0);

      return {
        ...subject.toObject(),
        grades: filteredGrades,
      };
    });

    res.json({
      success: true,
      data: filtered.filter((s) => s.grades.length > 0),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch by difficulty",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/by-tag
 * Query: tags=tag1,tag2 (multiple)
 * Get curriculum by tags
 */
router.get("/by-tag", async (req, res) => {
  try {
    const { tags } = req.query;
    const tagList = tags ? tags.split(",") : [];

    if (tagList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please specify tags",
      });
    }

    const subjects = await Curriculum.find({});

    const filtered = subjects.map((subject) => {
      const filteredGrades = subject.grades
        .map((grade) => {
          const filteredSubtopics = grade.subtopics.filter((subtopic) =>
            subtopic.tags.some((tag) =>
              tagList.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
            )
          );
          return {
            ...grade.toObject(),
            subtopics: filteredSubtopics,
          };
        })
        .filter((grade) => grade.subtopics.length > 0);

      return {
        ...subject.toObject(),
        grades: filteredGrades,
      };
    });

    res.json({
      success: true,
      tagsQueried: tagList,
      data: filtered.filter((s) => s.grades.length > 0),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch by tags",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/by-activity
 * Query: activityType=game-type1,game-type2 (multiple)
 * Get curriculum by game activity types
 */
router.get("/by-activity", async (req, res) => {
  try {
    const { activityType } = req.query;
    const activities = activityType ? activityType.split(",") : [];

    if (activities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please specify activity type",
      });
    }

    const subjects = await Curriculum.find({});

    const filtered = subjects.map((subject) => {
      const filteredGrades = subject.grades
        .map((grade) => {
          const filteredSubtopics = grade.subtopics.filter((subtopic) =>
            subtopic.gameActivityTypes.some((type) =>
              activities.map((a) => a.toLowerCase()).includes(type.toLowerCase())
            )
          );
          return {
            ...grade.toObject(),
            subtopics: filteredSubtopics,
          };
        })
        .filter((grade) => grade.subtopics.length > 0);

      return {
        ...subject.toObject(),
        grades: filteredGrades,
      };
    });

    res.json({
      success: true,
      activitiesQueried: activities,
      data: filtered.filter((s) => s.grades.length > 0),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch by activity type",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/game-activities
 * Get all available game activity types across curriculum
 */
router.get("/game-activities", async (req, res) => {
  try {
    const subjects = await Curriculum.find({});

    const activitySet = new Set();

    subjects.forEach((subject) => {
      subject.grades.forEach((grade) => {
        grade.subtopics.forEach((subtopic) => {
          subtopic.gameActivityTypes.forEach((activity) => {
            activitySet.add(activity);
          });
        });
      });
    });

    res.json({
      success: true,
      totalActivities: activitySet.size,
      activities: Array.from(activitySet).sort(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch game activities",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/dashboard/:grade
 * Dashboard view for a specific grade showing all subjects
 */
router.get("/dashboard/:grade", async (req, res) => {
  try {
    const { grade } = req.params;
    const gradeNum = parseInt(grade);

    if (gradeNum < 1 || gradeNum > 4) {
      return res.status(400).json({
        success: false,
        message: "Grade must be between 1 and 4",
      });
    }

    const subjects = await Curriculum.find({});

    const dashboard = subjects.map((subject) => {
      const gradeData = subject.grades.find((g) => g.grade === gradeNum);

      if (!gradeData) {
        return null;
      }

      const totalSubtopics = gradeData.subtopics.length;
      const totalXP = gradeData.subtopics.reduce(
        (sum, s) => sum + s.xpValue,
        0
      );
      const difficultyCounts = {
        Easy: gradeData.subtopics.filter((s) => s.difficulty === "Easy").length,
        Medium: gradeData.subtopics.filter((s) => s.difficulty === "Medium")
          .length,
        Hard: gradeData.subtopics.filter((s) => s.difficulty === "Hard").length,
      };

      return {
        subject: {
          id: subject.subjectId,
          name: subject.subjectName,
          icon: subject.icon,
          color: subject.color,
        },
        grade: gradeNum,
        stats: {
          totalSubtopics,
          totalXP,
          difficultyCounts,
        },
        subtopics: gradeData.subtopics.map((s) => ({
          id: s.subtopicId,
          name: s.subtopicName,
          xpValue: s.xpValue,
          difficulty: s.difficulty,
          estimatedTime: s.estimatedTime,
        })),
      };
    });

    res.json({
      success: true,
      grade: gradeNum,
      data: dashboard.filter((d) => d !== null),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
});

/**
 * GET /api/curriculum/search
 * Query: q=search-term
 * Search curriculum by name or description
 */
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const searchRegex = new RegExp(q, "i");
    const subjects = await Curriculum.find({
      $or: [
        { subjectName: searchRegex },
        { description: searchRegex },
        { "grades.subtopics.subtopicName": searchRegex },
        { "grades.subtopics.description": searchRegex },
      ],
    });

    const results = [];
    subjects.forEach((subject) => {
      subject.grades.forEach((grade) => {
        grade.subtopics.forEach((subtopic) => {
          if (
            searchRegex.test(subject.subjectName) ||
            searchRegex.test(subject.description) ||
            searchRegex.test(subtopic.subtopicName) ||
            searchRegex.test(subtopic.description)
          ) {
            results.push({
              type: "subtopic",
              subject: subject.subjectName,
              subjectId: subject.subjectId,
              grade: grade.grade,
              subtopic: subtopic.subtopicName,
              subtopicId: subtopic.subtopicId,
              xpValue: subtopic.xpValue,
            });
          }
        });
      });
    });

    res.json({
      success: true,
      query: q,
      resultsCount: results.length,
      results: results.slice(0, 50), // Limit to 50 results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to search curriculum",
      error: error.message,
    });
  }
});

module.exports = router;
