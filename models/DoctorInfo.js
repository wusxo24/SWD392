const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔹 Đảm bảo tham chiếu đúng
    picture: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: undefined },
    date: { type: Date, default: null },
    certificate: { type: String, default: "" },
    experience: { type: String, default: "" },
    clinic_name: { type: String, default: "" },
    ratings: { type: [Number], default: [] },
    license_id: { type: mongoose.Schema.Types.ObjectId, ref: "License" }, 
    registered_at: { type: Date, default: Date.now },  // ✅ Đảm bảo có dấu phẩy ở dòng trên
});

module.exports = mongoose.model("DoctorInfo", DoctorSchema);
