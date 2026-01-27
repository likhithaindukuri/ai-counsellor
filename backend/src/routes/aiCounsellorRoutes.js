const express = require("express");
const router = express.Router();
const { aiCounsellor } = require("../controllers/aiCounsellorController");
const { getUserTodos } = require("../controllers/applicationController");

router.post("/chat", aiCounsellor);
// Endpoint for Application page
router.get("/application-tasks/:userId", getUserTodos);

module.exports = router;
