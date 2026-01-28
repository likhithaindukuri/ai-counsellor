const { getUniversities, shortlistUniversity: addToShortlist, getUserShortlist } = require("../models/universityModel");
const { getProfile } = require("../models/profileModel");

const recommendUniversities = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await getProfile(userId);

    if (!profile?.onboarding_completed) {
      return res.status(403).json({ message: "Complete onboarding first" });
    }

    const allUnis = getUniversities();
    const preferredCountries = profile.preferred_countries || [];
    const budgetRange = profile.budget_range || "";
    const userGPA = parseFloat(profile.gpa) || 0;

    // Filter universities by country preference if specified
    let filteredUnis = allUnis;
    if (preferredCountries.length > 0) {
      filteredUnis = allUnis.filter(uni => 
        preferredCountries.some(country => 
          uni.country.toLowerCase().includes(country.toLowerCase()) || 
          country.toLowerCase().includes(uni.country.toLowerCase())
        )
      );
      // If no matches, show all (user can still see recommendations)
      if (filteredUnis.length === 0) {
        filteredUnis = allUnis;
      }
    }

    // Filter by budget if specified (simplified logic)
    if (budgetRange) {
      const budgetLower = budgetRange.toLowerCase();
      if (budgetLower.includes("low") || budgetLower.includes("20") || budgetLower.includes("30")) {
        filteredUnis = filteredUnis.filter(uni => 
          uni.costLevel === "Low" || uni.costLevel === "Medium"
        );
      } else if (budgetLower.includes("high") || budgetLower.includes("50") || budgetLower.includes("60")) {
        // High budget - include all
      } else {
        // Medium budget - exclude only very high cost
        filteredUnis = filteredUnis.filter(uni => uni.costLevel !== "High");
      }
    }

    const recommendations = {
      dream: [],
      target: [],
      safe: []
    };

    filteredUnis.forEach((uni) => {
      // Categorize based on GPA match
      if (userGPA >= uni.requiredGPA + 0.5) {
        recommendations.safe.push(uni);
      } else if (userGPA >= uni.requiredGPA - 0.5) {
        recommendations.target.push(uni);
      } else {
        recommendations.dream.push(uni);
      }
    });

    res.json({ recommendations });
  } catch (error) {
    console.error("Error recommending universities:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
};

const shortlistUniversity = async (req, res) => {
  try {
    const { userId, universityName } = req.body;
    const shortlist = await addToShortlist(userId, universityName);
    res.json({ message: "University shortlisted", shortlist });
  } catch (error) {
    console.error("Error shortlisting:", error);
    res.status(500).json({ error: "Failed to shortlist university" });
  }
};

const getShortlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const shortlistNames = await getUserShortlist(userId);
  
  // Get full university data
  const allUnis = getUniversities();
  const universityMap = {};
  allUnis.forEach(uni => {
    universityMap[uni.name] = {
      id: uni.name.toLowerCase().replace(/\s+/g, "-"),
      name: uni.name,
      country: uni.country,
      cost_level: uni.costLevel,
      acceptance_chance: uni.acceptanceChance,
      risk_reason: uni.acceptanceChance === "Low" ? "Highly competitive, requires exceptional profile" :
                   uni.acceptanceChance === "Medium" ? "Good match for your profile" :
                   "Safe option with higher acceptance rate"
    };
  });
  
    const fullUniversities = shortlistNames.map(name => universityMap[name]).filter(u => u);
    
    // Check if this is the /shortlisted endpoint (return array directly) or /shortlist (return object)
    if (req.originalUrl && req.originalUrl.includes("/shortlisted")) {
      res.json(fullUniversities);
    } else {
      res.json({ shortlist: shortlistNames });
    }
  } catch (error) {
    console.error("Error getting shortlist:", error);
    res.status(500).json({ error: "Failed to get shortlist" });
  }
};

const getShortlisted = async (req, res) => {
  try {
    const { userId } = req.params;
    const shortlistNames = await getUserShortlist(userId);
  
  // Get full university data
  const allUnis = getUniversities();
  const universityMap = {};
  allUnis.forEach(uni => {
    universityMap[uni.name] = {
      id: uni.name.toLowerCase().replace(/\s+/g, "-"),
      name: uni.name,
      country: uni.country,
      cost_level: uni.costLevel,
      acceptance_chance: uni.acceptanceChance,
      risk_reason: uni.acceptanceChance === "Low" ? "Highly competitive, requires exceptional profile" :
                   uni.acceptanceChance === "Medium" ? "Good match for your profile" :
                   "Safe option with higher acceptance rate"
    };
  });
  
    const fullUniversities = shortlistNames.map(name => universityMap[name]).filter(u => u);
    res.json(fullUniversities);
  } catch (error) {
    console.error("Error getting shortlisted:", error);
    res.status(500).json({ error: "Failed to get shortlisted universities" });
  }
};

module.exports = { recommendUniversities, shortlistUniversity, getShortlist, getShortlisted };
