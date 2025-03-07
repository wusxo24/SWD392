const MedicalRequest = require("../models/MedicalRequest");
const DoctorResponse = require("../models/DoctorResponse");
const createMedicalRequest = async (req, res) => {
    try{
        const { RecordId } = req.params;
        const { Reason, Notes } = req.body;

        const medicalRequest = await MedicalRequest.create({
            RecordId,
            Reason,
            Notes
        });
        res.status(201).json(medicalRequest);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

const rejectMedicalRequest = async (req, res) => {
    try{
        const { id } = req.params;
        const medicalRequest = await MedicalRequest.findOneAndUpdate({ _id: id }, { Status: "Rejected" });
        if(!medicalRequest){
            return res.status(404).json({ error: "Medical request not found" });
        }
        res.status(200).json({ message: "Medical request rejected successfully" });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

const acceptMedicalRequest = async (req, res) => {
    try{
        const { id } = req.params;
        const ManagerId = req.user.id;
        const DoctorId = req.body.DoctorId;
        const medicalRequest = await MedicalRequest.findOneAndUpdate({ _id: id }, { Status: "Approved"}, {ManagerId: ManagerId}, { DoctorId: DoctorId}, { AssignedDate: Date.now() });
        if(!medicalRequest){
            return res.status(404).json({ error: "Medical request not found" });
        }
        res.status(200).json({ message: "Medical request accepted successfully" });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

const getMedicalRequestByRecordId = async (req, res) => {
    try{
        const { RecordId } = req.params;
        const medicalRequest = await MedicalRequest.findOne({ RecordId });
        if(!medicalRequest){
            return res.status(404).json({ error: "Medical request not found" });
        }
        res.status(200).json(medicalRequest);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

const getMedicalRequestByDoctorId = async (req, res) => {
    try{
        const doctorId = req.user.id;
        const medicalRequest = await MedicalRequest.find({ DoctorId: doctorId });
        //if dont find any medical request then return no medical request found
        if(!medicalRequest){
            return res.status(404).json({ error: "No medical request found" });
        }
        res.status(200).json(medicalRequest);
    }
    catch(error){
        res.status(500).json({ error: error.message });
        }
}

const doctorStartWorkingOnMedicalRequest = async (req, res) => {
    try{
        const { medicalRequestId } = req.params;
        const medicalRequest = await MedicalRequest.findOneAndUpdate({ _id: medicalRequestId }, { Status: "InProgress" });
        if(!medicalRequest){
            return res.status(404).json({ error: "Medical request not found" });
        }
        await DoctorResponse.create({ MedicalRequestId: medicalRequestId });
        res.status(200).json({ message: "Medical request accepted successfully" });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createMedicalRequest, rejectMedicalRequest, acceptMedicalRequest, getMedicalRequestByRecordId, getMedicalRequestByDoctorId, doctorStartWorkingOnMedicalRequest };