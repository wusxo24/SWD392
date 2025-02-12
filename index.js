const express = require('express')
const mongoose = require('mongoose');
const connectDB = require("./config/db");
const authRoute = require("./routes/auth.route");
const Product = require('./models/product.model.js');
const productRoute = require("./routes/product.route.js");
const applyMiddleware = require("./middleware");
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("Hello World !");
});

// Apply middleware
applyMiddleware(app);

// routes
app.use("/api/products", productRoute);
app.use("/api/auth", authRoute);

// Connect to database and start server
connectDB()
    .then(() => {
        console.log("Connect to database!");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(() => {
        console.log("Connection failed!");
    });