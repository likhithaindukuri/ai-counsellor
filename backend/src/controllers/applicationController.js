const { getLockedUniversity } = require("../models/lockModel");
const { generateTodos, getTodos, completeTodo } = require("../models/todoModel");

const getApplicationGuidance = async (req, res) => {
  const { userId } = req.params;
  const lockedUni = getLockedUniversity(userId);

  if (!lockedUni) {
    return res.status(403).json({
      message: "Lock a university to access application guidance."
    });
  }

  const todos = generateTodos(userId, lockedUni);

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
};

const getUserTodos = async (req, res) => {
  const { userId } = req.params;
  res.json({ todos: getTodos(userId) });
};

const markTodoComplete = async (req, res) => {
  const { userId, taskIndex } = req.body;
  const todos = completeTodo(userId, taskIndex);
  res.json({ todos });
};

module.exports = { getApplicationGuidance, getUserTodos, markTodoComplete };
