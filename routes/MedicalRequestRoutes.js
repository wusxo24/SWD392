const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const medicalRequestController = require("../controllers/MedicalRequestController");

router.post("/:recordId", authMiddleware, medicalRequestController.createMedicalRequest);
router.get("/:recordId", authMiddleware, authorize(["Manager"]), medicalRequestController.getMedicalRequestByRecordId);
router.put("/accept/:medicalRequestId", authMiddleware, authorize(["Manager"]), medicalRequestController.acceptMedicalRequest);
router.put("/reject/:medicalRequestId", authMiddleware, authorize(["Manager"]), medicalRequestController.rejectMedicalRequest);
router.get("/doctor/:doctorId", authMiddleware, authorize(["Doctor"]), medicalRequestController.getMedicalRequestByDoctorId);
router.put("/doctor/:medicalRequestId", authMiddleware, authorize(["Doctor"]), medicalRequestController.doctorStartWorkingOnMedicalRequest);


module.exports = router;