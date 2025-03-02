const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Tạo đơn hàng (Chỉ người dùng đã đăng nhập mới có thể đặt hàng)
router.post("/", authMiddleware, orderController.createOrder);

// Lấy danh sách đơn hàng của thành viên (Chỉ người dùng đã đăng nhập mới xem được đơn của mình)
router.get("/member", authMiddleware, orderController.getOrdersByMemberId);

// Lấy tất cả đơn hàng (Chỉ Admin mới có quyền truy cập)
router.get("/", authMiddleware, authorize(["Admin"]), orderController.getAllOrders);
module.exports = router;