const User = require("../models/User");

// Get all Admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "Admin" });
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch admins" });
    }
};

// Get a single Admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await User.findOne({ _id: req.params.id, role: "Admin" });
        if (!admin) return res.status(404).json({ error: "Admin not found" });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch admin" });
    }
};

// Create a new Admin
exports.createAdmin = async (req, res) => {
    try {
        const { username, email, password, status } = req.body;
        const newAdmin = new User({ username, email, password, role: "Admin", status });
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(500).json({ error: "Failed to create admin" });
    }
};

// Update an Admin
exports.updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await User.findOneAndUpdate(
            { _id: req.params.id, role: "Admin" },
            req.body,
            { new: true }
        );
        if (!updatedAdmin) return res.status(404).json({ error: "Admin not found" });
        res.json(updatedAdmin);
    } catch (err) {
        res.status(500).json({ error: "Failed to update admin" });
    }
};

// Delete an Admin
exports.deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await User.findOneAndDelete({ _id: req.params.id, role: "Admin" });
        if (!deletedAdmin) return res.status(404).json({ error: "Admin not found" });
        res.json({ message: "Admin deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete admin" });
    }
};
