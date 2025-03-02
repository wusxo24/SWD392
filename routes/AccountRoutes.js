const express = require("express");
const router = express.Router();
const accountController = require("../controllers/AccountController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, authorize(["Admin"]), accountController.createAccount);
router.get("/", authMiddleware, authorize(["Admin"]), accountController.getAllAccounts);
router.get("/:id", authMiddleware, accountController.getAccountById);
router.put("/:id", authMiddleware, accountController.updateAccount);
router.delete("/:id", authMiddleware, authorize(["Admin"]), accountController.deleteAccount);

module.exports = router;