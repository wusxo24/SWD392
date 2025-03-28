const express = require("express");
const router = express.Router();

const {
  getAllRatings,
  getDoctorInfo,
  getMemberInfo,
  getRatingById,
} = require("../controllers/RatingController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Lấy danh sách tất cả rating
router.get("/",authMiddleware, authorize(["Admin", "Manager","Doctor"]), getAllRatings);

// Lấy thông tin bác sĩ theo ID
router.get("/doctor/:doctorId",authMiddleware, authorize(["Admin", "Manager","Doctor"]), getDoctorInfo);

// Lấy thông tin thành viên theo ID
router.get("/member/:memberId",authMiddleware, authorize(["Admin", "Manager","Doctor"]), getMemberInfo);


router.get("/:ratingId", authMiddleware, authorize(["Admin", "Manager","Doctor"]), getRatingById);

module.exports = router;
