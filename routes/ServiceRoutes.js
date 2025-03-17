const express = require("express");
const { getAllServices, createService, updateService, deleteService } = require("../controllers/ServiceController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getAllServices); // Public route - anyone can view services
router.post("/", authMiddleware, authorize(["Admin"]), createService); // Only Admins can create
router.put("/:id", authMiddleware, updateService); // Only Admins can update
router.delete("/:id", authMiddleware, authorize(["Admin"]), deleteService); // Only Admins can delete

module.exports = router;