const { updateProfile, getProfile } = require("../models/profileModel");
const { updateStage, getStage } = require("../models/stageModel");

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

    res.json({
      ...profile,
      stage: stage || "PROFILE_BUILDING"
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

module.exports = { completeOnboarding, getProfileStatus, getProfileWithStage };
