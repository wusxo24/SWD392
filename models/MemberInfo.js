const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullname: { type: String},
    nickname: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"]},
    birthdate: { type: Date},
    phone: { type: String },
    address: { type: String },
    blood_type: { type: String },
    allergy: { type: String },
    notes: { type: String },
});

const Member = mongoose.model("MemberInfo", MemberSchema);
module.exports = Member;
