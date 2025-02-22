const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const db = process.env.MONGO_URI_DEV; // _TEST, _DEV, _PROD
const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log("Connected to database!");
  } catch (error) {
    console.error("Database connection failed!", error);
    process.exit(1);
  }
};

module.exports = connectDB;
