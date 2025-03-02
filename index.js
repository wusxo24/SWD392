const express = require("express");
const dotenv =require("dotenv");
const connectDB = require("./config/db");
const applyMiddleware = require("./middleware");
const routes = require("./routes/_registerRoutes.js");
const cors = require('cors');

dotenv.config();

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Apply middleware
applyMiddleware(app);

// Use routes with /api prefix
app.use('/api', routes);  // All API routes will now be prefixed with /api

// Test route
app.get("/", (req, res) => {
  res.send("Who read this is gay and we accept you");
});

// Connect to database
connectDB();

// For local development

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Export handler for Vercel
module.exports = app;