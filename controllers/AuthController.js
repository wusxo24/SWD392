const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Member = require("../models/MemberInfo");

/**
 * Đăng ký tài khoản mới
 */
const registerUser = async (req, res) => {
    try {
        const { username, email, password} = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo mã xác thực email
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const verificationTokenCreatedAt = new Date();

        // Tạo user mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "Member",
            status: "Inactive",  // Mặc định tài khoản chưa được kích hoạt
            verificationToken,
            verificationTokenCreatedAt : verificationTokenCreatedAt
        });

        const savedUser = await newUser.save();

        const newMember = new Member({ user_id: savedUser._id });
        await newMember.save();

            // Gửi email xác thực
            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
              },
            });
    // Send verification email
    try {
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
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({ message: "Error sending verification email. Please try again." });
    }

    res.status(201).json({ message: "User registered! Please verify your email." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration. Please try again later." });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, message: "No token provided" });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user || user.verified) {
      return res.status(400).json({ success: false, message: "Email already verified or invalid token." });
    }

    // Token expiration handling (Optional)
    const TOKEN_EXPIRY_TIME = 3600000; // 1 hour in milliseconds
    const tokenCreationTime = new Date(user.verificationTokenCreatedAt).getTime();
    const currentTime = new Date().getTime();
    if (currentTime - tokenCreationTime > TOKEN_EXPIRY_TIME) {
      return res.status(400).json({ success: false, message: "Verification token has expired." });
    }

    user.status = "Active";
    user.verificationToken = null;
    console.log("User before update:", user);
    await user.save();

    res.status(200).json({ success: true, message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed. Try again." });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(404).json({ message: "Email has not been registered." });

      // Restrict password reset to only Member
      if (user.role !== "Member") {
        return res.status(403).json({ message: "Only Member are allowed to reset their password. Please contact admin for assistance." });
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
  
      res.status(200).json({ message: "Password reset link sent to your email." });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Reset Password
const resetPassword = async (req, res) => {
  try {
      const { token } = req.query;
      const { newPassword } = req.body;
  
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) return res.status(400).json({ message: "Invalid or expired token." });
  
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
  
      res.status(200).json({ message: "Password reset successful. You can now log in." });
  
    } catch (error) {
      res.status(500).json({ error: "Something went wrong. Try again." });
    }
  };

/**
 * Đăng nhập
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        if (user.status !== "Active") {
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa hoặc chưa xác thực email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        )
        res.status(200).json({ message: "Đăng nhập thành công", token , user: { id: user._id, email: user.email, role: user.role, userName: user.username } });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    if (req.session) {
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    res.status(500).json({ message: "An error occurred during logout" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword };
