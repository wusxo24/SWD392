const Member = require("../models/MemberInfo");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAllMembers = async () => {
    return await Member.find();
};

const getMemberById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID format");
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
        throw new Error("User not found");
    }

    return member[0];
};

const updateMember = async (id, updateData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid member ID format");
    }

    delete updateData._id;

    const updatedMember = await Member.findOneAndUpdate(
        { user_id: id },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedMember) {
        throw new Error("Thành viên không tồn tại!");
    }

    return updatedMember;
};

const deleteMember = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid member ID format");
    }

    const deletedMember = await Member.findOneAndDelete({ user_id: id });
    if (!deletedMember) {
        throw new Error("Thành viên không tồn tại!");
    }

    return deletedMember;
};

module.exports = { getAllMembers, getMemberById, updateMember, deleteMember };