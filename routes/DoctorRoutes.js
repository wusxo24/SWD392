const express = require("express");
const { createDoctor, getDoctors, updateDoctor, updateDoctorInfo, deleteDoctor } = require("../controllers/DoctorController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Tạo bác sĩ (Chỉ Admin có quyền)
router.post("/", authMiddleware, authorize(["Admin"]), createDoctor);

// Lấy danh sách bác sĩ (Tất cả người dùng đã đăng nhập có thể xem)
router.get("/", authMiddleware, getDoctors);


// Cập nhật thông tin bác sĩ (Admin có thể cập nhật tất cả, bác sĩ chỉ cập nhật hồ sơ của họ)
router.put("/:id", authMiddleware, authorize(["Admin", "Doctor"]), updateDoctor);

// Xóa bác sĩ (Chỉ Admin có quyền)
router.delete("/:id", authMiddleware, authorize(["Admin"]), deleteDoctor);

module.exports = router;
