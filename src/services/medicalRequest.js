import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export const MedicalRequest = async (recordId, requestData, handleModalClose) => {
  let requestCompleted = false; // Flag to track completion

  try {
    console.log(recordId);
    const response = await axios.post(`/api/medical-requests/${recordId}`, requestData);

    if (response.status === 200 || response.status === 201) {
      requestCompleted = true; // Mark as completed
      toast.success("Medical request sent successfully!");
      handleModalClose();
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Medical request error:", error.response?.data || error.message);

    if (!requestCompleted) { // Only show error if not completed successfully
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid request data.");
      } else if (error.response?.status === 404) {
        toast.error("Record not found.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to send medical request.");
      }
    }
  }
};