const jwt = require("jsonwebtoken");
const Children = require("../models/Children");

// Middleware to authenticate users
const authMiddleware = (req, res, next) => {
    console.log(`[AUTH] Incoming request: ${req.method} ${req.url}`);

    const token = req.header("Authorization")?.split(" ")[1]; // Ensure "Bearer <token>" format
    if (!token) {
        console.log(`[AUTH] ❌ No token provided`);
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, role: decoded.role };

        console.log(`[AUTH] ✅ User authenticated: ID=${req.user.id}, Role=${req.user.role}`);
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.error("[AUTH] ❌ Token expired");
            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        console.error("[AUTH] ❌ Invalid token");
        res.status(400).json({ message: "Invalid token." });
    }
};

// Middleware to check user roles (Admin, User, etc.)
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.log(`[AUTH] ❌ No user object found`);
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        if (!roles.includes(req.user.role)) {
            console.log(`[AUTH] ❌ Access denied for role: ${req.user.role}`);
            return res.status(403).json({ message: "Bạn không có quyền truy cập vào tài nguyên này." });
        }
        console.log(`[AUTH] ✅ Access granted for role: ${req.user.role}`);
        next();
    };
};

// Middleware to check if the user owns the child
const authorizeChildOwner = async (req, res, next) => {
    try {
        const child = await Children.findOne({ childID: req.params.id });
        if (!child) {
            return res.status(404).json({ message: "Child không tồn tại!" });
        }
        if (child.memberID.toString() !== req.user.id) {
            console.log(`[AUTH] ❌ User ${req.user.id} is not the owner of child ${req.params.id}`);
            return res.status(403).json({ message: "Không có quyền thực hiện thao tác này!" });
        }
        console.log(`[AUTH] ✅ User ${req.user.id} is authorized for child ${req.params.id}`);
        next();
    } catch (error) {
        console.error("[AUTH] ❌ Error checking child ownership:", error.message);
        res.status(500).json({ message: "Lỗi kiểm tra quyền!", error: error.message });
    }
};

module.exports = { authMiddleware, authorize, authorizeChildOwner };
