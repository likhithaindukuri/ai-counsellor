if (!global.lockedUniversities) global.lockedUniversities = {};

const lockUniversity = (userId, universityName) => {
  global.lockedUniversities[userId] = universityName;
  return universityName;
};

const unlockUniversity = (userId) => {
  delete global.lockedUniversities[userId];
};

const getLockedUniversity = (userId) => {
  return global.lockedUniversities[userId] || null;
};

module.exports = { lockUniversity, unlockUniversity, getLockedUniversity };
