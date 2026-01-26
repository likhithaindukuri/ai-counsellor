const pool = require("../config/db");

const createEmptyProfile = async (userId) => {
  await pool.query(
    "INSERT INTO user_profiles (user_id) VALUES ($1)",
    [userId]
  );
};

const updateProfile = async (userId, data) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setClause = fields
    .map((field, i) => `${field}=$${i + 1}`)
    .join(",");

  await pool.query(
    `UPDATE user_profiles SET ${setClause}, onboarding_completed=true WHERE user_id=$${fields.length + 1}`,
    [...values, userId]
  );
};

const getProfile = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM user_profiles WHERE user_id=$1",
    [userId]
  );
  return result.rows[0];
};

module.exports = { createEmptyProfile, updateProfile, getProfile };
