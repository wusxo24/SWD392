const jwt = require("jsonwebtoken");
const Children = require("../models/Children");

// Middleware to authenticate users
const authMiddleware = (req, res, next) => {
     // Log the incoming request and check for token
     console.log('Incoming request for authentication:', req.method, req.url);

    const token = req.header("Authorization")?.split(" ")[1]; // Ensure "Bearer <token>" format
    console.log('Authorization token:', token ? '[TOKEN PRESENT]' : '[NO TOKEN]');

    if (!token) {
        console.log(`[AUTH] ❌ No token provided`);
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log('Decoded token:', decoded);

        req.user = decoded;
        console.log(`User authenticated: ${req.user.id}, Role: ${req.user.role}`);
        
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(400).json({ message: "Invalid token." });
    }
};

// Middleware to check user roles (Admin, User, etc.)
const authorize = (allowedRoles) => (req, res, next) => {
        if (!req.user) {
            console.log(`[AUTH] ❌ No user object found`);
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        // Log user role and allowed roles for the request
        console.log('Authorizing user with role:', req.user.role);
        console.log('Allowed roles for this route:', allowedRoles.join(', '));

        if (!allowedRoles.includes(req.user.role)) {
            console.log(`[AUTH] ❌ Access denied for role: ${req.user.role}`);
            return res.status(403).json({ message: "Bạn không có quyền truy cập vào tài nguyên này." });
        }
        console.log(`[AUTH] ✅ Access granted for role: ${req.user.role}`);
        next();
    };

// Middleware to check if the user owns the child
const authorizeChildOwner = async (req, res, next) => {
    try {
        const child = await Children.findOne({ _id: req.params.id });
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
