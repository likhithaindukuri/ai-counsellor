const { lockUniversity, unlockUniversity, getLockedUniversity } = require("../models/lockModel");
const { updateStage } = require("../models/stageModel");
const { generateTodos } = require("../models/todoModel");

const lockUni = async (req, res) => {
  const { userId, universityId, universityName } = req.body;
  console.log("Locking university - userId:", userId, "universityId:", universityId, "universityName:", universityName);
  
  // Support both universityId and universityName for compatibility
  const name = universityName || universityId;
  console.log("Using university name:", name);

  const locked = lockUniversity(userId, name);
  console.log("Locked university stored:", locked);
  await updateStage(userId, "APPLICATION_PREP");
  
  // Generate todos when university is locked
  generateTodos(userId, name);

  res.json({
    message: "University locked successfully",
    lockedUniversity: locked,
    warning: "You can unlock later, but strategy will reset."
  });
};

const unlockUni = async (req, res) => {
  const { userId } = req.body;

  unlockUniversity(userId);
  await updateStage(userId, "UNIVERSITY_FINALIZATION");

  res.json({
    message: "University unlocked. Please finalize again."
  });
};

const getLocked = async (req, res) => {
  const { userId } = req.params;
  console.log("Getting locked university for userId:", userId);
  const lockedUniName = getLockedUniversity(userId);
  console.log("Found locked university:", lockedUniName);
  
  if (!lockedUniName) {
    console.log("No locked university found, returning null");
    return res.json({ name: null });
  }
  
  // Return format expected by Application page
  res.json({ name: lockedUniName });
};

module.exports = { lockUni, unlockUni, getLocked };
