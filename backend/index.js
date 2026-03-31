const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");
const { buildDashboardPayload } = require("./utils/progressStats");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

/* =========================
   STATIC FRONTEND
========================= */
app.use(express.static(path.join(__dirname, "../frontend")));


/* =========================
   DATABASE CONNECTION
========================= */
mongoose.connect("mongodb://127.0.0.1:27017/gamifiedDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

/* =========================
   AUTH ROUTES
========================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/games", require("./routes/gameRoutes"));
app.use("/api/curriculum", require("./routes/curriculumRoutes"));

/* =========================
   DASHBOARD ROUTE
========================= */
app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const clientTimeZone = String(req.get("x-timezone") || "").trim();
    res.json(buildDashboardPayload(user, { timeZone: clientTimeZone }));

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
/* =========================
    PROFILE ROUTE
========================= */
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/profile.html"));
}); 

/* =========================
   FRONTEND ROUTES
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/home.html"));
});

app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/auth.html"));

});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dashboard.html"));
});

app.get("/primary-games", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/primary-class-games.html"));
});

app.get("/primary-subjects", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/primary-subjects.html"));
});

app.get("/primary-class-games", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/primary-class-games.html"));
});

app.get("/middle-school-games", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/middle-school-games.html"));
});

app.get("/middle-subjects", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/middle-subjects.html"));
});

app.get("/high-school-games", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/high-school-games.html"));
});

app.get("/high-subjects", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/high-subjects.html"));
});

app.get("/college-level-games", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/college-level-games.html"));
});

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
