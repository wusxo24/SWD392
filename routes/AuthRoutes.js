const express = require("express");
const { registerUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword } = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", registerUser);  // Route đăng ký
router.post("/login", loginUser);        // Route đăng nhập
router.post('/logout', logoutUser); // Route Logout
router.get('/verify', verifyEmail);   // route xac thuc
router.post('/forgot-password', forgotPassword); // route quen mat khau
router.post('/reset-password', resetPassword); // route reset mat khau

module.exports = router;
