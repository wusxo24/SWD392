const DoctorService = require("../services/DoctorService");

const createDoctor = async (req, res) => {
    try {
        const newDoctor = await DoctorService.createDoctor(req.body);
        res.status(201).json({ message: "Bác sĩ đã được tạo thành công", doctor: newDoctor });
    } catch (error) {
        console.error("Lỗi khi tạo bác sĩ:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await DoctorService.getDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await DoctorService.updateDoctor(id, req.body);
        res.status(200).json({ message: "Cập nhật thành công", doctor: updatedDoctor });
    } catch (error) {
        console.error("Lỗi:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await DoctorService.deleteDoctor(id);
        res.status(200).json({ message: "Xóa bác sĩ thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa bác sĩ:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports = { createDoctor, getDoctors, updateDoctor, deleteDoctor };