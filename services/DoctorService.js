const DoctorInfo = require("../models/DoctorInfo");
const User = require("../models/User");
const License = require("../models/License");

const createDoctor = async (doctorData) => {
    const { user_id, picture, gender, date, certificate, experience, clinic_name, ratings, license_id } = doctorData;

    const user = await User.findById(user_id);
    if (!user) {
        throw new Error("User không tồn tại");
    }

    const existingDoctor = await DoctorInfo.findOne({ user_id });
    if (existingDoctor) {
        throw new Error("Thông tin bác sĩ đã tồn tại");
    }

    const newDoctor = new DoctorInfo({
        user_id,
        picture,
        gender,
        date,
        certificate,
        experience,
        clinic_name,
        ratings,
        license_id,
        registered_at: new Date(),
    });

    await newDoctor.save();
    return newDoctor;
};

const getDoctors = async () => {
    return await DoctorInfo.find().populate("user_id", "username email role");
};

const updateDoctor = async (id, updateData) => {
    const doctor = await DoctorInfo.findById(id);
    if (!doctor) {
        throw new Error("Không tìm thấy thông tin bác sĩ");
    }

    if (!doctor.license_id) {
        const newLicense = new License({});
        await newLicense.save();
        doctor.license_id = newLicense._id;
    }

    Object.assign(doctor, updateData);
    await doctor.save();

    return doctor;
};

const deleteDoctor = async (id) => {
    const deletedDoctor = await DoctorInfo.findByIdAndDelete(id);
    if (!deletedDoctor) {
        throw new Error("Không tìm thấy bác sĩ");
    }

    await User.findByIdAndDelete(deletedDoctor.user_id);
    return deletedDoctor;
};

module.exports = { createDoctor, getDoctors, updateDoctor, deleteDoctor };