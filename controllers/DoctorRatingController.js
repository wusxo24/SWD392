const DoctorRatingService = require("../services/DoctorRatingService");

const rateDoctor = async (req, res) => {
    try {
        const { medicalRequestId } = req.params;
        const newRating = await DoctorRatingService.rateDoctor(medicalRequestId, req.body, req.user.id);
        res.status(201).json({ message: "Rating created successfully", rating: newRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDoctorRatings = async (req, res) => {
    try {
        const ratings = await DoctorRatingService.getAllDoctorRatings();
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        await DoctorRatingService.deleteRating(ratingId);
        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { rateDoctor, getAllDoctorRatings, deleteRating };