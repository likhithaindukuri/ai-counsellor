if (!global.lockedUniversities) global.lockedUniversities = {};

const lockUniversity = (userId, universityName) => {
  console.log("lockModel: Storing locked university for userId:", userId, "university:", universityName);
  global.lockedUniversities[userId] = universityName;
  console.log("lockModel: Current locked universities:", global.lockedUniversities);
  return universityName;
};

const unlockUniversity = (userId) => {
  console.log("lockModel: Unlocking university for userId:", userId);
  delete global.lockedUniversities[userId];
};

const getLockedUniversity = (userId) => {
  console.log("lockModel: Getting locked university for userId:", userId);
  console.log("lockModel: Available locked universities:", global.lockedUniversities);
  const result = global.lockedUniversities[userId] || null;
  console.log("lockModel: Found:", result);
  return result;
};

module.exports = { lockUniversity, unlockUniversity, getLockedUniversity };
