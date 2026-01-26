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
  const shortlist = getUserShortlist(userId);
  res.json({ shortlist });
};

module.exports = { recommendUniversities, shortlistUniversity, getShortlist };
