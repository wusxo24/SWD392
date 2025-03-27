const DoctorRating = require("../models/DoctorRating");
const DoctorInfo = require("../models/DoctorInfo");
const MemberInfo = require("../models/MemberInfo");

// Lấy tất cả đánh giá từ database, sắp xếp theo CreatedDate giảm dần
const getAllRatings = async (req, res) => {
  try {
    const ratings = await DoctorRating.find()
      .populate({
        path: "DoctorId",
        populate: { path: "doctorInfo", select: "picture" }, // Lấy picture từ DoctorInfo
      })
      .populate({
        path: "MemberId",
        populate: { path: "memberInfo", select: "picture" }, // Lấy picture từ MemberInfo
      })
      .sort({ CreatedDate: -1 });

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách đánh giá",
      error: error.message,
    });
  }
};

// Lấy thông tin bác sĩ theo ID
const getDoctorInfo = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await DoctorInfo.findOne({ user_id: doctorId }).populate(
      "user_id"
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin bác sĩ" });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thông tin bác sĩ", error: error.message });
  }
};

// Lấy thông tin thành viên theo ID
const getMemberInfo = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await MemberInfo.findOne({ user_id: memberId }).populate(
      "user_id"
    );

    if (!member) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin thành viên" });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin thành viên",
      error: error.message,
    });
  }
};

const getRatingById = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const rating = await DoctorRating.findById(ratingId).populate(
      "DoctorId MemberId"
    );

    if (!rating) {
      return res.status(404).json({ message: "Không tìm thấy rating" });
    }

    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy rating", error });
  }
};

module.exports = {
  getAllRatings,
  getDoctorInfo,
  getMemberInfo,
  getRatingById,
};
