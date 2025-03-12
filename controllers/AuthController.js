const AuthService = require("../services/AuthService");

const registerUser = async (req, res) => {
    try {
        const newUser = await AuthService.registerUser(req.body);
        res.status(201).json({ message: "User registered! Please verify your email." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const user = await AuthService.verifyEmail(req.query.token);
        res.status(200).json({ success: true, message: "Email verified successfully! You can now log in." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        await AuthService.forgotPassword(req.body.email);
        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        await AuthService.resetPassword(req.query.token, req.body.newPassword);
        res.status(200).json({ message: "Password reset successful. You can now log in." });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong. Try again." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { token, user } = await AuthService.loginUser(req.body.email, req.body.password);
        res.status(200).json({ message: "Đăng nhập thành công", token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        await AuthService.logoutUser(req);
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword };