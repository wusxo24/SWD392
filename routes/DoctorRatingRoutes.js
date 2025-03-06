const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const doctorRatingController = require("../controllers/DoctorRatingController");

router.post("/:medicalRequestId", authMiddleware, authorize(["Manager, Doctor, Member"]), doctorRatingController.rateDoctor);
router.get("/", authMiddleware, authorize(["Manager, Doctor"]), doctorRatingController.getAllDoctorRatings);
router.delete("/:id", authMiddleware, authorize(["Manager, Doctor"]), doctorRatingController.deleteRating);

module.exports = router;