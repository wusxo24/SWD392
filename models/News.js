const mongoose = require('mongoose');
const { Schema } = mongoose;
const NewsSchema = new Schema({
    title: { type: String, required: true },
    banner: { type: String },
    description: { type: String },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  });
  
  module.exports = mongoose.model("News", NewsSchema);
  