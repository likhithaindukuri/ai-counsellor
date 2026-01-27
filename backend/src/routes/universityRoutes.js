const express = require("express");
const router = express.Router();
const { recommendUniversities, shortlistUniversity, getShortlist, getShortlisted } = require("../controllers/universityController");
const { lockUni } = require("../controllers/lockController");

router.get("/recommend/:userId", recommendUniversities);
router.post("/shortlist", shortlistUniversity);
router.get("/shortlist/:userId", getShortlist);
// Endpoint to match spec - returns array directly
router.get("/shortlisted/:userId", getShortlisted);
router.post("/lock", lockUni);

module.exports = router;
