const express = require("express");
const router = express.Router();
const { completeOnboarding, getProfileStatus } = require("../controllers/onboardingController");

router.post("/complete", completeOnboarding);
router.get("/status/:userId", getProfileStatus);

module.exports = router;
