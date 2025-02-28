const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const LicenseSchema = new mongoose.Schema({
  license_id: { type: String, default: uuidv4, unique: true },  // Đảm bảo không bị null
  license_name: { type: String },
  license_number: { type: String },
  authorize_by: { type: String },
  expired_date: { type: Date }
});

module.exports = mongoose.model("License", LicenseSchema);
