const express = require("express");
const router = express.Router();
const { recommendUniversities, shortlistUniversity, getShortlist } = require("../controllers/universityController");

router.get("/recommend/:userId", recommendUniversities);
router.post("/shortlist", shortlistUniversity);
router.get("/shortlist/:userId", getShortlist);

module.exports = router;
