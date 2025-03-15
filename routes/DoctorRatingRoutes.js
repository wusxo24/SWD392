const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const doctorRatingController = require("../controllers/DoctorRatingController");

/**
 * @swagger
 * /doctor-ratings/{medicalRequestId}:
 *   post:
 *     summary: Rate a doctor
 *     tags: [DoctorRatings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: medicalRequestId
 *         schema:
 *           type: string
 *         required: true
 *         description: Medical Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor rated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Medical request not found
 */
router.post("/:medicalRequestId", authMiddleware, authorize(["Manager", "Doctor", "Member"]), doctorRatingController.rateDoctor);

/**
 * @swagger
 * /doctor-ratings:
 *   get:
 *     summary: Get all doctor ratings
 *     tags: [DoctorRatings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctor ratings
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, authorize(["Manager", "Doctor"]), doctorRatingController.getAllDoctorRatings);

/**
 * @swagger
 * /doctor-ratings/{id}:
 *   delete:
 *     summary: Delete a doctor rating
 *     tags: [DoctorRatings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       404:
 *         description: Rating not found
 */
router.delete("/:id", authMiddleware, authorize(["Manager", "Doctor"]), doctorRatingController.deleteRating);

module.exports = router;