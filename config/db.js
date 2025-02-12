const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database!");
  } catch (error) {
    console.error("Database connection failed!", error);
    process.exit(1);
  }
};

module.exports = connectDB;
