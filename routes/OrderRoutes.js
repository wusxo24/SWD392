const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
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
 *               quantity:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, orderController.createOrder);

/**
 * @swagger
 * /orders/member:
 *   get:
 *     summary: Get orders by member ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       400:
 *         description: Bad request
 */
router.get("/member", authMiddleware, orderController.getOrdersByMemberId);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       403:
 *         description: Forbidden
 */
router.get("/", authMiddleware, authorize(["Admin", "Manager"]), orderController.getAllOrders);

/**
 * @swagger
 * /orders/{orderCode}:
 *   get:
 *     summary: Get order by order code
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderCode
 *         schema:
 *           type: string
 *         required: true
 *         description: Order code
 *     responses:
 *       200:
 *         description: Order data
 *       404:
 *         description: Order not found
 */
router.get("/:orderCode", authMiddleware, orderController.getOrderByOrderCode);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), orderController.deleteOrder);
router.post("/mobile-order", authMiddleware, orderController.createOrderForMobile);
module.exports = router;