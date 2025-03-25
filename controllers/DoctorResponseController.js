const DoctorResponseService = require("../services/DoctorResponseService");

const createDoctorResponse = async (req, res) => {
    try {
        const { MedicalRequestId, Diagnosis, Recommendations, AdditionalNotes } = req.body;

        const doctorResponse = await DoctorResponseService.createDoctorResponse(MedicalRequestId, {
            Diagnosis,
            Recommendations,
            AdditionalNotes,
        });

        res.status(201).json(doctorResponse);
    } catch (error) {
        console.error("Error creating doctor response:", error);
        res.status(500).json({ error: error.message });
    }
};

const updateDoctorResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDoctorResponse = await DoctorResponseService.updateDoctorResponse(id, req.body);
        res.status(200).json(updatedDoctorResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendDoctorResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await DoctorResponseService.sendDoctorResponse(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createDoctorResponse, updateDoctorResponse, sendDoctorResponse };