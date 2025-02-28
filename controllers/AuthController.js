const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

        // Tạo user mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "Member",
            status: "Active",  // Mặc định tài khoản được kích hoạt
        });



        const savedUser = await newUser.save();

        const newMember = new Member({ user_id: savedUser._id });
        await newMember.save();

        res.status(201).json({ message: "Đăng ký thành công" });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
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
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
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
        res.status(200).json({ message: "Đăng nhập thành công", token });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


module.exports = { registerUser, loginUser };
