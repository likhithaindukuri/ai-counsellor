const { updateProfile, getProfile } = require("../models/profileModel");
const { updateStage } = require("../models/stageModel");

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

module.exports = { completeOnboarding, getProfileStatus };
