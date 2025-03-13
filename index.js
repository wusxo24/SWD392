const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const applyMiddleware = require("./middleware");
const routes = require("./routes/_registerRoutes.js");
const cors = require('cors');
const swaggerSetup = require("./swagger");

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

applyMiddleware(app);

// Swagger setup
swaggerSetup(app);

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
