const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");
const User = require("../models/User");
const Curriculum = require("../models/Curriculum");
const Question = require("../models/Question");
const {
  TRACKS,
  getTrackGameIds,
  createDefaultLevelState
} = require("../utils/progressStats");

function normalizeTrack(track) {
  return String(track || "").trim().toLowerCase();
}

function ensureGameProgress(user) {
  if (!user.gameProgress || typeof user.gameProgress !== "object") {
    user.gameProgress = {};
  }

  TRACKS.forEach((track) => {
    const trackGameIds = getTrackGameIds(track);
    if (!user.gameProgress[track] || typeof user.gameProgress[track] !== "object") {
      user.gameProgress[track] = {};
    }

    trackGameIds.forEach((gameId) => {
      if (!user.gameProgress[track][gameId] || typeof user.gameProgress[track][gameId] !== "object") {
        user.gameProgress[track][gameId] = createDefaultLevelState();
        return;
      }

      const gameState = user.gameProgress[track][gameId];
      gameState.currentLevel = Math.max(1, Number(gameState.currentLevel) || 1);
      gameState.bestStars = Math.max(0, Number(gameState.bestStars) || 0);
      gameState.totalStars = Math.max(0, Number(gameState.totalStars) || 0);
    });
  });
}

router.get("/:track/progress", authMiddleware, async (req, res) => {
  try {
    const track = normalizeTrack(req.params.track);
    const trackGameIds = getTrackGameIds(track);
    if (!trackGameIds.length) {
      return res.status(400).json({ message: "Invalid game track" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    ensureGameProgress(user);
    user.markModified("gameProgress");
    await user.save();

    const logs = (user.gameLogs || [])
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    const progress = user.gameProgress[track] || {};

    res.json({
      track,
      progress,
      [track]: progress,
      logs
    });
  } catch (error) {
    console.error("Get Track Progress Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:track/complete", authMiddleware, async (req, res) => {
  try {
    const track = normalizeTrack(req.params.track);
    const trackGameIds = getTrackGameIds(track);
    if (!trackGameIds.length) {
      return res.status(400).json({ message: "Invalid game track" });
    }

    const { gameId, level, stars, solveTimeSec, gift } = req.body;

    if (!trackGameIds.includes(gameId)) {
      return res.status(400).json({ message: "Invalid gameId" });
    }

    const numericLevel = Number(level);
    const numericStars = Number(stars);
    const numericSolveTime = Number(solveTimeSec);
    const safeGift = String(gift || "").trim();

    if (!Number.isInteger(numericLevel) || numericLevel < 1) {
      return res.status(400).json({ message: "Level must be a positive integer" });
    }

    if (![1, 2, 3].includes(numericStars)) {
      return res.status(400).json({ message: "Stars must be 1, 2, or 3" });
    }

    if (!Number.isFinite(numericSolveTime) || numericSolveTime <= 0) {
      return res.status(400).json({ message: "Invalid solve time" });
    }

    if (!safeGift) {
      return res.status(400).json({ message: "Gift is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    ensureGameProgress(user);
    const gameState = user.gameProgress[track][gameId];

    gameState.currentLevel = Math.max(Number(gameState.currentLevel) || 1, numericLevel + 1);
    gameState.bestStars = Math.max(Number(gameState.bestStars) || 0, numericStars);
    gameState.totalStars = Math.max(0, Number(gameState.totalStars) || 0) + numericStars;

    user.markModified("gameProgress");

    user.gameLogs = Array.isArray(user.gameLogs) ? user.gameLogs : [];
    user.gameLogs.push({
      gameId,
      track,
      level: numericLevel,
      stars: numericStars,
      solveTimeSec: Math.round(numericSolveTime * 10) / 10,
      gift: safeGift,
      completedAt: new Date()
    });

    const xpReward = numericStars * 10 + Math.max(2, Math.round(20 / Math.max(1, numericSolveTime)));
    user.xp = Math.max(0, Number(user.xp) || 0) + xpReward;

    await user.save();
    const progress = user.gameProgress[track] || {};

    res.json({
      message: "Level progress saved",
      track,
      progress,
      [track]: progress,
      xp: user.xp,
      xpReward
    });
  } catch (error) {
    console.error("Complete Track Level Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ========================================
   INFINITE RUNNER GAME ROUTES
======================================== */

/**
 * GET /api/games/infinite-runner/:topicId/question
 * Fetch a random question from database for a specific topic
 * 📚 Hindi: किसी विशिष्ट विषय के लिए सवाल लाओ
 */
router.get("/infinite-runner/:topicId/question", async (req, res) => {
  try {
    const { topicId } = req.params;
    const { grade, difficulty } = req.query;

    // Build query to find questions
    const query = {
      subtopicId: topicId,
    };

    // Add optional filters
    if (grade) {
      query.grade = parseInt(grade);
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Get count of matching questions
    const count = await Question.countDocuments(query);

    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions found for topic: ${topicId}`,
      });
    }

    // Fetch a random question using aggregation
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: 1 } },
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const question = questions[0];

    // ✅ Return real question with all options scrambled
    res.json({
      success: true,
      data: {
        _id: question._id,
        question_text: question.question_text,
        options: question.options,
        correct_answer: question.correct_answer,
        difficulty: question.difficulty,
        grade: question.grade,
        subtopic: question.subtopic,
        subject: question.subject,
        explanation: question.explanation,
        xpReward: question.xpReward || 10,
      },
    });
  } catch (error) {
    console.error("Fetch Question Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch question",
      error: error.message,
    });
  }
});

/**
 * GET /api/games/infinite-runner/:topicId/level-question
 * Fetch a question based on game level (auto-determines difficulty)
 * Level 1-5 = easy | Level 6-10 = medium | Level 11+ = hard
 * 📚 Hindi: गेम लेवल के अनुसार सवाल लाओ
 */
router.get("/infinite-runner/:topicId/level-question", async (req, res) => {
  try {
    const { topicId } = req.params;
    const { level = 1, grade } = req.query;
    const numericLevel = parseInt(level) || 1;

    // Map game level to difficulty
    let difficulty;
    if (numericLevel <= 5) {
      difficulty = "easy";
    } else if (numericLevel <= 10) {
      difficulty = "medium";
    } else {
      difficulty = "hard";
    }

    // Build query
    const query = {
      subtopicId: topicId,
      difficulty: difficulty,
    };

    if (grade) {
      query.grade = parseInt(grade);
    }

    // Get count of matching questions
    const count = await Question.countDocuments(query);

    if (count === 0) {
      // Fallback to any available question if no match found
      return res.status(404).json({
        success: false,
        message: `No ${difficulty} questions found for topic: ${topicId}`,
      });
    }

    // Fetch a random question
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: 1 } },
    ]);

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const question = questions[0];

    res.json({
      success: true,
      level: numericLevel,
      difficulty: difficulty,
      data: {
        _id: question._id,
        question_text: question.question_text,
        options: question.options,
        correct_answer: question.correct_answer,
        difficulty: question.difficulty,
        grade: question.grade,
        subtopic: question.subtopic,
        subject: question.subject,
        explanation: question.explanation,
        xpReward: question.xpReward || 10,
      },
    });
  } catch (error) {
    console.error("Fetch Level Question Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch level question",
      error: error.message,
    });
  }
});

/**
 * POST /api/games/infinite-runner/save-score
 * Save player's infinite runner game score (authenticated or guest)
 * 🎮 Hindi: खेल का स्कोर सहेजें
 */
router.post("/infinite-runner/save-score", optionalAuthMiddleware, async (req, res) => {
  try {
    const { topicId, score, xp, coins, correctAnswers, incorrectAnswers, level, userId } = req.body;

    // Optional authentication - works for both guests and registered users
    const authenticatedUserId = req.user?.id;
    const finalUserId = userId || authenticatedUserId;

    if (!topicId || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "topicId and score are required",
      });
    }

    // If authenticated, save to database
    if (finalUserId && finalUserId !== "guest") {
      const user = await User.findById(finalUserId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update user stats
      user.xp = (user.xp || 0) + (xp || 0);
      user.coins = (user.coins || 0) + (coins || 0);

      // Initialize gameLogs if not exists
      if (!user.gameLogs) user.gameLogs = [];

      // Add game log
      user.gameLogs.push({
        gameType: "infinite-runner",
        topicId: topicId,
        score: score,
        xp: xp || 0,
        coins: coins || 0,
        correctAnswers: correctAnswers || 0,
        incorrectAnswers: incorrectAnswers || 0,
        level: level || 1,
        completedAt: new Date(),
      });

      await user.save();

      res.json({
        success: true,
        message: "Score saved successfully",
        data: {
          totalXp: user.xp,
          totalCoins: user.coins,
        },
      });
    } else {
      // For guests, just acknowledge the score
      res.json({
        success: true,
        message: "Score recorded (guest mode)",
        data: {
          score: score,
          xp: xp || 0,
          coins: coins || 0,
        },
      });
    }
  } catch (error) {
    console.error("Save Score Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save score",
      error: error.message,
    });
  }
});

module.exports = router;
