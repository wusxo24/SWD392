const Service = require("../models/Service");

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createService = async (req, res) => {
    try {
        const { name, description, features, image, price, duration, plan_code } = req.body;
        const newService = new Service({ name, description, features, image, price, duration, plan_code });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, features,image, price, duration, plan_code } = req.body;
        const updatedService = await Service.findByIdAndUpdate(id, { name, description, features, image, price, duration, plan_code }, { new: true });
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedService = await Service.findByIdAndDelete(id);
        res.status(200).json(deletedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { getAllServices, createService, updateService, deleteService };