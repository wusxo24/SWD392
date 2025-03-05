const bcrypt = require("bcryptjs");
const User = require("../models/User");
const DoctorInfo = require("../models/DoctorInfo");

exports.createAccount = async (req, res) => {
    try {
        const { username, email, password, role, status } = req.body;

        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
        }

        // Kiểm tra tài khoản đã tồn tại chưa
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email hoặc Username đã tồn tại" });
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản trong User
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            status: status || "Active"
        });

        await newUser.save();

        // Nếu role là "Doctor", tạo hồ sơ trong DoctorInfo
        if (role === "Doctor") {
            const newDoctorInfo = new DoctorInfo({
                user_id: newUser._id,  // Liên kết với User
                username: newUser.username,
                email: newUser.email,
                password: newUser.password, // Mật khẩu đã hash
                role: newUser.role,
                status: newUser.status,
            });

            await newDoctorInfo.save();
        }

        res.status(201).json({ message: "Tạo tài khoản thành công", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getAllAccounts = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getAccountById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        if (user.role === "Doctor") {
            const doctorInfo = await DoctorInfo.findOne({ user_id: user._id });
            return res.status(200).json({ user, doctorInfo });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const { username, email, role, status, doctorInfo } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role, status },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        let updatedDoctorInfo = null;
        if (updatedUser.role === "Doctor" && doctorInfo) {
            let existingDoctorInfo = await DoctorInfo.findOne({ user_id: updatedUser._id });

            if (existingDoctorInfo) {
                updatedDoctorInfo = await DoctorInfo.findOneAndUpdate(
                    { user_id: updatedUser._id },
                    doctorInfo,
                    { new: true }
                );
            } else {
                updatedDoctorInfo = new DoctorInfo({ user_id: updatedUser._id, ...doctorInfo });
                await updatedDoctorInfo.save();
            }
        }

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
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản" });
        }

        if (deletedUser.role === "Doctor") {
            await DoctorInfo.findOneAndDelete({ user_id: deletedUser._id });
        }

        res.status(200).json({ message: "Xóa tài khoản thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
