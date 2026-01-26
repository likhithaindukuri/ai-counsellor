const express = require("express");
const router = express.Router();
const { lockUni, unlockUni, getLocked } = require("../controllers/lockController");

router.post("/lock", lockUni);
router.post("/unlock", unlockUni);
router.get("/:userId", getLocked);

module.exports = router;
