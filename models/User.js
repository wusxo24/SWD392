const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["Member", "Doctor", "Manager", "Admin"], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Active", "Inactive"], 
        default: "Active" 
    },
    verificationToken: { type: String },
    verificationTokenCreatedAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

module.exports = mongoose.model("User", UserSchema);
