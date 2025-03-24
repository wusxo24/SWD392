const mongoose = require("mongoose");

const DoctorResponseSchema = new mongoose.Schema({
    MedicalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRequest", required: true },
    CreatedDate: { type: Date, default: Date.now },
    Diagnosis: { type: String}, 
    Recommendations: { type: String}, 
    AdditionalNotes: { type: String }
});


module.exports = mongoose.model("DoctorResponse", DoctorResponseSchema);