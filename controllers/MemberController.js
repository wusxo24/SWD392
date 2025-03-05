const Member = require("../models/MemberInfo");
const User = require("../models/User");
const mongoose = require("mongoose");


// Lấy danh sách tất cả thành viên
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách thành viên", error: error.message });
    }
};

// Lấy thông tin thành viên theo ID
const getMemberById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const member = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id), role: "Member" } },
            {
                $lookup: {
                    from: "memberinfos",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "memberData"
                }
            },
            { $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    fullname: { $ifNull: ["$memberData.fullname", ""] },
                    birthdate: { $ifNull: ["$memberData.birthdate", null] },
                    phone: { $ifNull: ["$memberData.phone", ""] },
                    gender: { $ifNull: ["$memberData.gender", ""] },
                    address: { $ifNull: ["$memberData.address", ""] },
                    picture: { $ifNull: ["$memberData.picture", ""] },
                    nickname: { $ifNull: ["$memberData.nickname", ""] }
                }
            }
        ]);

        if (!member.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(member[0]);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Cập nhật thông tin thành viên
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid member ID format" });
        }

        const updateData = { ...req.body };
        delete updateData._id;

        console.log("Updating member with data:", updateData);

        const updatedMember = await Member.findOneAndUpdate(
            { user_id: id },
            { $set: updateData }, // Ensure we explicitly set the picture field
            { new: true, runValidators: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ message: "Thành viên không tồn tại!" });
        }

        res.status(200).json({ message: "Cập nhật thành công!", member: updatedMember });
    } catch (error) {
        console.error("Lỗi khi cập nhật thành viên:", error);
        res.status(500).json({ message: "Lỗi khi cập nhật thành viên", error: error.message });
    }
};


// Xóa thành viên theo ID
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid member ID format" });
        }

        const deletedMember = await Member.findOneAndDelete({ user_id: id });
        if (!deletedMember) {
            return res.status(404).json({ message: "Thành viên không tồn tại!" });
        }

        res.status(200).json({ message: "Xóa thành viên thành công!" });
    } catch (error) {
        console.error("Lỗi khi xóa thành viên:", error);
        res.status(500).json({ message: "Lỗi khi xóa thành viên", error: error.message });
    }
};

// Xuất tất cả các function
module.exports = { 
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember
};
