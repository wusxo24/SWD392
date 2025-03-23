const MedicalRequestService = require("../services/MedicalRequestService");
const mongoose = require("mongoose");

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
        const { medicalRequestId } = req.params;
        const ManagerId = req.body.ManagerId;
        const DoctorId = req.body.DoctorId;
        const response = await MedicalRequestService.acceptMedicalRequest(medicalRequestId, ManagerId, DoctorId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMedicalRequestByRecordId = async (req, res) => {
    try {
        console.log("🔹 Route Hit - Received Params:", req.params);

        const { recordId } = req.params; // ✅ Fix: Extract directly

        if (!recordId) {
            return res.status(400).json({ error: "Missing RecordId in request" });
        }

        const medicalRequest = await MedicalRequestService.getMedicalRequestByRecordId(recordId);

        if (!medicalRequest) {
            return res.status(404).json({ error: "Medical request not found" });
        }

        res.status(200).json(medicalRequest);
    } catch (error) {
        console.error("🔴 Service Error:", error.message);
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

const getAllMedicalRequests = async (req, res) => {
    try {
        const medicalRequests = await MedicalRequestService.getAllMedicalRequests();
        res.status(200).json(medicalRequests);
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
    doctorStartWorkingOnMedicalRequest,
    getAllMedicalRequests
};