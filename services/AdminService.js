const AdminService = require("../services/AdminService");

// Get all Admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await AdminService.getAdmins();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch admins" });
    }
};

// Get a single Admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await AdminService.getAdminById(req.params.id);
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch admin" });
    }
};

// Create a new Admin
exports.createAdmin = async (req, res) => {
    try {
        const newAdmin = await AdminService.createAdmin(req.body);
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(500).json({ error: "Failed to create admin" });
    }
};

// Update an Admin
exports.updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await AdminService.updateAdmin(req.params.id, req.body);
        res.json(updatedAdmin);
    } catch (err) {
        res.status(500).json({ error: "Failed to update admin" });
    }
};

// Delete an Admin
exports.deleteAdmin = async (req, res) => {
    try {
        await AdminService.deleteAdmin(req.params.id);
        res.json({ message: "Admin deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete admin" });
    }
};