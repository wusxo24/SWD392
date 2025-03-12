const User = require("../models/User");

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
    const { username, email, password, status } = managerData;
    const newManager = new User({ username, email, password, role: "Manager", status });
    await newManager.save();
    return newManager;
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

module.exports = { getManagers, getManagerById, createManager, updateManager, deleteManager };