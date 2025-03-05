const express = require("express");
const router = express.Router();
const childrenController = require("../controllers/ChildrenController");
const { authorizeChildOwner, authMiddleware } = require("../middleware/authMiddleware");

// Tạo mới trẻ (chỉ cho phép người dùng đã đăng nhập)
router.post("/:userId", authMiddleware, childrenController.createChild);

// Lấy danh sách trẻ theo thành viên (chỉ chủ tài khoản xem được con họ)
router.get("/", authMiddleware, childrenController.getChildByMemberId);

// Cập nhật thông tin trẻ (chỉ chủ tài khoản mới có quyền cập nhật)
router.put("/:id", authMiddleware, authorizeChildOwner, childrenController.updateChild);

// Xóa trẻ (chỉ chủ tài khoản mới có quyền xóa)
router.delete("/:id", authMiddleware, authorizeChildOwner, childrenController.deleteChild);

module.exports = router;
