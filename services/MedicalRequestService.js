const MedicalRequest = require("../models/MedicalRequest");
const DoctorResponse = require("../models/DoctorResponse");
const mongoose = require("mongoose");


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
    const medicalRequest = await MedicalRequest.findOneAndUpdate(
        { _id: id }, 
        { Status: "Rejected" });
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }

    return { message: "Medical request rejected successfully" };
};

const acceptMedicalRequest = async (medicalRequestId, DoctorId, ManagerId) => {
    const medicalRequest = await MedicalRequest.findOneAndUpdate(
        { _id: medicalRequestId },
        { Status: "Approved", ManagerId : ManagerId, DoctorId : DoctorId, AssignedDate: Date.now() }
    );
    if (!medicalRequest) {
        throw new Error("Medical request not found");
    }

    return { message: "Medical request accepted successfully" };
};

const getMedicalRequestByRecordId = async (recordId) => {
    if (!mongoose.Types.ObjectId.isValid(recordId)) {
        throw new Error(`Invalid RecordId format: ${recordId}`);
    }

    return await MedicalRequest.find({ RecordId: new mongoose.Types.ObjectId(recordId) });
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

const getAllMedicalRequests = async () => {
    const medicalRequests = await MedicalRequest.find();
    return medicalRequests;
};

module.exports = {
    createMedicalRequest,
    rejectMedicalRequest,
    acceptMedicalRequest,
    getMedicalRequestByRecordId,
    getMedicalRequestByDoctorId,
    doctorStartWorkingOnMedicalRequest,
    getAllMedicalRequests
};