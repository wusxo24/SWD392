const express = require("express");
const { getAllServices, createService, updateService, deleteService } = require("../controllers/ServiceController");

const router = express.Router();

router.get("/", getAllServices); // Route hàm getAllServices
router.post("/", createService);  // Route hàm createService
router.put("/:id", updateService); // Route hàm updateService
router.delete("/:id", deleteService); // Route hàm deleteService

module.exports = router;