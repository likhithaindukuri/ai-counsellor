const { getUniversities, shortlistUniversity: addToShortlist, getUserShortlist } = require("../models/universityModel");
const { getProfile } = require("../models/profileModel");

const recommendUniversities = async (req, res) => {
  const { userId } = req.params;
  const profile = await getProfile(userId);

  if (!profile?.onboarding_completed) {
    return res.status(403).json({ message: "Complete onboarding first" });
  }

  const allUnis = getUniversities();

  const recommendations = {
    dream: [],
    target: [],
    safe: []
  };

  allUnis.forEach((uni) => {
    if (profile.gpa >= uni.requiredGPA + 1) recommendations.safe.push(uni);
    else if (profile.gpa >= uni.requiredGPA) recommendations.target.push(uni);
    else recommendations.dream.push(uni);
  });

  res.json({ recommendations });
};

const shortlistUniversity = async (req, res) => {
  const { userId, universityName } = req.body;
  const shortlist = addToShortlist(userId, universityName);
  res.json({ message: "University shortlisted", shortlist });
};

const getShortlist = async (req, res) => {
  const { userId } = req.params;
  const shortlistNames = getUserShortlist(userId);
  
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
};

const getShortlisted = async (req, res) => {
  const { userId } = req.params;
  const shortlistNames = getUserShortlist(userId);
  
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
};

module.exports = { recommendUniversities, shortlistUniversity, getShortlist, getShortlisted };
