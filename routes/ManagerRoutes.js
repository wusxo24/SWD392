const express = require("express");
const router = express.Router();
const managerController = require("../controllers/ManagerController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, authorize(["Admin", "Manager"]), managerController.getManagers);
router.get("/:id", authMiddleware, authorize(["Admin", "Manager"]), managerController.getManagerById);
router.post("/", authMiddleware, authorize(["Admin"]), managerController.createManager);
router.put("/:id", authMiddleware, authorize(["Admin"]), managerController.updateManager);
router.delete("/:id", authMiddleware, authorize(["Admin"]), managerController.deleteManager);

module.exports = router;
