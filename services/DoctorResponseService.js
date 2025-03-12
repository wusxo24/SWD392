const DoctorResponse = require("../models/DoctorResponse");
const MedicalRequest = require("../models/MedicalRequest");

const createDoctorResponse = async (MedicalRequestId, responseData) => {
    const { Diagnosis, Recommendations, AdditionalNotes } = responseData;

    const doctorResponse = await DoctorResponse.create({
        MedicalRequestId,
        Diagnosis,
        Recommendations,
        AdditionalNotes,
    });

    return doctorResponse;
};

const updateDoctorResponse = async (id, responseData) => {
    const { Diagnosis, Recommendations, AdditionalNotes } = responseData;

    const updatedDoctorResponse = await DoctorResponse.findOneAndUpdate(
        { _id: id },
        { Diagnosis, Recommendations, AdditionalNotes, LastModifiedDate: Date.now },
        { new: true }
    );

    return updatedDoctorResponse;
};

const sendDoctorResponse = async (id) => {
    const doctorResponse = await DoctorResponse.findById(id);
    if (!doctorResponse) {
        throw new Error("Doctor response not found");
    }

    const medicalRequest = await MedicalRequest.findOneAndUpdate(
        { _id: doctorResponse.MedicalRequestId },
        { Status: "Completed" }
    );
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }

    return { message: "Doctor response sent successfully" };
};

module.exports = { createDoctorResponse, updateDoctorResponse, sendDoctorResponse };