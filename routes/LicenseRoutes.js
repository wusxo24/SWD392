const express = require("express");
const router = express.Router();
const LicenseController = require("../controllers/LicenseController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Tạo giấy phép (chỉ Admin mới có quyền)
router.post("/", authMiddleware, authorize(["Admin"]), LicenseController.createLicense);

// Lấy danh sách giấy phép (tất cả người dùng đã đăng nhập có thể xem)
router.get("/", authMiddleware, LicenseController.getAllLicenses);

// Lấy thông tin giấy phép theo ID (tất cả người dùng đã đăng nhập có thể xem)
router.get("/:id", authMiddleware, LicenseController.getLicenseById);

// Cập nhật giấy phép (chỉ Admin mới có quyền)
router.put("/:id", authMiddleware, authorize(["Admin"]), LicenseController.updateLicense);

// Xóa giấy phép (chỉ Admin mới có quyền)
router.delete("/:id", authMiddleware, authorize(["Admin"]), LicenseController.deleteLicense);


module.exports = router;
