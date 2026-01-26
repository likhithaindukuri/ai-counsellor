const pool = require("../config/db");

const createInitialStage = async (userId) => {
  await pool.query(
    "INSERT INTO user_stages (user_id, current_stage) VALUES ($1,$2)",
    [userId, "PROFILE_BUILDING"]
  );
};

const getStage = async (userId) => {
  const result = await pool.query(
    "SELECT current_stage FROM user_stages WHERE user_id=$1",
    [userId]
  );
  return result.rows[0]?.current_stage;
};

const updateStage = async (userId, stage) => {
  await pool.query(
    "UPDATE user_stages SET current_stage=$1, updated_at=NOW() WHERE user_id=$2",
    [stage, userId]
  );
};

module.exports = { createInitialStage, getStage, updateStage };
