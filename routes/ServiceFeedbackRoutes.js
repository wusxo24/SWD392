const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const ServiceFeedbackController = require("../controllers/ServiceFeedbackController");

router.post("/", authMiddleware, authorize(["Member"]), ServiceFeedbackController.rateService);
router.get("/", authMiddleware, authorize(["Member", "Manager"]), ServiceFeedbackController.getAllRatings);
router.delete("/:id", authMiddleware, ServiceFeedbackController.deleteRating);

module.exports = router;