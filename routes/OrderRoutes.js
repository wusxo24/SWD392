const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware ,orderController.createOrder);
router.get("/member", authMiddleware,orderController.getOrdersByMemberId);
router.get("/", orderController.getAllOrders);
module.exports = router;