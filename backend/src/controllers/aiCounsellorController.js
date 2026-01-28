const { getProfile } = require("../models/profileModel");
const { getStage } = require("../models/stageModel");
const { getLockedUniversity } = require("../models/lockModel");
const { getTodos } = require("../models/todoModel");
const { shortlistUniversity } = require("../models/universityModel");
const { getUniversities } = require("../models/universityModel");

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

    // Derive onboarding completion from key fields instead of relying on a specific DB flag
    if (!isOnboardingComplete(profile)) {
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
      
      // AI ACTION: Detect shortlist intent and automatically shortlist
      const allUnis = getUniversities();
      const shortlistIntent = msgLower.match(/shortlist|add|save|include/i);
      if (shortlistIntent) {
        // Try to find university name in message
        for (const uni of allUnis) {
          if (msgLower.includes(uni.name.toLowerCase())) {
            try {
              await shortlistUniversity(userId, uni.name);
              return res.json({
                response: `✅ I've added ${uni.name} to your shortlist! You can view all shortlisted universities in the Shortlist page.`,
                action: "shortlisted",
                university: uni.name
              });
            } catch (error) {
              console.error("Error shortlisting from AI:", error);
            }
          }
        }
      }
      
      // Analyze message intent
      if (msgLower.includes("recommend") || msgLower.includes("suggest") || msgLower.includes("university")) {
        const advice = await generateUniversityAdvice(profile);
        return res.json({
          response: advice
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
      const advice = await generateUniversityAdvice(profile);
      return res.json({
        response: advice
      });
    }

    if (stage === "UNIVERSITY_FINALIZATION") {
      return res.json({
        response: "Let’s finalize and lock your universities."
      });
    }

    if (stage === "APPLICATION_PREP") {
      const lockedUni = await getLockedUniversity(userId);
      const todos = await getTodos(userId);

      // If in APPLICATION_PREP but no locked university, allow recommendations
      // This handles edge case where stage was set but lock wasn't stored properly
      if (!lockedUni) {
        const msgLower = message?.toLowerCase() || "";
        
        // If asking for recommendations, provide them
        if (msgLower.includes("recommend") || msgLower.includes("suggest") || msgLower.includes("university")) {
          const advice = await generateUniversityAdvice(profile);
          return res.json({
            response: advice
          });
        }
        
        // Otherwise, prompt to lock
        return res.json({
          response: "Please lock at least one university to proceed with application preparation. You can still get recommendations by asking me to suggest universities."
        });
      }

      // User has locked university - provide application guidance
      const msgLower = message?.toLowerCase() || "";
      
      // Still allow recommendations even in APPLICATION_PREP if explicitly asked
      if (msgLower.includes("recommend") || msgLower.includes("suggest") || msgLower.includes("university")) {
        const advice = await generateUniversityAdvice(profile);
        return res.json({
          response: advice
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

const generateUniversityAdvice = async (profile) => {
  const allUnis = getUniversities();
  const preferredCountries = profile.preferred_countries || [];
  const budgetRange = profile.budget_range || "";
  const userGPA = parseFloat(profile.gpa) || 0;

  // Filter by country preference if specified
  let filteredUnis = allUnis;
  if (preferredCountries.length > 0) {
    filteredUnis = allUnis.filter(uni => 
      preferredCountries.some(country => 
        uni.country.toLowerCase().includes(country.toLowerCase()) || 
        country.toLowerCase().includes(uni.country.toLowerCase())
      )
    );
    if (filteredUnis.length === 0) {
      filteredUnis = allUnis;
    }
  }

  // Filter by budget
  if (budgetRange) {
    const budgetLower = budgetRange.toLowerCase();
    if (budgetLower.includes("low") || budgetLower.includes("20") || budgetLower.includes("30")) {
      filteredUnis = filteredUnis.filter(uni => 
        uni.costLevel === "Low" || uni.costLevel === "Medium"
      );
    } else if (!budgetLower.includes("high") && !budgetLower.includes("50") && !budgetLower.includes("60")) {
      filteredUnis = filteredUnis.filter(uni => uni.costLevel !== "High");
    }
  }

  const dream = [];
  const target = [];
  const safe = [];

  filteredUnis.forEach((uni) => {
    if (userGPA >= uni.requiredGPA + 0.5) {
      safe.push(uni.name);
    } else if (userGPA >= uni.requiredGPA - 0.5) {
      target.push(uni.name);
    } else {
      dream.push(uni.name);
    }
  });

  // Take top 3 from each bucket based on risk logic
  let dreamTop = dream.slice(0, 3);
  let targetTop = target.slice(0, 3);
  let safeTop = safe.slice(0, 3);

  // Fallback: always expose at least some Dream and Target where possible,
  // even if the strict GPA thresholds only produced "safe" options.
  if (dreamTop.length === 0 && targetTop.length === 0 && safeTop.length > 0) {
    // Promote the strongest safe option(s) to Target/Dream for better UX
    if (safeTop.length >= 1) {
      dreamTop = [safeTop[0]];
    }
    if (safeTop.length >= 2) {
      targetTop = safeTop.slice(1, Math.min(3, safeTop.length));
    }
    // Keep remaining in safe if any
    safeTop = safe.slice(3, 6);
  }

  return {
    profileSummary: {
      academics: profile.gpa ? (userGPA >= 8.0 ? "Strong" : userGPA >= 7.0 ? "Average" : "Needs improvement") : "Needs improvement",
      exams: profile.ielts_status,
      sop: profile.sop_status
    },
    recommendations: {
      dream: dreamTop,
      target: targetTop,
      safe: safeTop
    },
    reasoning: `Based on your profile (GPA: ${userGPA || "Not provided"}, Countries: ${preferredCountries.join(", ") || "Any"}, Budget: ${budgetRange || "Not specified"}), these universities match your risk level. You can ask me to shortlist any of these by saying "shortlist [university name]".`
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

// Keep onboarding completion logic consistent with onboarding controller
const isOnboardingComplete = (profile) => {
  if (!profile) {
    return false;
  }

  const hasAcademicBackground = Boolean(profile.current_education && profile.graduation_year);
  const hasStudyGoal = Boolean(profile.target_degree);
  const hasPreferencesAndBudget = Boolean(profile.budget_range);
  const hasExamReadiness = Boolean(profile.ielts_status || profile.gre_gmat_status || profile.sop_status);

  return hasAcademicBackground && hasStudyGoal && hasPreferencesAndBudget && hasExamReadiness;
};

module.exports = { aiCounsellor };
