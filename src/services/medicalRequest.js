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
