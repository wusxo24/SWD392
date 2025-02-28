const express = require("express");
const {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember
} = require("../controllers/MemberController");

const router = express.Router();

router.post("/", createMember); // Tạo thành viên
router.get("/", getAllMembers); // Lấy danh sách thành viên
router.get("/:id", getMemberById); // Lấy thông tin thành viên theo ID
router.put("/:id", updateMember); // Cập nhật thành viên
router.delete("/:id", deleteMember); // Xóa thành viên

module.exports = router;
