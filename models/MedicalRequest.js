const mongoose = require("mongoose");

const MedicalRequestSchema = new mongoose.Schema({
    RecordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record", required: true },
    CreatedDate: { type: Date, default: Date.now },
    Status: { 
        type: String, 
        enum: ["Pending", "Approved", "Rejected", "Completed"], 
        default: "Pending" 
    },
    ManagerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    DoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    AssignedDate: { type: Date },
    Reason: { type: String, required: true },
    Notes: { type: String }
});


module.exports = mongoose.model("MedicalRequest", MedicalRequestSchema);