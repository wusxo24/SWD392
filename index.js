const express = require("express");
require("dotenv").config(); 
const connectDB = require("./config/db");
const applyMiddleware = require("./middleware");
const routes = require("./routes/_registerRoutes.js");
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Apply middleware
applyMiddleware(app);

// Register routes
app.use(routes);

// Test route
app.get("/", (req, res) => {
  res.send("Who read this is gay and we accept you");
});

// Connect to database and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

