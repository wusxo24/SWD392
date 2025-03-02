const express = require("express");
const authRoute = require("./AuthRoutes");
const serviceRoute = require("./ServiceRoutes");
const doctorRoutes = require("./DoctorRoutes");
const memberRoutes = require("./MemberRoutes");
const childrenRoutes = require("./ChildrenRoutes");
const licenseRoutes = require("./LicenseRoutes");
const accountRoutes = require("./AccountRoutes");
const orderRoutes = require("./OrderRoutes");
const recordRoutes = require("./RecordRoutes");
const trackingRoutes = require("./TrackingRoutes");

const router = express.Router();

router.use("/api/auth", authRoute);
router.use("/api/services", serviceRoute);
router.use("/api/doctors", doctorRoutes);
router.use("/api/members", memberRoutes);
router.use("/api/children", childrenRoutes);
router.use("/api/licenses", licenseRoutes);
router.use("/api/accounts", accountRoutes);
router.use("/api/orders", orderRoutes);
router.use("/api/records", recordRoutes);
router.use("/api/trackings", trackingRoutes);

module.exports = router;
