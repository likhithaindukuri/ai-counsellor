const express = require("express");
const router = express.Router();
const { completeOnboarding, getProfileStatus, getProfileWithStage, updateUserProfile } = require("../controllers/onboardingController");

router.post("/complete", completeOnboarding);
router.get("/status/:userId", getProfileStatus);
router.get("/profile/:userId", getProfileWithStage);
router.put("/profile/:userId", updateUserProfile);

module.exports = router;
