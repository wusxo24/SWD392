const express = require("express");
const {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember
} = require("../controllers/MemberController");

const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Tạo thành viên (Chỉ Admin mới có quyền)
router.post("/", authMiddleware, authorize(["Admin"]), createMember);

// Lấy danh sách thành viên (Tất cả người dùng đã đăng nhập có thể xem)
router.get("/", authMiddleware, getAllMembers);

// Lấy thông tin thành viên theo ID (Tất cả người dùng đã đăng nhập có thể xem)
router.get("/:id", authMiddleware, getMemberById);

// Cập nhật thành viên (Chỉ Admin mới có quyền)
router.put("/:id", authMiddleware, authorize(["Admin"]), updateMember);

// Xóa thành viên (Chỉ Admin mới có quyền)
router.delete("/:id", authMiddleware, authorize(["Admin"]), deleteMember);

module.exports = router;
