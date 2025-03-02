const express = require("express");
const router = express.Router();
const recordController = require("../controllers/RecordController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, recordController.createRecord);
router.put("/activate", authMiddleware, recordController.activateRecord);
router.put("/deactivate", authMiddleware, recordController.deativateRecord);
router.get("/", authMiddleware, recordController.getRecordsByMemberId);
module.exports = router;