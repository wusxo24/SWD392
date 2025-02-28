const Children = require("../models/Children");
const Member = require("../models/MemberInfo");

// Tạo thành viên mới
const createMember = async (req, res) => {
    try {
        const newMember = new Member(req.body);
        await newMember.save();
        res.status(201).json({
            memberID: newMember._id, // Lấy _id làm memberID
            ...newMember.toObject()
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo member", error });
    }
};

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
        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({ message: "Thành viên không tồn tại!" });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin thành viên", error: error.message });
    }
};

// Cập nhật thông tin thành viên
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMember = await Member.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMember) {
            return res.status(404).json({ message: "Thành viên không tồn tại!" });
        }
        res.status(200).json({ message: "Cập nhật thành công!", member: updatedMember });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật thành viên", error: error.message });
    }
};

// Xóa thành viên theo ID
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMember = await Member.findByIdAndDelete(id);
        if (!deletedMember) {
            return res.status(404).json({ message: "Thành viên không tồn tại!" });
        }
        res.status(200).json({ message: "Xóa thành viên thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa thành viên", error: error.message });
    }
};

// Xuất tất cả các function
module.exports = {
    createMember, 
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember
};
