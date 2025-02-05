const express = require('express')
const mongoose = require('mongoose');
const Product = require('./models/product.model.js');
const productRoute = require("./routes/product.route.js");
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send("Hello World !");
});

// routes
app.use("/api/products", productRoute);


mongoose.connect("mongodb+srv://leminh:leminh04012004@backenddb.ocbpn.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackEndDB")
    .then(() => {
        console.log("Connect to database!");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(() => {
        console.log("Connection failed!");
    });