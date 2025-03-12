const MedicalRequest = require("../models/MedicalRequest");
const DoctorResponse = require("../models/DoctorResponse");

const createMedicalRequest = async (RecordId, requestData) => {
    const { Reason, Notes } = requestData;

    const medicalRequest = await MedicalRequest.create({
        RecordId,
        Reason,
        Notes
    });

    return medicalRequest;
};

const rejectMedicalRequest = async (id) => {
    const medicalRequest = await MedicalRequest.findOneAndUpdate({ _id: id }, { Status: "Rejected" });
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }

    return { message: "Medical request rejected successfully" };
};

const acceptMedicalRequest = async (id, ManagerId, DoctorId) => {
    const medicalRequest = await MedicalRequest.findOneAndUpdate(
        { _id: id },
        { Status: "Approved", ManagerId, DoctorId, AssignedDate: Date.now() }
    );
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }

    return { message: "Medical request accepted successfully" };
};

const getMedicalRequestByRecordId = async (RecordId) => {
    const medicalRequest = await MedicalRequest.findOne({ RecordId });
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }

    return medicalRequest;
};

const getMedicalRequestByDoctorId = async (doctorId) => {
    const medicalRequest = await MedicalRequest.find({ DoctorId: doctorId });
    if (!medicalRequest) {
        throw new Error("No medical request found");
    }

    return medicalRequest;
};

const doctorStartWorkingOnMedicalRequest = async (medicalRequestId) => {
    const medicalRequest = await MedicalRequest.findOneAndUpdate({ _id: medicalRequestId }, { Status: "InProgress" });
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }

    await DoctorResponse.create({ MedicalRequestId: medicalRequestId });

    return { message: "Medical request accepted successfully" };
};

module.exports = {
    createMedicalRequest,
    rejectMedicalRequest,
    acceptMedicalRequest,
    getMedicalRequestByRecordId,
    getMedicalRequestByDoctorId,
    doctorStartWorkingOnMedicalRequest
};