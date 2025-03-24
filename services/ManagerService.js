const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getManagers = async () => {
    return await User.find({ role: "Manager" });
};

const getManagerById = async (id) => {
    const manager = await User.findOne({ _id: id, role: "Manager" });
    if (!manager) {
        throw new Error("Manager not found");
    }
    return manager;
};

const createManager = async (managerData) => {
    try {
        const { username, email, password, status } = managerData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newManager = new User({
            username,
            email,
            password: hashedPassword,
            role: "Manager",
            status,
        });

        await newManager.save();
        return newManager;
    } catch (error) {
        console.error("Error creating manager:", error.message);
        throw new Error("Failed to create manager");
    }
};

const updateManager = async (id, updateData) => {
    const updatedManager = await User.findOneAndUpdate(
        { _id: id, role: "Manager" },
        updateData,
        { new: true }
    );
    if (!updatedManager) {
        throw new Error("Manager not found");
    }
    return updatedManager;
};

const deleteManager = async (id) => {
    const deletedManager = await User.findOneAndDelete({ _id: id, role: "Manager" });
    if (!deletedManager) {
        throw new Error("Manager not found");
    }
    return deletedManager;
};

const updateManagerStatus = async (id, status) => {
    const updatedManager = await User.findOneAndUpdate(
        { _id: id, role: "Manager" },
        { status },
        { new: true }
    );
    if (!updatedManager) {
        throw new Error("Manager not found");
    }
    return updatedManager;
};

module.exports = { getManagers, getManagerById, createManager, updateManager, deleteManager, updateManagerStatus };