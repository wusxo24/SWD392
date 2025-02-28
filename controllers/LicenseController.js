const License = require("../models/License");

// Create License
exports.createLicense = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { license_name, license_number, authorize_by, expired_date } = req.body;

        // Kiểm tra Doctor có tồn tại không
        let doctorInfo = await DoctorInfo.findOne({ user_id });
        if (!doctorInfo) {
            return res.status(404).json({ message: "Không tìm thấy thông tin bác sĩ" });
        }

        // Tạo License
        const newLicense = new License({ license_name, license_number, authorize_by, expired_date });
        await newLicense.save();

        // Cập nhật license_id vào DoctorInfo
        doctorInfo.license_id = newLicense._id;
        await doctorInfo.save();

        res.status(201).json({ message: "Tạo License thành công", license: newLicense });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


// Get All Licenses
exports.getAllLicenses = async (req, res) => {
    try {
        const licenses = await License.find();
        res.status(200).json(licenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get License By ID
exports.getLicenseById = async (req, res) => {
    try {
        const license = await License.findById(req.params.id);
        if (!license) return res.status(404).json({ message: "License not found" });
        res.status(200).json(license);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update License
exports.updateLicense = async (req, res) => {
    try {
        const { id } = req.params; // ID của License
        const updateData = req.body; // Dữ liệu cần cập nhật

        const license = await License.findById(id);
        if (!license) {
            return res.status(404).json({ message: "Không tìm thấy giấy phép" });
        }

        // Cập nhật thông tin
        Object.assign(license, updateData);
        await license.save();

        res.status(200).json({ message: "Cập nhật giấy phép thành công", license });
    } catch (error) {
        console.error("Lỗi cập nhật giấy phép:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


// Delete License
exports.deleteLicense = async (req, res) => {
    try {
        const deletedLicense = await License.findByIdAndDelete(req.params.id);
        if (!deletedLicense) return res.status(404).json({ message: "License not found" });
        res.status(200).json({ message: "License deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
