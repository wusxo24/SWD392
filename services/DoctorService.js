const DoctorInfo = require("../models/DoctorInfo");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { ObjectId } = require("mongodb");

const createDoctor = async (doctorData) => {
    try {
        const { username, email, password, status, gender, date, experience, certificate, clinic_name, license_id, picture } = doctorData; 

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("User with this email already exists.");
        }

        if (!password) {
            throw new Error("Password is required.");
          }

        // Hash the password properly
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "Doctor",
            status,
        });

        const savedUser = await newUser.save();
        console.log("Saved User:", savedUser);

        // Create doctor profile
        const newDoctor = new DoctorInfo({
            user_id: savedUser._id,
            picture: picture || "",  // Ensure picture is always a string
            gender : gender,
            date : date,
            experience : experience,
            clinic_name : clinic_name,
            certificate : certificate,
            license_id: license_id ? new ObjectId(license_id) : null,
        });

        return await newDoctor.save();
    } catch (error) {
        console.error("Error saving doctor:", error.message);
        throw new Error(error.message || "Failed to create doctor.");
    }
};

const getDoctors = async () => {
    return await DoctorInfo.find()
        .populate("user_id") // Fetch all user details
        .populate("license_id"); // Fetch license details if available
};

const getDoctorById = async (id) => {
    const doctor = await DoctorInfo.findById(id).populate("user_id", "username email");
    if (!doctor) {
        throw new Error("Doctor not found");
    }
    return doctor;
};

const updateDoctor = async (id, updateData) => {
    try {
        const doctor = await DoctorInfo.findByIdAndUpdate(id, updateData, { new: true });
        if (!doctor) {
            return { error: "Doctor not found" };
        }
        return doctor;
    } catch (error) {
        console.error("Database error:", error);
        throw new Error("Error updating doctor");
    }
};

const deleteDoctor = async (id) => {
    const doctor = await DoctorInfo.findById(id);
    if (!doctor) {
        throw new Error("Doctor not found");
    }

    // Delete associated user
    await User.findByIdAndDelete(doctor.user_id);

    // Finally, delete the doctor's info
    await DoctorInfo.findByIdAndDelete(id);

    return { message: "Doctor and related data deleted successfully" };
};

const softDeleteDoctor = async (id) => {
    const doctor = await DoctorInfo.findById(id);
    if (!doctor) {
        throw new Error("Doctor not found");
    }

    await User.findByIdAndUpdate(doctor.user_id, { status: "Inactive" });

    return { message: "Doctor account set to Inactive (Soft Deleted)" };
};

const restoreDoctor = async (id) => {
    const doctor = await DoctorInfo.findById(id);
    if (!doctor) {
        throw new Error("Doctor not found");
    }

    await User.findByIdAndUpdate(doctor.user_id, { status: "Active" });

    return { message: "Doctor account restored (Active again)" };
};

const updateDoctorStatus = async (doctorId, status) => {
    try {
        console.log("Updating doctor ID:", doctorId, "to status:", status); // Debugging log

        // 🔹 Find the doctor by ID
        const doctor = await DoctorInfo.findById(doctorId);
        if (!doctor) {
            throw new Error("Doctor not found");
        }

        // 🔹 Update the user's status (User model)
        const updatedUser = await User.findByIdAndUpdate(
            doctor.user_id, // Get user_id from DoctorInfo
            { status }, 
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser;
    } catch (error) {
        console.error("Error updating doctor status:", error);
        throw error; // Let the controller handle the error response
    }
};


module.exports = { createDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor, softDeleteDoctor, restoreDoctor, updateDoctorStatus };
