const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const doctorResponseController = require("../controllers/DoctorResponseController");

/**
 * @swagger
 * /doctor-responses:
 *   post:
 *     summary: Create a new doctor response
 *     tags: [DoctorResponses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medicalRequestId:
 *                 type: string
 *               response:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor response created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, authorize(["Manager", "Doctor"]), doctorResponseController.createDoctorResponse);

/**
 * @swagger
 * /doctor-responses/{id}/update:
 *   put:
 *     summary: Update a doctor response
 *     tags: [DoctorResponses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor Response ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor response updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Doctor response not found
 */
router.put("/:id/update", authMiddleware, authorize(["Manager", "Doctor"]), doctorResponseController.updateDoctorResponse);

/**
 * @swagger
 * /doctor-responses/{id}/complete:
 *   put:
 *     summary: Complete a doctor response
 *     tags: [DoctorResponses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor Response ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor response completed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Doctor response not found
 */
router.put("/:id/complete", authMiddleware, authorize(["Manager", "Doctor"]), doctorResponseController.sendDoctorResponse);

module.exports = router;