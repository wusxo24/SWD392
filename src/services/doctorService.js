import axios from "@/utils/axiosInstance";

export const fetchDoctors = async () => {
    try {
        
        const response = await axios.get("/api/doctors");
        return response.data;
        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        throw error;
    }
};

export const fetchApprovedAvailableDoctors = async () => {
    try {
        const response = await axios.get("/api/doctors/Approved/Available"); // Updated endpoint
        return response.data;
    } catch (error) {
        console.error("Error fetching available doctors:", error.response?.data || error);
        throw error;
    }
};

export const updateDoctor = async (id, data) => {
    try {
        const response = await axios.put(`/api/doctors/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating doctor:", error);
        throw error;
    }
};

// Delete a doctor by ID
export const deleteDoctor = async (id) => {
    try {
        await axios.delete(`/api/doctors/${id}`);
    } catch (error) {
        console.error("Error deleting doctor:", error);
        throw error;
    }
};

// Create or update a doctor
export const saveDoctor = async (doctorData, editId = null) => {
    try {
        if (editId) {
            console.log("Sending request:", doctorData);
            await axios.put(`/api/doctors/${editId}`, doctorData);
        } else {
            await axios.post("/api/doctors", doctorData);
        }
    } catch (error) {
        console.error("Error saving doctor:", error.response?.data || error);
        throw error;
    }
};

// Update doctor's status
export const updateDoctorStatus = async (id, status) => {
    try {
        console.log(`Updating Doctor ID: ${id}, New Status: ${status}`);
        const response = await axios.patch(`/api/doctors/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Error updating doctor status:", error);
        throw error;
    }
};

export const getDoctorById = async (id) => {
    try {
        const response = await axios.get(`/api/doctors/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        throw error;
    }
};

export const getDoctorRating = async () => {
    try {
        const response = await axios.get(`/api/doctor-ratings/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        throw error;
    }
};

  // Get doctor rating by medical request ID
  export const getDoctorRatingByMedicalRequest = async (medicalRequestId) => {
    try {
      const response = await axios.get(`/api/doctor-ratings/medical-request/${medicalRequestId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor rating:", error);
      return null;
    }
  };

