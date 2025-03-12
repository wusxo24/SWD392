const User = require("../models/User");

class AdminService {
    async getAdmins() {
        return await User.find({ role: "Admin" });
    }

    async getAdminById(id) {
        const admin = await User.findOne({ _id: id, role: "Admin" });
        if (!admin) {
            throw new Error("Admin not found");
        }
        return admin;
    }

    async createAdmin(adminData) {
        const { username, email, password, status } = adminData;
        const newAdmin = new User({ username, email, password, role: "Admin", status });
        await newAdmin.save();
        return newAdmin;
    }

    async updateAdmin(id, updateData) {
        const updatedAdmin = await User.findOneAndUpdate(
            { _id: id, role: "Admin" },
            updateData,
            { new: true }
        );
        if (!updatedAdmin) {
            throw new Error("Admin not found");
        }
        return updatedAdmin;
    }

    async deleteAdmin(id) {
        const deletedAdmin = await User.findOneAndDelete({ _id: id, role: "Admin" });
        if (!deletedAdmin) {
            throw new Error("Admin not found");
        }
        return deletedAdmin;
    }
}

module.exports = new AdminService();