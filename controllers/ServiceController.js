const Service = require("../models/Service");

// Lấy tất cả dịch vụ (Mở cho tất cả người dùng)
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ", error: error.message });
    }
};

// Tạo dịch vụ mới (Chỉ Admin)
const createService = async (req, res) => {
    try {
        const { name, description, features, image, price, duration, plan_code } = req.body;
        const newService = new Service({ name, description, features, image, price, duration, plan_code });
        await newService.save();
        res.status(201).json({ message: "Dịch vụ được tạo thành công", service: newService });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo dịch vụ", error: error.message });
    }
};

// Cập nhật dịch vụ (Chỉ Admin)
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedService) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
        }

        res.status(200).json({ message: "Dịch vụ đã được cập nhật!", service: updatedService });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật dịch vụ", error: error.message });
    }
};

// Xóa dịch vụ (Chỉ Admin)
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
        }

        res.status(200).json({ message: "Dịch vụ đã được xóa!", service: deletedService });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa dịch vụ", error: error.message });
    }
};

module.exports = { getAllServices, createService, updateService, deleteService };
