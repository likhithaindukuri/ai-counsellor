const { updateProfile, getProfile } = require("../models/profileModel");
const { updateStage, getStage } = require("../models/stageModel");
const { generateTodos } = require("../models/todoModel");
const { getLockedUniversity } = require("../models/lockModel");

const completeOnboarding = async (req, res) => {
  try {
    const { userId, profileData } = req.body;

    await updateProfile(userId, profileData);
    await updateStage(userId, "UNIVERSITY_DISCOVERY");

    res.json({
      message: "Onboarding completed",
      nextStage: "UNIVERSITY_DISCOVERY"
    });
  } catch (err) {
    res.status(500).json({ error: "Onboarding failed" });
  }
};

const getProfileStatus = async (req, res) => {
  const { userId } = req.params;
  const profile = await getProfile(userId);

  res.json({
    onboardingCompleted: profile?.onboarding_completed || false
  });
};

const getProfileWithStage = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getProfile(userId);
    const stage = await getStage(userId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Calculate profile strength
    const profileStrength = calculateProfileStrength(profile);

    res.json({
      ...profile,
      stage: stage || "PROFILE_BUILDING",
      profile_strength: profileStrength
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;

    // Update profile in database
    await updateProfile(userId, profileData);

    // Re-calculate profile strength
    const updatedProfile = await getProfile(userId);
    const profileStrength = calculateProfileStrength(updatedProfile);

    // Re-generate todos if user is in APPLICATION_PREP stage
    const stage = await getStage(userId);
    if (stage === "APPLICATION_PREP") {
      const lockedUni = getLockedUniversity(userId);
      if (lockedUni) {
        generateTodos(userId, lockedUni);
      }
    }

    res.json({
      message: "Profile updated successfully",
      profile_strength: profileStrength,
      note: "Recommendations will be recalculated based on your updated profile."
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const calculateProfileStrength = (profile) => {
  let score = 0;
  let factors = [];

  // Check GPA
  if (profile.gpa) {
    const gpa = parseFloat(profile.gpa);
    if (gpa >= 8.5) {
      score += 30;
      factors.push("Excellent GPA");
    } else if (gpa >= 7.5) {
      score += 20;
      factors.push("Good GPA");
    } else if (gpa >= 6.5) {
      score += 10;
      factors.push("Average GPA");
    }
  }

  // Check test scores
  if (profile.ielts_status && profile.ielts_status !== "Not started") {
    score += 20;
    factors.push("Test scores in progress");
  }

  // Check SOP
  if (profile.sop_status && profile.sop_status !== "Not started") {
    score += 15;
    factors.push("SOP preparation started");
  }

  // Check budget
  if (profile.budget_range) {
    score += 10;
    factors.push("Budget planned");
  }

  // Check preferred countries
  if (profile.preferred_countries && profile.preferred_countries.length > 0) {
    score += 10;
    factors.push("Target countries identified");
  }

  // Determine strength level
  let strength;
  if (score >= 70) {
    strength = "Strong";
  } else if (score >= 50) {
    strength = "Moderate";
  } else if (score >= 30) {
    strength = "Fair";
  } else {
    strength = "Needs Improvement";
  }

  return `${strength} (${score}/100) - ${factors.join(", ")}`;
};

module.exports = { completeOnboarding, getProfileStatus, getProfileWithStage, updateUserProfile };
