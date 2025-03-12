// const express = require("express");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const applyMiddleware = require("./middleware");
// const routes = require("./routes/_registerRoutes.js");
// const cors = require('cors');
// const swaggerSetup = require("./swagger");

// dotenv.config();

// const app = express();

// // Enable CORS
// app.use(cors({
//   origin: process.env.FRONT_END_URL,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], 
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// // Apply middleware
// applyMiddleware(app);

// // Swagger setup
// swaggerSetup(app);

// // Use routes with /api prefix
// app.use('/api', routes);  // All API routes will now be prefixed with /api

// // Test route
// app.get("/", (req, res) => {
//   res.send("Who read this is gay and we accept you");
// });

// // Connect to database
// connectDB();

// // For local development
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // Export handler for Vercel
// module.exports = app;

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const applyMiddleware = require("./middleware");
const routes = require("./routes/_registerRoutes.js");
const cors = require('cors');
const ngrok = require('ngrok');
const axios = require('axios');

dotenv.config();
const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.FRONT_END_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

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

const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Start ngrok tunnel in development environment
  if (process.env.NODE_ENV === 'development') {
    try {
      const url = await ngrok.connect(PORT);
      console.log(`Ngrok tunnel started: ${url}`);
      
      // Automatically update the PayOS webhook
      const response = await axios.post('https://api-merchant.payos.vn/confirm-webhook', {
        webhookUrl: `${url}/api/payments/receive-hook`
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.PAYOS_CLIENT_ID,
          'x-api-key': process.env.PAYOS_API_KEY
        }
      });
      console.log('✅ Webhook URL updated successfully!', response.data);
    } catch (error) {
      console.error('❌ Failed to update webhook:', error.response?.data || error.message);
    }
  }
});

// Export handler for Vercel
module.exports = app;
