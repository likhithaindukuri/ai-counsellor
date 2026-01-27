const { lockUniversity, unlockUniversity, getLockedUniversity } = require("../models/lockModel");
const { updateStage } = require("../models/stageModel");

const lockUni = async (req, res) => {
  const { userId, universityId, universityName } = req.body;
  
  // Support both universityId and universityName for compatibility
  const name = universityName || universityId;

  const locked = lockUniversity(userId, name);
  await updateStage(userId, "APPLICATION_PREP");

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
  res.json({ lockedUniversity: getLockedUniversity(userId) });
};

module.exports = { lockUni, unlockUni, getLocked };
