const DoctorRating = require("../models/DoctorRating");
const MedicalRequest = require("../models/MedicalRequest");

const rateDoctor = async (medicalRequestId, ratingData, userId) => {
    const { Rating, Feedback, IsAnonymous } = ratingData;
    const medicalRequest = await MedicalRequest.findById(medicalRequestId);
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }
    const newRating = new DoctorRating({
        MedicalRequestId: medicalRequestId,
        DoctorId: medicalRequest.DoctorId,
        MemberId: userId,
        Rating,
        Feedback,
        IsAnonymous
    });
    await newRating.save();
    return newRating;
};

const getAllDoctorRatings = async () => {
    return await DoctorRating.find();
};

const deleteRating = async (ratingId) => {
    const deletedRating = await DoctorRating.findByIdAndDelete(ratingId);
    if (!deletedRating) {
        throw new Error("Rating not found");
    }
    return deletedRating;
};

module.exports = { rateDoctor, getAllDoctorRatings, deleteRating };