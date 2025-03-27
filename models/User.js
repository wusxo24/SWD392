const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["Member", "Doctor", "Manager", "Admin"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  verificationToken: { type: String },
  verificationTokenCreatedAt: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

UserSchema.virtual("memberInfo", {
  ref: "MemberInfo",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

UserSchema.virtual("doctorInfo", {
  ref: "DoctorInfo",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
