const express = require("express");
const { createDoctor, getDoctors, updateDoctor, updateDoctorInfo, deleteDoctor } = require("../controllers/DoctorController");

const router = express.Router();

// Tạo bác sĩ
router.post("/", createDoctor);

// Lấy danh sách bác sĩ
router.get("/", getDoctors);

// Cập nhật bác sĩ
router.put("/:id", updateDoctor);

// Xóa bác sĩ
router.delete("/:id", deleteDoctor);

module.exports = router;
