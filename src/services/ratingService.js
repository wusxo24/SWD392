import axios from "../utils/axiosInstance"

// Fetch ratings by doctor ID
export const getRatingsByDoctorId = async (doctorId) => {
  try {
    const response = await axios.get("/api/ratings");
    if (!response.data) throw new Error("No data received");

    return response.data.filter((fb) => fb.DoctorId?.id === doctorId);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    throw error;
  }
};
