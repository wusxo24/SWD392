const ServiceFeedbackService = require("../services/ServiceFeedbackService");

const rateService = async (req, res) => {
    try {
        const { RecordId } = req.params;
        const memberId = req.user.id;
        const newRating = await ServiceFeedbackService.rateService(RecordId, memberId, req.body);
        res.status(201).json({ message: "Rating created successfully", rating: newRating });
    } catch (error) {
        if (error.message === "Record not found" || error.message === "Order not found" || error.message === "Service not found") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

const getAllRatings = async (req, res) => {
    try {
        const ratings = await ServiceFeedbackService.getAllRatings();
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        await ServiceFeedbackService.deleteRating(ratingId);
        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
        if (error.message === "Rating not found") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = { rateService, getAllRatings, deleteRating };