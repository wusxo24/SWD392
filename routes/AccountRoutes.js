const express = require("express");
const router = express.Router();
const accountController = require("../controllers/AccountController");

router.post("/", accountController.createAccount);
router.get("/", accountController.getAllAccounts);
router.get("/:id", accountController.getAccountById);
router.put("/:id", accountController.updateAccount);
router.delete("/:id", accountController.deleteAccount);

module.exports = router;