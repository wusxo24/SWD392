const mongoose = require("mongoose");

const TrackingSchema = new mongoose.Schema({
    RecordId : { type: mongoose.Schema.Types.ObjectId, ref: "Record" , required: true },
    Height: { type: Number },
    Weight: { type: Number },
    BMI: { type: Number },
    BMIResult: { type: String },
    HeadCircumference: { type: Number },
    WaistCircumference: { type: Number },
    HipCircumference: { type: Number },
    BicepsCircumference: { type: Number },
    TricepsCircumference: { type: Number },
    ChestCircumference: { type: Number },
    ThighCircumference: { type: Number },
    CalfCircumference: { type: Number },
    CreatedDate: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Tracking", TrackingSchema);