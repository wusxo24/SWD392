const Children = require("../models/Children");

// Tạo một child mới
exports.createChild = async (req, res) => {
    try {
        const {fname,lname,birthdate, gender, picture, blood_type, allergy, notes} = req.body;
        const memberId = req.user.id;
        const newChild = new Children({
            fname,
            lname,
            memberID: memberId,
            birthdate,
            gender,
            picture,
            blood_type,
            allergy,
            notes
        });
        await newChild.save();
        res.status(201).json(newChild);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo child", error: error.message });
    }
};

// Lấy danh sách tất cả children
exports.getAllChildren = async (req, res) => {
    try {
        const children = await Children.find();
        res.status(200).json(children);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách children", error: error.message });
    }
};

// Lấy thông tin children dựa theo id của member theo token
exports.getChildByMemberId = async (req, res) => {
    try {
        const memberId = req.user.id;
        if (!memberId) {
            return res.status(404).json({ message: "Member not found" });
        }
        const children = await Children.find({ memberID: memberId });
        if (children.length === 0) {
            return res.status(404).json({ message: "Member does not have any children" });
        }
        res.status(200).json(children);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin child", error: error.message });
    }

};

// Cập nhật thông tin child
exports.updateChild = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedChild = await Children.findOneAndUpdate({ childID: id }, req.body, { new: true });
        if (!updatedChild) {
            return res.status(404).json({ message: "Child không tồn tại!" });
        }
        res.status(200).json({ message: "Cập nhật thành công!", child: updatedChild });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật child", error: error.message });
    }
};

// Xóa child theo ID
exports.deleteChild = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedChild = await Children.findOneAndDelete({ childID: id });
        if (!deletedChild) {
            return res.status(404).json({ message: "Child không tồn tại!" });
        }
        res.status(200).json({ message: "Xóa child thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa child", error: error.message });
    }
};
