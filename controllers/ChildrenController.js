const ChildrenService = require("../services/ChildrenService");

// Tạo một child mới
exports.createChild = async (req, res) => {
    try {
        const memberId = req.user.id;
        const newChild = await ChildrenService.createChild(req.body, memberId);
        res.status(201).json(newChild);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo child", error: error.message });
    }
};

// Lấy danh sách tất cả children
exports.getAllChildren = async (req, res) => {
    try {
        const children = await ChildrenService.getAllChildren();
        res.status(200).json(children);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách children", error: error.message });
    }
};

// Lấy thông tin children dựa theo id của member theo token
exports.getChildByMemberId = async (req, res) => {
    try {
        const memberId = req.user.id;
        const children = await ChildrenService.getChildByMemberId(memberId);
        res.status(200).json(children);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin child", error: error.message });
    }
};

// Cập nhật thông tin child
exports.updateChild = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedChild = await ChildrenService.updateChild(id, req.body);
        res.status(200).json({ message: "Cập nhật thành công!", child: updatedChild });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật child", error: error.message });
    }
};

// Xóa child theo ID
exports.deleteChild = async (req, res) => {
    try {
        const { id } = req.params;
        await ChildrenService.deleteChild(id);
        res.status(200).json({ message: "Xóa child thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa child", error: error.message });
    }
};

// Lấy thông tin child theo childID
exports.getChildById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL
        const child = await ChildrenService.getChildById(id);
        res.status(200).json(child);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin child", error: error.message });
    }
};