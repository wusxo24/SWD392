const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, authorize(["Admin"]), adminController.getAdmins);
router.get("/:id", authMiddleware, authorize(["Admin"]), adminController.getAdminById);
router.post("/", authMiddleware, authorize(["Admin"]), adminController.createAdmin);
router.put("/:id", authMiddleware, authorize(["Admin"]), adminController.updateAdmin);
router.delete("/:id", authMiddleware, authorize(["Admin"]), adminController.deleteAdmin);

module.exports = router;
