const pool = require("../config/db");

const lockUniversity = async (userId, universityName) => {
  try {
    // Check if user already has a locked university
    const existing = await pool.query(
      "SELECT id FROM locked_universities WHERE user_id = $1",
      [userId]
    );

    if (existing.rows.length > 0) {
      // Update existing lock
      await pool.query(
        "UPDATE locked_universities SET university_name = $1, updated_at = NOW() WHERE user_id = $2",
        [universityName, userId]
      );
    } else {
      // Insert new lock
      await pool.query(
        "INSERT INTO locked_universities (user_id, university_name) VALUES ($1, $2)",
        [userId, universityName]
      );
    }

    return universityName;
  } catch (error) {
    console.error("Error locking university:", error);
    throw error;
  }
};

const unlockUniversity = async (userId) => {
  try {
    await pool.query(
      "DELETE FROM locked_universities WHERE user_id = $1",
      [userId]
    );
  } catch (error) {
    console.error("Error unlocking university:", error);
    throw error;
  }
};

const getLockedUniversity = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT university_name FROM locked_universities WHERE user_id = $1",
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0].university_name : null;
  } catch (error) {
    console.error("Error getting locked university:", error);
    return null;
  }
};

module.exports = { lockUniversity, unlockUniversity, getLockedUniversity };
