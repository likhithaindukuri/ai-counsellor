let universities = [
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
    }
  ];
  
  const getUniversities = () => universities;
  
  const shortlistUniversity = (userId, uniName) => {
    // Dummy storage for now
    if (!global.userShortlists) global.userShortlists = {};
    if (!global.userShortlists[userId]) global.userShortlists[userId] = [];
    global.userShortlists[userId].push(uniName);
    return global.userShortlists[userId];
  };
  
  const getUserShortlist = (userId) => {
    return global.userShortlists?.[userId] || [];
  };
  
  module.exports = { getUniversities, shortlistUniversity, getUserShortlist };
  