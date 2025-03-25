const MedicalRequest = require("../models/MedicalRequest");
const DoctorResponse = require("../models/DoctorResponse");
const DoctorInfo = require("../models/DoctorInfo");
const MemberInfo = require("../models/MemberInfo");
const User = require("../models/User");
const mongoose = require("mongoose");


const createMedicalRequest = async (RecordId, requestData) => {
    const { Reason, Notes } = requestData;

    // Check if there is an existing "Pending" request for the record
    const existingRequest = await MedicalRequest.findOne({
        RecordId,
        Status: "Pending"
    });

    if (existingRequest) {
        throw new Error("A pending medical request already exists for this record.");
    }

    // Proceed with creating a new medical request
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
    // Count how many "InProgress" requests the doctor has
    const inProgressCount = await MedicalRequest.countDocuments({
        DoctorId: DoctorId,
        Status: "InProgress"
    });

    if (inProgressCount >= 10) {
        throw new Error("Doctor has reached the limit of 10 in-progress requests");
    }

    // Proceed with assignment if under the limit
    const medicalRequest = await MedicalRequest.findOneAndUpdate(
        { _id: medicalRequestId },
        { Status: "Approved", ManagerId: ManagerId, DoctorId: DoctorId, AssignedDate: Date.now() }
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
    const medicalRequest = await MedicalRequest.find({ DoctorId: doctorId , Status: "Approved" })
        .populate({
            path: "RecordId",
            select: "OrderId ChildId CreatedDate ModifiedDate Status ExpiredDate trackingInfo",
            populate: [
                {
                    path: "ChildId",
                    model: "Children",
                    select: "fname lname birthdate gender picture blood_type allergy notes"
                },
                {
                    path: "OrderId",
                    model: "Order",
                    select: "memberId buyerName",
                    populate: {
                        path: "memberId",
                        model: "User",
                        select: "username email status",
                        populate: {
                            path: "memberInfo",
                            model: "MemberInfo",
                            select: "nickname gender birthdate phone address picture"
                        }
                    }
                },
                {
                    path: "trackingInfo",
                    model: "Tracking",
                    select: "MonthYear Trackings"
                }
            ]
        })
        .lean(); // Converts Mongoose documents to plain JSON objects

    if (!medicalRequest || medicalRequest.length === 0) {
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
    const medicalRequests = await MedicalRequest.find()
        .populate({
            path: "DoctorId",
            model: "User",
            select: "username email" // Adjust fields as needed
        })
        .lean(); // Convert to plain objects for easier manipulation

    // Fetch DoctorInfo using DoctorId (user_id)
    for (let request of medicalRequests) {
        if (request.DoctorId) {
            const doctorInfo = await DoctorInfo.findOne({ user_id: request.DoctorId._id }).lean();
            request.DoctorInfo = doctorInfo; // Attach doctor details
        }
    }

    return medicalRequests;
};


const getApprovedRequestsByDoctorId = async (doctorId) =>{
    console.log(doctorId);
    return await MedicalRequest.find({ DoctorId: new mongoose.Types.ObjectId(doctorId), Status: "Approved" });
  }

  const getMedicalRequestById = async (medicalRequestId) => {
    return await MedicalRequest.findById(medicalRequestId);
  };
  
  const getDoctorResponseByMedicalRequestId = async (medicalRequestId) => {
    return await DoctorResponse.findOne({ MedicalRequestId: medicalRequestId });
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
    getMedicalRequestById,
    getDoctorResponseByMedicalRequestId
};