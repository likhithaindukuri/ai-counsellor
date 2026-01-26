const express = require("express");
const router = express.Router();
const { completeOnboarding, getProfileStatus, getProfileWithStage } = require("../controllers/onboardingController");

router.post("/complete", completeOnboarding);
router.get("/status/:userId", getProfileStatus);
router.get("/profile/:userId", getProfileWithStage);

module.exports = router;
