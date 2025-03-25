const doctorService = require("../services/DoctorService");
const mongoose = require("mongoose");

const createDoctor = async (req, res) => {
    try {
        const doctor = await doctorService.createDoctor(req.body);
        res.status(201).json({ message: "Doctor created successfully", doctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await doctorService.getDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        
        req.body.license_id = new mongoose.Types.ObjectId(req.body.license_id);

        const doctor = await doctorService.updateDoctor(req.params.id, req.body);
        
        if (doctor.error) {
            return res.status(404).json({ message: doctor.error });
        }

        res.status(200).json({ message: "Doctor updated successfully", doctor });
    } catch (error) {
        console.error("Update Doctor Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const response = await doctorService.deleteDoctor(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Soft delete doctor (set status to Inactive)
const softDeleteDoctor = async (req, res) => {
    try {
        const response = await doctorService.softDeleteDoctor(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Restore doctor (set status back to Active)
const restoreDoctor = async (req, res) => {
    try {
        const response = await doctorService.restoreDoctor(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateDoctorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Call the service to update doctor status
        const updatedUser = await doctorService.updateDoctorStatus(id, status);

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};

module.exports = { createDoctor, getDoctors, updateDoctor, deleteDoctor, getDoctorById, softDeleteDoctor, restoreDoctor, updateDoctorStatus };