const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const medicalRequestController = require("../controllers/MedicalRequestController");

/**
 * @swagger
 * /medical-requests/{recordId}:
 *   post:
 *     summary: Create a new medical request
 *     tags: [MedicalRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         schema:
 *           type: string
 *         required: true
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medical request created successfully
 *       400:
 *         description: Bad request
 */
router.post("/:recordId", authMiddleware, medicalRequestController.createMedicalRequest);

/**
 * @swagger
 * /medical-requests/{recordId}:
 *   get:
 *     summary: Get medical requests by record ID
 *     tags: [MedicalRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recordId
 *         schema:
 *           type: string
 *         required: true
 *         description: Record ID
 *     responses:
 *       200:
 *         description: List of medical requests
 *       400:
 *         description: Bad request
 *       404:
 *         description: Record not found
 */
router.get("/:recordId", authMiddleware, authorize(["Manager"]), medicalRequestController.getMedicalRequestByRecordId);

/**
 * @swagger
 * /medical-requests/accept/{medicalRequestId}:
 *   put:
 *     summary: Accept a medical request
 *     tags: [MedicalRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicalRequestId
 *         schema:
 *           type: string
 *         required: true
 *         description: Medical Request ID
 *     responses:
 *       200:
 *         description: Medical request accepted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Medical request not found
 */
router.put("/accept/:medicalRequestId", authMiddleware, authorize(["Manager"]), medicalRequestController.acceptMedicalRequest);

/**
 * @swagger
 * /medical-requests/reject/{medicalRequestId}:
 *   put:
 *     summary: Reject a medical request
 *     tags: [MedicalRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicalRequestId
 *         schema:
 *           type: string
 *         required: true
 *         description: Medical Request ID
 *     responses:
 *       200:
 *         description: Medical request rejected successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Medical request not found
 */
router.put("/reject/:medicalRequestId", authMiddleware, authorize(["Manager"]), medicalRequestController.rejectMedicalRequest);

/**
 * @swagger
 * /medical-requests/doctor/{doctorId}:
 *   get:
 *     summary: Get medical requests by doctor ID
 *     tags: [MedicalRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: List of medical requests
 *       400:
 *         description: Bad request
 *       404:
 *         description: Doctor not found
 */
router.get("/doctor/:doctorId", authMiddleware, authorize(["Doctor"]), medicalRequestController.getMedicalRequestByDoctorId);

/**
 * @swagger
 * /medical-requests/doctor/{medicalRequestId}:
 *   put:
 *     summary: Doctor starts working on a medical request
 *     tags: [MedicalRequests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicalRequestId
 *         schema:
 *           type: string
 *         required: true
 *         description: Medical Request ID
 *     responses:
 *       200:
 *         description: Doctor started working on medical request successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Medical request not found
 */
router.put("/doctor/:medicalRequestId", authMiddleware, authorize(["Doctor"]), medicalRequestController.doctorStartWorkingOnMedicalRequest);

router.get("/", authMiddleware, authorize(["Manager", "Doctor"]), medicalRequestController.getAllMedicalRequests);

module.exports = router;