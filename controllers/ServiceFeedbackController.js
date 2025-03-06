const ServiceFeedback = require("../models/ServiceRating");
const Order = require("../models/Order");
const Record = require("../models/Record");
const Service = require("../models/Service");
const rateService = async (req, res) => {
    try {
        const { RecordId } = req.params;
        const memberId = req.user.id;
        const record = await Record.findById(RecordId);
        if (!record) {
            return res.status(404).json({ message: "Record not found" });
        }
        const order  = await Order.findById(record.OrderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const service = await Service.findById(order.serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        const { Rating, Feedback } = req.body;
        const newRating = new ServiceFeedback({ RecordId, MemberId: memberId, ServiceId: service._id, Rating, Feedback });    
        await newRating.save();
        res.status(201).json({ message: "Rating created successfully", rating: newRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllRatings = async (req, res) => {
    try {
        const ratings = await ServiceFeedback.find();
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const deletedRating = await ServiceFeedback.findByIdAndDelete(ratingId);
        if (!deletedRating) {
            return res.status(404).json({ message: "Rating not found" });
        }
        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { rateService, getAllRatings, deleteRating };