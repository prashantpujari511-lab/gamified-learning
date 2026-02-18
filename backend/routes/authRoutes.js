const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

/* =========================
   REGISTER ROUTE
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, profileImage, age } = req.body;

    // Required fields check
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Name, Email, Phone and Password are required"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      profileImage: profileImage || undefined,
      age: age || undefined
    });

    await newUser.save();

    res.json({
      message: "Registration successful!"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


/* =========================
   LOGIN ROUTE
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email
      },
      "secret123",
      { expiresIn: "1h" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    res.json({ message: "Login successful" });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

/* =========================
   LOGOUT ROUTE
========================= */
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/"
  });
  res.json({ message: "Logged out successfully" });
});

/* =========================
   UPDATE PROFILE ROUTE
========================= */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, phone, age, profileImage } = req.body;
    const trimmedName = (name || "").trim();
    const trimmedPhone = (phone || "").trim();
    const trimmedImage = (profileImage || "").trim();

    if (!trimmedName || !trimmedPhone) {
      return res.status(400).json({ message: "Name and Phone are required" });
    }

    let normalizedAge = null;
    if (age !== undefined && age !== null && String(age).trim() !== "") {
      normalizedAge = Number(age);
      if (!Number.isFinite(normalizedAge) || normalizedAge < 0) {
        return res.status(400).json({ message: "Age must be a valid non-negative number" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: trimmedName,
        phone: trimmedPhone,
        age: normalizedAge,
        profileImage: trimmedImage || undefined
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    if (error && error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
