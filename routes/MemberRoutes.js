const express = require("express");
const {
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember
} = require("../controllers/MemberController");

const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Lấy danh sách thành viên (Tất cả người dùng đã đăng nhập có thể xem)
router.get("/", authMiddleware, getAllMembers);

// Lấy thông tin thành viên theo ID (Tất cả người dùng đã đăng nhập có thể xem)
router.get("/:id", authMiddleware, getMemberById);

// Cập nhật thành viên (Member tự cập nhật profile, manager quản lí profile member)
router.put("/:id", authMiddleware, authorize(["Member", "Manager"]), updateMember);

// Xóa thành viên (Chỉ Admin mới có quyền)
router.delete("/:id", authMiddleware, authorize(["Admin"]), deleteMember);

module.exports = router;
