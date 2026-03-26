const mongoose = require("mongoose");
const { createDefaultGameProgress } = require("../utils/progressStats");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  profileImage: {
    type: String,
    default: "https://via.placeholder.com/120"
  },

  age: {
    type: Number,
    default: null
  },

  xp: {
    type: Number,
    default: 0
  },

  gameProgress: {
    type: mongoose.Schema.Types.Mixed,
    default: () => createDefaultGameProgress()
  },

  gameLogs: {
    type: [
      {
        gameId: { type: String, required: true },
        track: { type: String, default: "primary" },
        level: { type: Number, required: true },
        stars: { type: Number, required: true },
        solveTimeSec: { type: Number, required: true },
        gift: { type: String, required: true },
        completedAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  }
});

module.exports = mongoose.model("User", userSchema);
