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

  if (fields.length === 0) {
    return; // No fields to update
  }

  const setClause = fields
    .map((field, i) => `${field}=$${i + 1}`)
    .join(",");

  // Don't force onboarding_completed=true on every update
  // Only update the fields provided
  await pool.query(
    `UPDATE user_profiles SET ${setClause} WHERE user_id=$${fields.length + 1}`,
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
