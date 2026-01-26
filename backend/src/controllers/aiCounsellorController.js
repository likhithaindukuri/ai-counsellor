const { getProfile } = require("../models/profileModel");
const { getStage } = require("../models/stageModel");

const aiCounsellor = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required"
      });
    }

    const profile = await getProfile(userId);
    const stage = await getStage(userId);

    if (!profile) {
      return res.status(404).json({
        error: "Profile not found. Please complete signup first."
      });
    }

    if (!profile.onboarding_completed) {
      return res.status(403).json({
        message: "Please complete onboarding to unlock AI Counsellor."
      });
    }

    if (!stage) {
      return res.status(404).json({
        error: "Stage not found. Please contact support."
      });
    }

    // Stage-aware behavior
    if (stage === "PROFILE_BUILDING") {
      return res.json({
        response: "Let’s complete your profile before moving ahead."
      });
    }

    if (stage === "UNIVERSITY_DISCOVERY") {
      return res.json({
        response: generateUniversityAdvice(profile)
      });
    }

    if (stage === "UNIVERSITY_FINALIZATION") {
      return res.json({
        response: "Let’s finalize and lock your universities."
      });
    }

    if (stage === "APPLICATION_PREP") {
      return res.json({
        response: "We are now preparing applications."
      });
    }

    // Default case for unknown stages
    return res.json({
      response: "I'm here to help you with your university journey. How can I assist you?"
    });

  } catch (err) {
    console.error("AI Counsellor error:", err);
    res.status(500).json({ 
      error: "AI Counsellor error",
      message: err.message 
    });
  }
};

const generateUniversityAdvice = (profile) => {
  return {
    profileSummary: {
      academics: profile.gpa ? "Average" : "Needs improvement",
      exams: profile.ielts_status,
      sop: profile.sop_status
    },
    recommendations: {
      dream: ["Stanford University"],
      target: ["University of Texas Austin"],
      safe: ["Arizona State University"]
    },
    reasoning: "Based on your profile and budget, these universities match your risk level."
  };
};

module.exports = { aiCounsellor };
