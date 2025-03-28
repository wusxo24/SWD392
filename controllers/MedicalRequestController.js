const MedicalRequestService = require("../services/MedicalRequestService");

const createMedicalRequest = async (req, res) => {
    try {
        const { recordId } = req.params;
        const medicalRequest = await MedicalRequestService.createMedicalRequest(recordId, req.body);
        res.status(201).json(medicalRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const rejectMedicalRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await MedicalRequestService.rejectMedicalRequest(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const acceptMedicalRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const ManagerId = req.user.id;
        const DoctorId = req.body.DoctorId;
        const response = await MedicalRequestService.acceptMedicalRequest(id, ManagerId, DoctorId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMedicalRequestByRecordId = async (req, res) => {
    try {
        const { RecordId } = req.params;
        const medicalRequest = await MedicalRequestService.getMedicalRequestByRecordId(RecordId);
        res.status(200).json(medicalRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMedicalRequestByDoctorId = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const medicalRequest = await MedicalRequestService.getMedicalRequestByDoctorId(doctorId);
        res.status(200).json(medicalRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const doctorStartWorkingOnMedicalRequest = async (req, res) => {
    try {
        const { medicalRequestId } = req.params;
        const response = await MedicalRequestService.doctorStartWorkingOnMedicalRequest(medicalRequestId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createMedicalRequest,
    rejectMedicalRequest,
    acceptMedicalRequest,
    getMedicalRequestByRecordId,
    getMedicalRequestByDoctorId,
    doctorStartWorkingOnMedicalRequest
};