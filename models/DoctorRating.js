const mongoose = require("mongoose");

const DoctorRatingSchema = new mongoose.Schema({
    MedicalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRequest", required: true },
    DoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Doctor being rated
    MemberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Member giving feedback
    Rating: { type: Number, min: 1, max: 5, required: true }, // Star rating (1-5)
    Feedback: { type: String }, // Optional feedback
    IsAnonymous: { type: Boolean, default: false }, // If true, hides MemberId
    CreatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DoctorRating", DoctorRatingSchema);