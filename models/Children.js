const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ChildrenSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    memberID: { type: mongoose.Schema.Types.ObjectId, ref: "User",},
    birthdate: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    picture: { type: String },
    blood_type: { type: String, enum: ["A", "B", "AB", "O"] },
    allergy: { type: String },
    notes: { type: String }
}, { timestamps: true });

ChildrenSchema.plugin(AutoIncrement, { inc_field: "childID" });

const Children = mongoose.model("Children", ChildrenSchema);
module.exports = Children;
