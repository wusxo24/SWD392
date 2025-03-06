const DoctorResponse = require("../models/DoctorResponse");
const MedicalRequest = require("../models/MedicalRequest");
const createDoctorResponse = async (req, res) => {
    try {
        const { MedicalRequestId } = req.params;
        const { Diagnosis, Recommendations, AdditionalNotes } = req.body;

        const doctorResponse = await DoctorResponse.create({
            MedicalRequestId,
            Diagnosis,
            Recommendations,
            AdditionalNotes,
        });
        res.status(201).json(doctorResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateDoctorResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { Diagnosis, Recommendations, AdditionalNotes } = req.body;

        const updatedDoctorResponse = await DoctorResponse.findOneAndUpdate(
            { _id: id },
            { Diagnosis, Recommendations, AdditionalNotes, LastModifiedDate: Date.now },
            { new: true }
        );    
        res.status(200).json(updatedDoctorResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendDoctorResponse = async (req, res) => {
    try{
        const {id} = req.params;
        const doctorResponse = await DoctorResponse.find({_id: id});
        if(!doctorResponse){
            return res.status(404).json({error: "Doctor response not found"});
        }
        const medicalRequest = await MedicalRequest.findOneAndUpdate({_id: doctorResponse.MedicalRequestId}, {Status: "Completed"});
        if(!medicalRequest){
            return res.status(404).json({error: "Medical request not found"});
        }
        res.status(200).json({message: "Doctor response sent successfully"});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}
module.exports = { createDoctorResponse, updateDoctorResponse, sendDoctorResponse };