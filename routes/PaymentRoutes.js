const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/PaymentController");

/**
 * @swagger
 * /payments/receive-hook:
 *   post:
 *     summary: Receive payment hook
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment received successfully
 *       400:
 *         description: Bad request
 */
router.post("/receive-hook", paymentController.receivePayment);

/**
 * @swagger
 * /payments/{serviceId}:
 *   post:
 *     summary: Create embedded payment link
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         schema:
 *           type: string
 *         required: true
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *     responses:
 *       201:
 *         description: Embedded payment link created successfully
 *       400:
 *         description: Bad request
 */
router.post("/:serviceId", authMiddleware, paymentController.createEmmbeddedPaymentLink);

module.exports = router;