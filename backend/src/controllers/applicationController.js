const { getLockedUniversity } = require("../models/lockModel");
const { generateTodos, getTodos, completeTodo } = require("../models/todoModel");

const getApplicationGuidance = async (req, res) => {
  try {
    const { userId } = req.params;
    const lockedUni = await getLockedUniversity(userId);

    if (!lockedUni) {
      return res.status(403).json({
        message: "Lock a university to access application guidance."
      });
    }

    const todos = await getTodos(userId);

    res.json({
      university: lockedUni,
      requiredDocuments: [
        "Statement of Purpose",
        "Transcripts",
        "Test Scores",
        "Resume"
      ],
      timeline: "3–6 months before deadline",
      todos
    });
  } catch (error) {
    console.error("Error getting application guidance:", error);
    res.status(500).json({ error: "Failed to get application guidance" });
  }
};

const getUserTodos = async (req, res) => {
  try {
    const { userId } = req.params;
    const todos = await getTodos(userId);
    res.json({ todos });
  } catch (error) {
    console.error("Error getting todos:", error);
    res.status(500).json({ error: "Failed to get todos" });
  }
};

const markTodoComplete = async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    // Support both taskId (from DB) and taskIndex (legacy)
    const id = taskId || req.body.taskIndex;
    const todos = await completeTodo(userId, id);
    res.json({ todos });
  } catch (error) {
    console.error("Error completing todo:", error);
    res.status(500).json({ error: "Failed to complete todo" });
  }
};

module.exports = { getApplicationGuidance, getUserTodos, markTodoComplete };
