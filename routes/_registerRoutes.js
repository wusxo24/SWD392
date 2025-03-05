const express = require("express");
const authRoute = require("./AuthRoutes");
const serviceRoute = require("./ServiceRoutes");
const doctorRoutes = require("./DoctorRoutes.js");
const memberRoutes = require("./MemberRoutes");
const childrenRoutes = require("./ChildrenRoutes");
const licenseRoutes = require("./LicenseRoutes");
const accountRoutes = require("./AccountRoutes");
const orderRoutes = require("./OrderRoutes");
const recordRoutes = require("./RecordRoutes");
const trackingRoutes = require("./TrackingRoutes");
const newsRoutes = require("./NewsRoutes");
const adminRoutes = require("./AdminRoute");
const managerRoutes = require("./ManagerRoutes");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/services", serviceRoute);
router.use("/doctors", doctorRoutes);
router.use("/members", memberRoutes);
router.use("/children", childrenRoutes);
router.use("/licenses", licenseRoutes);
router.use("/accounts", accountRoutes);
router.use("/orders", orderRoutes);
router.use("/records", recordRoutes);
router.use("/trackings", trackingRoutes);
router.use("/news", newsRoutes);
router.use("/admins", adminRoutes);
router.use("/managers", managerRoutes);

module.exports = router;
