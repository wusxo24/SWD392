const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String }],
    image: { type: String},
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    plan_code: { type: String, required: false },

});

module.exports = mongoose.model("Service", serviceSchema);