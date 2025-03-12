const mongoose = require("mongoose");

const TrackingSchema = new mongoose.Schema({
    RecordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record", required: true, index: true },
    MonthYear: { type: String, required: true, index: true }, 
    Trackings: {
        type: Map,
        of: new mongoose.Schema({
            Height: Number,
            Weight: Number,
            BMI: Number,
            BMIResult: String,
            HeadCircumference: Number,
            WaistCircumference: Number,
            HipCircumference: Number,
            BicepsCircumference: Number,
            TricepsCircumference: Number,
            ChestCircumference: Number,
            ThighCircumference: Number,
            CalfCircumference: Number
        }, { _id: false })
    }
});



module.exports = mongoose.model("Tracking", TrackingSchema);