const mongoose = require("mongoose");

const DoctorResponseSchema = new mongoose.Schema({
    MedicalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "MedicalRequest", required: true },
    CreatedDate: { type: Date, default: Date.now },
    LastModifiedDate: { type: Date, default: Date.now },
    Diagnosis: { type: String, required: true }, 
    Recommendations: { type: String, required: true }, 
    AdditionalNotes: { type: String }
});


module.exports = mongoose.model("DoctorResponse", DoctorResponseSchema);