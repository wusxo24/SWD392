const MemberService = require("../services/MemberService");

// Lấy danh sách tất cả thành viên
const getAllMembers = async (req, res) => {
    try {
        const members = await MemberService.getAllMembers();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách thành viên", error: error.message });
    }
};

// Lấy thông tin thành viên theo ID
const getMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await MemberService.getMemberById(id);
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Cập nhật thông tin thành viên
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMember = await MemberService.updateMember(id, req.body);
        res.status(200).json({ message: "Cập nhật thành công!", member: updatedMember });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật thành viên", error: error.message });
    }
};

// Xóa thành viên theo ID
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        await MemberService.deleteMember(id);
        res.status(200).json({ message: "Xóa thành viên thành công!" });
    } catch (error) {
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