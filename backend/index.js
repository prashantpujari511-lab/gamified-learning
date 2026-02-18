const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authMiddleware = require("./middleware/authMiddleware");
const User = require("./models/User");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

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

    const xp = Number.isFinite(user.xp) ? user.xp : 0;
    const level = Math.floor(xp / 50);
    const progress = xp % 50;

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      age: user.age,
      xp,
      level,
      progress
    });

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

/* =========================
   START SERVER
========================= */
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
