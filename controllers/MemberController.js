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
        const memberId = req.params.id; // Get memberId from URL
        const memberData = req.body; // Get member data from the request body

        console.log('memberId:', memberId); // Log memberId
        console.log('memberData:', memberData); // Log memberData

        // Call the service to update both member and user
        const updatedData = await MemberService.updateMemberAndUser(memberId, memberData);

        // Send the response with both updated member and user
        res.json(updatedData);
    } catch (error) {
        console.error('Error updating member and user:', error); // Log the error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const updateMemberForMember = async (req, res) => {
    try {
        const memberId = req.params.id; // Get memberId from URL
        const memberData = req.body; // Get member data from the request body

        console.log('memberId:', memberId); // Log memberId
        console.log('memberData:', memberData); // Log memberData

        // Call the service to update both member and user
        const updatedData = await MemberService.updateMemberAndUserForMember(memberId, memberData);

        // Send the response with both updated member and user
        res.json(updatedData);
    } catch (error) {
        console.error('Error updating member and user:', error); // Log the error
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// Xóa thành viên theo ID
const deleteMember = async (req, res) => {
    try {
        await MemberService.deleteMember(req.params.id);
        res.status(200).json({ message: "Xóa thành viên thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa thành viên", error: error.message });
    }
};

const updateMemberStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Call the service to update member status
        const updatedUser = await MemberService.updateMemberStatus(id, status);

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

// Xuất tất cả các function
module.exports = { 
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
    updateMemberStatus,
    updateMemberForMember
};