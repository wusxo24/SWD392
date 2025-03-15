const express = require("express");
const router = express.Router();
const trackingController = require("../controllers/TrackingController");
const { authMiddleware } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /trackings:
 *   post:
 *     summary: Update tracking data
 *     tags: [Trackings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recordId:
 *                 type: string
 *               date:
 *                 type: string
 *               growthStats:
 *                 type: object
 *     responses:
 *       201:
 *         description: Tracking data saved successfully
 *       404:
 *         description: Record not found or not activated
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, trackingController.updateTracking);

/**
 * @swagger
 * /trackings:
 *   get:
 *     summary: Get all trackings by record ID
 *     tags: [Trackings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: recordId
 *         schema:
 *           type: string
 *         required: true
 *         description: Record ID
 *     responses:
 *       200:
 *         description: List of trackings
 *       404:
 *         description: No tracking records found for this record
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, trackingController.getAllTrackingsByRecordId);

module.exports = router;