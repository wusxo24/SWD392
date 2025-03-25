const MedicalRequestService = require("../services/MedicalRequestService");
const mongoose = require("mongoose");

const createMedicalRequest = async (req, res) => {
    try {
        const { recordId } = req.params;
        const medicalRequest = await MedicalRequestService.createMedicalRequest(recordId, req.body);
        res.status(201).json(medicalRequest);
    } catch (error) {
        // Check for validation errors (e.g., duplicate pending request)
        if (error.message.includes("pending medical request already exists")) {
            return res.status(400).json({ error: error.message });
        }

        // Handle unexpected errors (e.g., database connection issues)
        console.error("Error creating medical request:", error);
        return res.status(500).json({ error: "Internal Server Error. Please try again later." });
    }
};



const rejectMedicalRequest = async (req, res) => {
    try {
        const response = await MedicalRequestService.rejectMedicalRequest(req.params.medicalRequestId);
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

const getApprovedRequestsByDoctorId = async (req, res) => {
    try {
        const doctorId = req.user?.id;
        if (!doctorId) {
            return res.status(400).json({ message: "Doctor ID is required" });
        }

        const requests = await MedicalRequestService.getApprovedRequestsByDoctorId(doctorId);
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching approved requests:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getDoctorResponseUsingMedicalRequestId = async (req, res) => {
    try {
      const { medicalRequestId } = req.params;
  
      // Find medical request
      const medicalRequest = await MedicalRequestService.getMedicalRequestById(medicalRequestId);
      if (!medicalRequest) {
        return res.status(404).json({ message: "Medical request not found" });
      }
  
      // Ensure it's completed before fetching response
      if (medicalRequest.Status !== "Completed") {
        return res.status(400).json({ message: "Medical request is not completed yet" });
      }
  
      // Find doctor response
      const doctorResponse = await MedicalRequestService.getDoctorResponseByMedicalRequestId(medicalRequestId);
      if (!doctorResponse) {
        return res.status(404).json({ message: "No doctor response found" });
      }
  
      res.json(doctorResponse);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

module.exports = {
    createMedicalRequest,
    rejectMedicalRequest,
    acceptMedicalRequest,
    getMedicalRequestByRecordId,
    getMedicalRequestByDoctorId,
    doctorStartWorkingOnMedicalRequest,
    getAllMedicalRequests,
    getApprovedRequestsByDoctorId,
    getDoctorResponseUsingMedicalRequestId
};