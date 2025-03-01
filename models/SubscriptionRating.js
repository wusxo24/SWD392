const mongoose = require("mongoose");
const ServiceFeedbackSchema = new mongoose.Schema({
    RecordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record", required: true }, // Related to a completed subscription
    MemberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Member providing feedback
    Rating: { type: Number, min: 1, max: 5, required: true }, // Star rating (1-5)
    Feedback: { type: String }, // Optional text feedback
    CreatedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceFeedback", ServiceFeedbackSchema);