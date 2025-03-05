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

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        const member = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id), role : "Member" } }, // Find user by ID
            {
                $lookup: {
                    from: "memberinfos", // Collection name of Member model (Mongoose converts model name to lowercase + 's')
                    localField: "_id", // User ID in User collection
                    foreignField: "user_id", // Reference field in Member collection
                    as: "memberData"
                }
            },
            { $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true } }, // Unwind member data
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    fullname: "$memberData.fullname",
                    birthdate: "$memberData.birthdate",
                    phone: "$memberData.phone",
                    gender: "$memberData.gender",
                    address: "$memberData.address",
                    blood_type: "$memberData.blood_type",
                    allergy: "$memberData.allergy",
                    notes: "$memberData.notes",
                    picture: "$memberData.picture"
                }
            }
        ]);

        if (!member.length) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(member[0]); // Return the first element from the aggregated result
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

        // Loại bỏ _id khỏi request body để tránh lỗi cập nhật immutable field
        const updateData = { ...req.body };
        delete updateData._id;

        // Cập nhật thông tin thành viên trong MemberInfo dựa trên user_id
        const updatedMember = await Member.findOneAndUpdate(
            { user_id: id }, // Đúng collection cần tìm
            updateData,
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
