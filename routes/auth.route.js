const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerUser);  // Route đăng ký
router.post("/login", loginUser);        // Route đăng nhập

module.exports = router;
