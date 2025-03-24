import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export const MedicalRequest = async (recordId, requestData, handleModalClose) => {
  try {
    if (!recordId) {
      throw new Error("Missing recordId.");
    }

    console.log("Sending request for Record ID:", recordId); // Debugging
    console.log("Request Data:", requestData); // Debugging

    const response = await axios.post(`/api/medical-requests/${recordId}`, requestData);

    if (response.status === 200 || response.status === 201) {
      toast.success("Medical request sent successfully!");
      if (handleModalClose) {
        handleModalClose(); // Ensure function exists before calling
      }
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Medical request error:", error.response?.data || error.message);

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        toast.error(data.message || "Invalid request data.");
      } else if (status === 404) {
        toast.error("Record not found.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to send medical request.");
      }
    } else {
      toast.error("Network error or server unreachable.");
    }
  }
};

export const getMedicalRequest = async (recordId) => {
  try {
    if (!recordId) {
      throw new Error("Missing recordId.");
    }

    const response = await axios.get(`/api/medical-requests/${recordId}`);
    if (response.status === 200) {
      return response.data;
      
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Fetch medical request error:", error.response?.data || error.message);

    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        toast.error("Medical request not found.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to fetch medical request.");
      }
    } else {
      toast.error("Network error or server unreachable.");
    }
  }
};

export const getAllMedicalRequests = async () => {
  try {
    const response = await axios.get("/api/medical-requests");  // Call to the backend route that fetches all medical requests
    console.log("Medical requests data:", response.data);  // Debugging
    if (response.status === 200) {
      return response.data;  // Return all medical requests
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Fetch all medical requests error:", error.response?.data || error.message);

    if (error.response) {
      const { status, data } = error.response;
      if (status === 404) {
        toast.error("No medical requests found.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to fetch medical requests.");
      }
    } else {
      toast.error("Network error or server unreachable.");
    }
  }
};
// Accept a medical request
export const acceptMedicalRequest = async (medicalRequestId, managerId, doctorId) => {
  try {
    console.log("doc:", doctorId); // Debugging
    console.log("manager:", managerId); // Debugging

    const response = await axios.put(`/api/medical-requests/accept/${medicalRequestId}`, { 
      ManagerId: managerId,
      DoctorId: doctorId,
       // Add ManagerId to the request payload
    });
   
    if (response.status === 200 || response.status === 201) {
      toast.success("Medical request accepted successfully!");
      return response.data; // Return the response data
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Error accepting medical request:", error.response?.data || error.message);

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        toast.error(data.message || "Invalid request data.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to accept medical request.");
      }
    } else {
      toast.error("Network error or server unreachable.");
    }
  }
};


// Reject a medical request
export const rejectMedicalRequest = async (medicalRequestId) => {
  try {
    const response = await axios.put(`/api/medical-requests/reject/${medicalRequestId}`);
    
    if (response.status === 200 || response.status === 201) {
      toast.success("Medical request rejected successfully!");
      return response.data; // Return the response data
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Error rejecting medical request:", error.response?.data || error.message);

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        toast.error(data.message || "Invalid request data.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to reject medical request.");
      }
    } else {
      toast.error("Network error or server unreachable.");
    }
  }
};

export const getApprovedRequestsByDoctorId = async () => {
  try {

    const response = await axios.get(`/api/medical-requests/doctor/requests`);

    if (response.status === 200) {
      console.log("Approved Requests:", response.data);
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Fetch approved requests error:", error.response?.data || error.message);
    toast.error("Failed to fetch approved requests.");
  }
};
