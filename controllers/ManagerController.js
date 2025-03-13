const ManagerService = require("../services/ManagerService");

// Get all Managers
exports.getManagers = async (req, res) => {
    try {
        const managers = await ManagerService.getManagers();
        res.json(managers);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch managers" });
    }
};

// Get a single Manager by ID
exports.getManagerById = async (req, res) => {
    try {
        const manager = await ManagerService.getManagerById(req.params.id);
        res.json(manager);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch manager" });
    }
};

// Create a new Manager
exports.createManager = async (req, res) => {
    try {
        const newManager = await ManagerService.createManager(req.body);
        res.status(201).json(newManager);
    } catch (err) {
        res.status(500).json({ error: "Failed to create manager" });
    }
};

// Update a Manager
exports.updateManager = async (req, res) => {
    try {
        const updatedManager = await ManagerService.updateManager(req.params.id, req.body);
        res.json(updatedManager);
    } catch (err) {
        res.status(500).json({ error: "Failed to update manager" });
    }
};

// Delete a Manager
exports.deleteManager = async (req, res) => {
    try {
        await ManagerService.deleteManager(req.params.id);
        res.json({ message: "Manager deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete manager" });
    }
};