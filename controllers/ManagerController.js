const User = require("../models/User");

// Get all Managers
exports.getManagers = async (req, res) => {
    try {
        const managers = await User.find({ role: "Manager" });
        res.json(managers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch managers" });
    }
};

// Get a single Manager by ID
exports.getManagerById = async (req, res) => {
    try {
        const manager = await User.findOne({ _id: req.params.id, role: "Manager" });
        if (!manager) return res.status(404).json({ error: "Manager not found" });
        res.json(manager);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch manager" });
    }
};

// Create a new Manager
exports.createManager = async (req, res) => {
    try {
        const { username, email, password, status } = req.body;
        const newManager = new User({ username, email, password, role: "Manager", status });
        await newManager.save();
        res.status(201).json(newManager);
    } catch (err) {
        res.status(500).json({ error: "Failed to create manager" });
    }
};

// Update a Manager
exports.updateManager = async (req, res) => {
    try {
        const updatedManager = await User.findOneAndUpdate(
            { _id: req.params.id, role: "Manager" },
            req.body,
            { new: true }
        );
        if (!updatedManager) return res.status(404).json({ error: "Manager not found" });
        res.json(updatedManager);
    } catch (err) {
        res.status(500).json({ error: "Failed to update manager" });
    }
};

// Delete a Manager
exports.deleteManager = async (req, res) => {
    try {
        const deletedManager = await User.findOneAndDelete({ _id: req.params.id, role: "Manager" });
        if (!deletedManager) return res.status(404).json({ error: "Manager not found" });
        res.json({ message: "Manager deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete manager" });
    }
};
