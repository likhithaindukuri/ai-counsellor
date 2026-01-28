const { lockUniversity, unlockUniversity, getLockedUniversity } = require("../models/lockModel");
const { updateStage } = require("../models/stageModel");
const { generateTodos } = require("../models/todoModel");

const lockUni = async (req, res) => {
  try {
    const { userId, universityId, universityName } = req.body;
    
    // Support both universityId and universityName for compatibility
    const name = universityName || universityId;

    const locked = await lockUniversity(userId, name);
    await updateStage(userId, "APPLICATION_PREP");
    
    // Generate todos when university is locked
    await generateTodos(userId, name);

    res.json({
      message: "University locked successfully",
      lockedUniversity: locked,
      warning: "You can unlock later, but strategy will reset."
    });
  } catch (error) {
    console.error("Error locking university:", error);
    res.status(500).json({ error: "Failed to lock university" });
  }
};

const unlockUni = async (req, res) => {
  try {
    const { userId } = req.body;

    await unlockUniversity(userId);
    await updateStage(userId, "UNIVERSITY_FINALIZATION");

    res.json({
      message: "University unlocked. Please finalize again."
    });
  } catch (error) {
    console.error("Error unlocking university:", error);
    res.status(500).json({ error: "Failed to unlock university" });
  }
};

const getLocked = async (req, res) => {
  try {
    const { userId } = req.params;
    const lockedUniName = await getLockedUniversity(userId);
    
    if (!lockedUniName) {
      return res.json({ name: null });
    }
    
    // Return format expected by Application page
    res.json({ name: lockedUniName });
  } catch (error) {
    console.error("Error getting locked university:", error);
    res.status(500).json({ error: "Failed to get locked university" });
  }
};

module.exports = { lockUni, unlockUni, getLocked };
