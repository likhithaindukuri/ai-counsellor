const pool = require("../config/db");

const generateTodos = async (userId, university) => {
  try {
    // Delete existing todos for this user
    await pool.query("DELETE FROM user_todos WHERE user_id = $1", [userId]);

    // Generate new todos
    const defaultTodos = [
      "Draft Statement of Purpose",
      "Prepare academic transcripts",
      "Register / Complete IELTS or TOEFL",
      `Fill application form for ${university}`
    ];

    // Insert todos
    for (const task of defaultTodos) {
      await pool.query(
        "INSERT INTO user_todos (user_id, task, status) VALUES ($1, $2, $3)",
        [userId, task, "pending"]
      );
    }

    return await getTodos(userId);
  } catch (error) {
    console.error("Error generating todos:", error);
    throw error;
  }
};

const getTodos = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT id, task, status FROM user_todos WHERE user_id = $1 ORDER BY created_at ASC",
      [userId]
    );
    return result.rows.map(row => ({
      task: row.task,
      status: row.status,
      id: row.id
    }));
  } catch (error) {
    console.error("Error getting todos:", error);
    return [];
  }
};

const completeTodo = async (userId, taskId) => {
  try {
    // Update todo status
    const result = await pool.query(
      "UPDATE user_todos SET status = CASE WHEN status = 'completed' THEN 'pending' ELSE 'completed' END, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *",
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error("Todo not found");
    }

    return await getTodos(userId);
  } catch (error) {
    console.error("Error completing todo:", error);
    throw error;
  }
};

module.exports = { generateTodos, getTodos, completeTodo };
