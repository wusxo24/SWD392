const bcrypt = require("bcryptjs");
const User = require("../models/User");
const DoctorInfo = require("../models/DoctorInfo");

class AccountService {
    async createAccount(accountData) {
        const { username, email, password, role, status } = accountData;

        if (!username || !email || !password || !role) {
            throw new Error("Thiếu thông tin bắt buộc");
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            throw new Error("Email hoặc Username đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            status: status || "Active"
        });

        await newUser.save();

        if (role === "Doctor") {
            const newDoctorInfo = new DoctorInfo({
                user_id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role,
                status: newUser.status,
            });

            await newDoctorInfo.save();
        }

        return newUser;
    }

    async getAllAccounts() {
        return await User.find().select("-password");
    }

    async getAccountById(id) {
        const user = await User.findById(id).select("-password");
        if (!user) {
            throw new Error("Không tìm thấy tài khoản");
        }

        if (user.role === "Doctor") {
            const doctorInfo = await DoctorInfo.findOne({ user_id: user._id });
            return { user, doctorInfo };
        }

        return user;
    }

    async updateAccount(id, updateData) {
        const { username, email, role, status, doctorInfo } = updateData;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, role, status },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("Không tìm thấy tài khoản");
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

        return { updatedUser, updatedDoctorInfo };
    }

    async deleteAccount(id) {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error("Không tìm thấy tài khoản");
        }

        if (deletedUser.role === "Doctor") {
            await DoctorInfo.findOneAndDelete({ user_id: deletedUser._id });
        }

        return deletedUser;
    }
}

module.exports = new AccountService();