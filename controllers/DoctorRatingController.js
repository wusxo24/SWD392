const DoctorRating = require("../models/DoctorRating");
const MedicalRequest = require("../models/MedicalRequest");
const rateDoctor = async (req, res) => {
    try {
        const { medicalRequestId } = req.params;
        const { Rating, Feedback, IsAnonymous } = req.body;
        const medicalRequest = await MedicalRequest.findById(medicalRequestId);
        if (!medicalRequest) {
            return res.status(404).json({ message: "Medical request not found" });
        }
        const memberId = req.user.id;
        const newRating = new DoctorRating({ MedicalRequestId, DoctorId: medicalRequest.DoctorId, MemberId: memberId, Rating, Feedback, IsAnonymous });
        await newRating.save();
        res.status(201).json({ message: "Rating created successfully", rating: newRating });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDoctorRatings = async (req, res) => {
    try {
        const ratings = await DoctorRating.find();
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const deletedRating = await DoctorRating.findByIdAndDelete(ratingId);
        if (!deletedRating) {
            return res.status(404).json({ message: "Rating not found" });
        }
        res.status(200).json({ message: "Rating deleted successfully" });
    } catch (error) {        
        res.status(500).json({ message: error.message });
    }
};

module.exports = { rateDoctor, getAllDoctorRatings, deleteRating };
