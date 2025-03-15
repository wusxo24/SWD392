const AccountService = require("../services/AccountService");

exports.createAccount = async (req, res) => {
    try {
        const newUser = await AccountService.createAccount(req.body);
        res.status(201).json({ message: "Tạo tài khoản thành công", user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllAccounts = async (req, res) => {
    try {
        const users = await AccountService.getAllAccounts();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const account = await AccountService.getAccountById(req.params.id);
        res.status(200).json(account);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { updatedUser, updatedDoctorInfo } = await AccountService.updateAccount(req.params.id, req.body);
        res.status(200).json({ 
            message: "Cập nhật thành công", 
            user: updatedUser, 
            doctorInfo: updatedDoctorInfo 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await AccountService.deleteAccount(req.params.id);
        res.status(200).json({ message: "Xóa tài khoản thành công" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};