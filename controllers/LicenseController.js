const LicenseService = require("../services/LicenseService");

// Create License
exports.createLicense = async (req, res) => {
    try {
        const { user_id } = req.params;
        const newLicense = await LicenseService.createLicense(user_id, req.body);
        res.status(201).json({ message: "Tạo License thành công", license: newLicense });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Get All Licenses
exports.getAllLicenses = async (req, res) => {
    try {
        const licenses = await LicenseService.getAllLicenses();
        res.status(200).json(licenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get License By ID
exports.getLicenseById = async (req, res) => {
    try {
        const license = await LicenseService.getLicenseById(req.params.id);
        res.status(200).json(license);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update License
exports.updateLicense = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLicense = await LicenseService.updateLicense(id, req.body);
        res.status(200).json({ message: "Cập nhật giấy phép thành công", license: updatedLicense });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Delete License
exports.deleteLicense = async (req, res) => {
    try {
        await LicenseService.deleteLicense(req.params.id);
        res.status(200).json({ message: "License deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};