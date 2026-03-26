const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");
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

module.exports = router;
