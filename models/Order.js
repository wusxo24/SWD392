const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    memberId : {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service"},
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "Paid", "Canceled"], default: "Pending" },
    orderCode: { type: String, unique: true },
    amount: { type: Number },
    description: { type: String },
    buyerName: { type: String },
    buyerEmail: { type: String },
    buyerPhone: { type: String },
    buyerAddress: { type: String },
    items: [ { type: mongoose.Schema.Types.ObjectId, ref: "Service" } ],
    currency: { type: String },
    paymentMethod: { type: String },
    paymentStatus: { type: String }, //desc
    transactionDateTime: { type: Date },

})

module.exports = mongoose.model("Order", orderSchema);