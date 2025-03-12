const License = require("../models/License");
const DoctorInfo = require("../models/DoctorInfo");

const createLicense = async (user_id, licenseData) => {
    const { license_name, license_number, authorize_by, expired_date } = licenseData;

    // Kiểm tra Doctor có tồn tại không
    let doctorInfo = await DoctorInfo.findOne({ user_id });
    if (!doctorInfo) {
        throw new Error("Không tìm thấy thông tin bác sĩ");
    }

    // Tạo License
    const newLicense = new License({ license_name, license_number, authorize_by, expired_date });
    await newLicense.save();

    // Cập nhật license_id vào DoctorInfo
    doctorInfo.license_id = newLicense._id;
    await doctorInfo.save();

    return newLicense;
};

const getAllLicenses = async () => {
    return await License.find();
};

const getLicenseById = async (id) => {
    const license = await License.findById(id);
    if (!license) {
        throw new Error("License not found");
    }
    return license;
};

const updateLicense = async (id, updateData) => {
    const license = await License.findById(id);
    if (!license) {
        throw new Error("Không tìm thấy giấy phép");
    }

    // Cập nhật thông tin
    Object.assign(license, updateData);
    await license.save();

    return license;
};

const deleteLicense = async (id) => {
    const deletedLicense = await License.findByIdAndDelete(id);
    if (!deletedLicense) {
        throw new Error("License not found");
    }
    return deletedLicense;
};

module.exports = { createLicense, getAllLicenses, getLicenseById, updateLicense, deleteLicense };