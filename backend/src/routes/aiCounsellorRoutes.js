const express = require("express");
const router = express.Router();
const { aiCounsellor } = require("../controllers/aiCounsellorController");

router.post("/chat", aiCounsellor);

module.exports = router;
