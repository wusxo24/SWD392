const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const doctorResponseController = require("../controllers/DoctorResponseController");

router.post("/", authMiddleware, authorize(["Manager, Doctor"]), doctorResponseController.createDoctorResponse);
router.put("/:id/update", authMiddleware, authorize(["Manager, Doctor"]), doctorResponseController.updateDoctorResponse);
router.put("/:id/complete", authMiddleware, authorize(["Manager, Doctor"]), doctorResponseController.sendDoctorResponse);

module.exports = router;