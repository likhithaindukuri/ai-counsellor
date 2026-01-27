const { getProfile } = require("../models/profileModel");
const { getStage } = require("../models/stageModel");
const { getLockedUniversity } = require("../models/lockModel");
const { getTodos } = require("../models/todoModel");

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
      const msgLower = message?.toLowerCase() || "";
      
      // Analyze message intent
      if (msgLower.includes("recommend") || msgLower.includes("suggest") || msgLower.includes("university")) {
        return res.json({
          response: generateUniversityAdvice(profile)
        });
      }
      
      if (msgLower.includes("evaluate") || msgLower.includes("profile") || msgLower.includes("strength")) {
        return res.json({
          response: generateProfileEvaluation(profile)
        });
      }
      
      if (msgLower.includes("next") || msgLower.includes("do") || msgLower.includes("action") || msgLower.includes("step")) {
        return res.json({
          response: generateNextSteps(profile)
        });
      }
      
      if (msgLower.includes("why") || msgLower.includes("risk") || msgLower.includes("safe") || msgLower.includes("dream")) {
        return res.json({
          response: generateRiskExplanation(profile)
        });
      }
      
      // Default for UNIVERSITY_DISCOVERY stage
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
      const lockedUni = getLockedUniversity(userId);
      const todos = getTodos(userId);

      if (!lockedUni) {
        return res.json({
          response: "Please lock at least one university to proceed."
        });
      }

      return res.json({
        response: `You are preparing applications for ${lockedUni}`,
        todos
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

const generateProfileEvaluation = (profile) => {
  const strengths = [];
  const weaknesses = [];
  
  if (profile.gpa) strengths.push("Academic performance");
  else weaknesses.push("GPA information missing");
  
  if (profile.ielts_status && profile.ielts_status !== "Not started") strengths.push("Test preparation in progress");
  else weaknesses.push("IELTS/TOEFL not started");
  
  if (profile.sop_status && profile.sop_status !== "Not started") strengths.push("SOP preparation started");
  else weaknesses.push("Statement of Purpose not started");
  
  return {
    evaluation: {
      strengths: strengths.length > 0 ? strengths : ["Profile setup complete"],
      weaknesses: weaknesses.length > 0 ? weaknesses : ["All key areas covered"],
      overall: strengths.length > weaknesses.length ? "Strong" : "Needs improvement"
    },
    message: `Your profile has ${strengths.length} strength(s) and ${weaknesses.length} area(s) to improve. Focus on ${weaknesses.length > 0 ? weaknesses[0] : "maintaining your progress"}.`
  };
};

const generateNextSteps = (profile) => {
  const steps = [];
  
  if (!profile.ielts_status || profile.ielts_status === "Not started") {
    steps.push("Register for IELTS/TOEFL exam");
  }
  
  if (!profile.sop_status || profile.sop_status === "Not started") {
    steps.push("Start drafting your Statement of Purpose");
  }
  
  if (!profile.gpa) {
    steps.push("Update your academic information");
  }
  
  if (steps.length === 0) {
    steps.push("Review and shortlist recommended universities");
    steps.push("Research application deadlines");
    steps.push("Prepare required documents");
  }
  
  return {
    nextSteps: steps,
    message: `Here are your immediate next steps: ${steps.join(", ")}. Focus on one at a time for best results.`
  };
};

const generateRiskExplanation = (profile) => {
  return {
    explanation: {
      dream: "Dream universities are highly competitive. They require exceptional profiles but offer the best opportunities.",
      target: "Target universities match your profile well. You have a good chance of admission with proper preparation.",
      safe: "Safe universities are your backup options. They have higher acceptance rates and ensure you have options."
    },
    message: "The categorization helps you balance ambition with security. Apply to 2-3 from each category for optimal results."
  };
};

module.exports = { aiCounsellor };
