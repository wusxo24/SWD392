const express = require("express");
const router = express.Router();

const {
  getAllRatings,
  getDoctorInfo,
  getMemberInfo,
  getRatingById,
} = require("../controllers/RatingController");

// Lấy danh sách tất cả rating
router.get("/", getAllRatings);

// Lấy thông tin bác sĩ theo ID
router.get("/doctor/:doctorId", getDoctorInfo);

// Lấy thông tin thành viên theo ID
router.get("/member/:memberId", getMemberInfo);

router.get("/:ratingId", getRatingById);

module.exports = router;
