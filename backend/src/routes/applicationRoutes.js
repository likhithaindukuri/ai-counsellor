const express = require("express");
const router = express.Router();
const {
  getApplicationGuidance,
  getUserTodos,
  markTodoComplete
} = require("../controllers/applicationController");

router.get("/guidance/:userId", getApplicationGuidance);
router.get("/todos/:userId", getUserTodos);
router.post("/todos/complete", markTodoComplete);

module.exports = router;
