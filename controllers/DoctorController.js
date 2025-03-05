const mongoose = require("mongoose");
const DoctorInfo = require("../models/DoctorInfo");
const User = require("../models/User");
const License = require("../models/License");
const { v4: uuidv4 } = require("uuid");

// Tạo bác sĩ
const createDoctor = async (req, res) => {
    try {
        const { user_id, picture, gender, date, certificate, experience, clinic_name, ratings, license_id } = req.body;

        // Kiểm tra user_id có tồn tại không
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        // Kiểm tra xem bác sĩ đã có thông tin chưa
        const existingDoctor = await DoctorInfo.findOne({ user_id });
        if (existingDoctor) {
            return res.status(400).json({ message: "Thông tin bác sĩ đã tồn tại" });
        }

        const newDoctor = new DoctorInfo({
            user_id,
            picture,
            gender,
            date,
            certificate,
            experience,
            clinic_name,
            ratings,
            license_id,
            registered_at: new Date(),
        });

        await newDoctor.save();
        res.status(201).json({ message: "Bác sĩ đã được tạo thành công", doctor: newDoctor });

    } catch (error) {
        console.error("Lỗi khi tạo bác sĩ:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy danh sách bác sĩ
const getDoctors = async (req, res) => {
    try {
        const doctors = await DoctorInfo.find().populate("user_id", "username email role");
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật bác sĩ (tên hợp nhất từ `updateDoctor` và `updateDoctorInfo`)
const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const doctor = await DoctorInfo.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: "Không tìm thấy thông tin bác sĩ" });
        }

        // Nếu `license_id` chưa có, tạo mới License
        if (!doctor.license_id) {
            const newLicense = new License({});
            await newLicense.save();
            doctor.license_id = newLicense._id;
        }

        // Cập nhật thông tin bác sĩ
        Object.assign(doctor, updateData);
        await doctor.save();

        res.status(200).json({ message: "Cập nhật thành công", doctor });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};





// Xóa bác sĩ (Xóa cả tài khoản nếu cần)
const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        // Xóa thông tin bác sĩ
        const deletedDoctor = await DoctorInfo.findByIdAndDelete(id);
        if (!deletedDoctor) {
            return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
        }

        // Xóa tài khoản nếu cần
        await User.findByIdAndDelete(deletedDoctor.user_id);

        res.status(200).json({ message: "Xóa bác sĩ thành công" });

    } catch (error) {
        console.error("Lỗi khi xóa bác sĩ:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports = { createDoctor, getDoctors, updateDoctor, deleteDoctor };
