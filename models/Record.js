const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    OrderId : { type: mongoose.Schema.Types.ObjectId, ref: "Order" , required: true },
    ChildId : { type: mongoose.Schema.Types.ObjectId, ref: "Children" },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now },
    Status: { type: String, enum: ["Activated", "Inactivated", "Expired"], default: "Inactivated" },
    ExpiredDate: { type: Date },
});

// Virtual field for tracking records related to this Record
RecordSchema.virtual("trackingInfo", {
    ref: "Tracking",
    localField: "_id",
    foreignField: "RecordId", // This should match the field in TrackingSchema
    justOne: false // false because a Record can have multiple Tracking entries
});

RecordSchema.set("toJSON", { virtuals: true });
RecordSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Record", RecordSchema);