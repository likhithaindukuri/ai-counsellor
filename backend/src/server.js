const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");
const aiCounsellorRoutes = require("./routes/aiCounsellorRoutes");
const universityRoutes = require("./routes/universityRoutes");
const lockRoutes = require("./routes/lockRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed", err);
  } else {
    console.log("Database time:", res.rows[0]);
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/ai", aiCounsellorRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/lock", lockRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "AI Counsellor Backend is running 🚀" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
