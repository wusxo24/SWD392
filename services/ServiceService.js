const Service = require("../models/Service");

const getAllServices = async () => {
    return await Service.find();
};

const createService = async (serviceData) => {
    const { name, description, features, image, price, duration, plan_code } = serviceData;
    const newService = new Service({ name, description, features, image, price, duration, plan_code });
    await newService.save();
    return newService;
};

const updateService = async (id, serviceData) => {
    const updatedService = await Service.findByIdAndUpdate(id, serviceData, { new: true });
    if (!updatedService) {
        throw new Error("Dịch vụ không tồn tại!");
    }
    return updatedService;
};

const deleteService = async (id) => {
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) {
        throw new Error("Dịch vụ không tồn tại!");
    }
    return deletedService;
};

module.exports = { getAllServices, createService, updateService, deleteService };