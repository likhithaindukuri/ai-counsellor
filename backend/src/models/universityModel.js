const pool = require("../config/db");

// Static university data (can be expanded or moved to DB later)
const universities = [
  {
    name: "Stanford University",
    country: "USA",
    costLevel: "High",
    acceptanceChance: "Low",
    requiredGPA: 9.0
  },
  {
    name: "University of Texas Austin",
    country: "USA",
    costLevel: "Medium",
    acceptanceChance: "Medium",
    requiredGPA: 7.5
  },
  {
    name: "Arizona State University",
    country: "USA",
    costLevel: "Low",
    acceptanceChance: "High",
    requiredGPA: 6.5
  },
  {
    name: "MIT",
    country: "USA",
    costLevel: "High",
    acceptanceChance: "Low",
    requiredGPA: 9.2
  },
  {
    name: "University of California Berkeley",
    country: "USA",
    costLevel: "High",
    acceptanceChance: "Medium",
    requiredGPA: 8.0
  },
  {
    name: "University of Toronto",
    country: "Canada",
    costLevel: "Medium",
    acceptanceChance: "Medium",
    requiredGPA: 7.8
  },
  {
    name: "University of British Columbia",
    country: "Canada",
    costLevel: "Medium",
    acceptanceChance: "Medium",
    requiredGPA: 7.5
  },
  {
    name: "University of Waterloo",
    country: "Canada",
    costLevel: "Low",
    acceptanceChance: "High",
    requiredGPA: 7.0
  },
  {
    name: "Oxford University",
    country: "UK",
    costLevel: "High",
    acceptanceChance: "Low",
    requiredGPA: 8.5
  },
  {
    name: "Imperial College London",
    country: "UK",
    costLevel: "High",
    acceptanceChance: "Medium",
    requiredGPA: 8.0
  },
  {
    name: "University of Manchester",
    country: "UK",
    costLevel: "Medium",
    acceptanceChance: "High",
    requiredGPA: 7.0
  }
];

const getUniversities = () => universities;

const shortlistUniversity = async (userId, uniName) => {
  try {
    // Check if already shortlisted
    const existing = await pool.query(
      "SELECT id FROM university_shortlists WHERE user_id = $1 AND university_name = $2",
      [userId, uniName]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        "INSERT INTO university_shortlists (user_id, university_name) VALUES ($1, $2)",
        [userId, uniName]
      );
    }

    // Return updated shortlist
    return await getUserShortlist(userId);
  } catch (error) {
    console.error("Error shortlisting university:", error);
    throw error;
  }
};

const getUserShortlist = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT university_name FROM university_shortlists WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return result.rows.map(row => row.university_name);
  } catch (error) {
    console.error("Error getting shortlist:", error);
    return [];
  }
};

module.exports = { getUniversities, shortlistUniversity, getUserShortlist };
  