const Member = require("../models/MemberInfo");
const User = require("../models/User");
const mongoose = require("mongoose");

const getAllMembers = async () => {
    return await Member.find().populate("user_id", "username email role status");
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

const updateMember = async (memberId, memberData) => {
    try {
        // Update member in the database
        const member = await Member.findByIdAndUpdate(memberId, memberData, { new: true, runValidators: true });
        if (!member) {
            throw new Error('Member not found');
        }
        return member;
    } catch (error) {
        throw new Error(`Error updating member: ${error.message}`);
    }
};

const updateMemberAndUser = async (memberId, memberData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Separate member and user data from the incoming request
        const { user_id, email, role, status, username, ...memberFields } = memberData;

        // Update the member information
        const member = await Member.findOneAndUpdate(
            { _id: memberId },
            { ...memberFields },
            { new: true, runValidators: true, session }
        );
        if (!member) {
            throw new Error('Member not found');
        }

        // Update the user information
        const user = await User.findOneAndUpdate(
            { _id: member.user_id }, // user_id is the reference in the Member model
            { email, role, status, username },  // only update the relevant fields for the user
            { new: true, runValidators: true, session }
        );
        if (!user) {
            throw new Error('User not found');
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Return both updated member and user
        return { member, user };
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        session.endSession();
        throw new Error(`Error updating member and user: ${error.message}`);
    }
};

const updateMemberAndUserForMember = async (memberId, memberData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { username, email, role, status, _id, ...memberFields } = memberData;  // ✅ Exclude `_id`

        // Update MemberInfo by `user_id`
        const member = await Member.findOneAndUpdate(
            { user_id: memberId },  // ✅ Find by user_id
            { ...memberFields },
            { new: true, runValidators: true, session }
        );

        if (!member) {
            throw new Error(`Member not found for user_id: ${memberId}`);
        }

        // Update User by `_id`
        const user = await User.findOneAndUpdate(
            { _id: memberId }, 
            { email, role, username, status },  // ✅ Only update allowed fields
            { new: true, runValidators: true, session }
        );

        if (!user) {
            throw new Error(`User not found with ID: ${memberId}`);
        }

        await session.commitTransaction();
        session.endSession();

        return { member, user };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new Error(`Error updating member and user: ${error.message}`);
    }
};


const deleteMember = async (id) => {
    const member = await Member.findById(id);
    if (!member) {
        throw new Error("Member not found");
    }

    // Delete associated user
    await User.findByIdAndDelete(member.user_id);

    // Finally, delete the member's info
    await Member.findByIdAndDelete(id);

    return { message: "Member and related data deleted successfully" };
};

const updateMemberStatus = async (memberId, status) => {
    try {
        console.log("Updating member ID:", memberId, "to status:", status); // Debugging log

        // 🔹 Find the member by ID
        const member = await Member.findById(memberId);
        if (!member) {
            throw new Error("Member not found");
        }

        // 🔹 Update the user's status (User model)
        const updatedUser = await User.findByIdAndUpdate(
            member.user_id, // Get user_id from MemberInfo
            { status }, 
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser;
    } catch (error) {
        console.error("Error updating member status:", error);
        throw error; // Let the controller handle the error response
    }
};

module.exports = { getAllMembers, getMemberById, updateMember, deleteMember, updateMemberStatus, updateMemberAndUser, updateMemberAndUserForMember };