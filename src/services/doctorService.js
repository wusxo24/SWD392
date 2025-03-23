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