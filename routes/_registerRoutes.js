const express = require("express");
const authRoute = require("./AuthRoutes");
const serviceRoute = require("./ServiceRoutes");

const router = express.Router();

router.use("/api/auth", authRoute);
router.use("/api/services", serviceRoute);

module.exports = router;
