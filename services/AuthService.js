const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Member = require("../models/MemberInfo");

class AuthService {
    async registerUser(userData) {
        const { username, email, password } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email đã tồn tại");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenCreatedAt = new Date();

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "Member",
            status: "Inactive",
            verificationToken,
            verificationTokenCreatedAt
        });

        const savedUser = await newUser.save();
        const newMember = new Member({ user_id: savedUser._id });
        await newMember.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const verificationUrl = `${process.env.FRONT_END_URL}/verify?token=${verificationToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: newUser.email,
            subject: "Verify Your Email",
            html: `
                <h2>Welcome, ${newUser.username}!</h2>
                <p>Click the button below to verify your email:</p>
                <a href="${verificationUrl}" style="display:inline-block; padding:10px 20px; color:white; background-color:#0DBFFF; text-decoration:none; border-radius:5px;">
                    Verify Email
                </a>
                <p>If you did not sign up, ignore this email.</p>
            `,
        });

        return savedUser;
    }

    async verifyEmail(token) {
        if (!token) {
            throw new Error("No token provided");
        }

        const user = await User.findOne({ verificationToken: token });
        if (!user || user.verified) {
            throw new Error("Email already verified or invalid token.");
        }

        const TOKEN_EXPIRY_TIME = 3600000; // 1 hour in milliseconds
        const tokenCreationTime = new Date(user.verificationTokenCreatedAt).getTime();
        const currentTime = new Date().getTime();
        if (currentTime - tokenCreationTime > TOKEN_EXPIRY_TIME) {
            throw new Error("Verification token has expired.");
        }

        user.status = "Active";
        user.verificationToken = null;
        await user.save();

        return user;
    }

    async forgotPassword(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Email has not been registered.");
        }

        if (user.role !== "Member") {
            throw new Error("Only Member are allowed to reset their password. Please contact admin for assistance.");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetUrl = `${process.env.FRONT_END_URL}/reset-password?token=${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASSWORD },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset</h2>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" style="display:inline-block; padding:10px 20px; color:white; background-color:#0DBFFF; text-decoration:none; border-radius:5px;">
                    Reset Password
                </a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        });

        return user;
    }

    async resetPassword(token, newPassword) {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error("Invalid or expired token.");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return user;
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Email hoặc mật khẩu không đúng");
        }

        if (user.status !== "Active") {
            throw new Error("Tài khoản của bạn đã bị khóa hoặc chưa xác thực email");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Email hoặc mật khẩu không đúng");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        return { token, user: { id: user._id, email: user.email, role: user.role, userName: user.username } };
    }

    async logoutUser(req) {
         // If using sessions
    if (req.session) {
        req.session.destroy();
    }

    // If using JWT, no need to "destroy" anything, just remove token from frontend
    return { message: "Logged out successfully" };
    }
}

module.exports = new AuthService();