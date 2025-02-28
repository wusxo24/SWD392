const express = require("express");
const router = express.Router();
const LicenseController = require("../controllers/licenseController");

router.post("/", LicenseController.createLicense);
router.get("/", LicenseController.getAllLicenses);
router.get("/:id", LicenseController.getLicenseById);
router.put("/:id", LicenseController.updateLicense);
router.delete("/:id", LicenseController.deleteLicense);

module.exports = router;
