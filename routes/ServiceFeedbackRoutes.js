const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const ServiceFeedbackController = require("../controllers/ServiceFeedbackController");

/**
 * @swagger
 * /service-feedback:
 *   post:
 *     summary: Rate a service
 *     tags: [ServiceFeedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service rated successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, authorize(["Member"]), ServiceFeedbackController.rateService);

/**
 * @swagger
 * /service-feedback:
 *   get:
 *     summary: Get all service feedback
 *     tags: [ServiceFeedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of service feedback
 *       400:
 *         description: Bad request
 */
router.get("/", authMiddleware, authorize(["Member", "Manager"]), ServiceFeedbackController.getAllRatings);

/**
 * @swagger
 * /service-feedback/{id}:
 *   delete:
 *     summary: Delete a service feedback
 *     tags: [ServiceFeedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Feedback ID
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       404:
 *         description: Feedback not found
 */
router.delete("/:id", authMiddleware, ServiceFeedbackController.deleteRating);

module.exports = router;