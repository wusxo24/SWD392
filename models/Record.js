const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    OrderId : { type: mongoose.Schema.Types.ObjectId, ref: "Order" , required: true },
    ChildId : { type: mongoose.Schema.Types.ObjectId, ref: "Children" },
    CreatedDate: { type: Date, default: Date.now },
    ModifiedDate: { type: Date, default: Date.now },
    Status: { type: String, enum: ["Activated", "Inactivated", "Expired"], default: "Inactivated" },
    ExpiredDate: { type: Date },
});

module.exports = mongoose.model("Record", RecordSchema);