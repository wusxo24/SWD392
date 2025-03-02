const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/TrackingController");
const { authMiddleware} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, trackingController.updateTracking);
router.get("/", authMiddleware, trackingController.getAllTrackingsByRecordId);
module.exports = router;