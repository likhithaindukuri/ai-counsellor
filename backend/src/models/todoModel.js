if (!global.todos) global.todos = {};

const generateTodos = (userId, university) => {
  global.todos[userId] = [
    { task: "Draft Statement of Purpose", status: "pending" },
    { task: "Prepare academic transcripts", status: "pending" },
    { task: "Register / Complete IELTS or TOEFL", status: "pending" },
    { task: `Fill application form for ${university}`, status: "pending" }
  ];
  return global.todos[userId];
};

const getTodos = (userId) => {
  return global.todos[userId] || [];
};

const completeTodo = (userId, taskIndex) => {
  if (global.todos[userId] && global.todos[userId][taskIndex]) {
    // Toggle between pending and completed
    const currentStatus = global.todos[userId][taskIndex].status;
    global.todos[userId][taskIndex].status = currentStatus === "completed" ? "pending" : "completed";
  }
  return global.todos[userId] || [];
};

module.exports = { generateTodos, getTodos, completeTodo };
