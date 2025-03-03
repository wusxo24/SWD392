const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", registerUser);  // Route đăng ký
router.post("/login", loginUser);        // Route đăng nhập
router.post('/logout', logoutUser); // Route Logout

module.exports = router;
