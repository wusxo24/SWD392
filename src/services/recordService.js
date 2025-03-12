import axios from "../utils/axiosInstance"
// Fetch all records by member ID
export const getRecordsByMemberId = async () => {
    try {
      const response = await axios.get("/api/records/");
      return response.data;
    } catch (error) {
      console.error("Error fetching records:", error);
      throw error;
    }
  };
  
  // Create a new record
  export const createRecord = async (recordData) => {
    try {
      const response = await axios.post("/api/records/", recordData);
      return response.data;
    } catch (error) {
      console.error("Error creating record:", error);
      throw error;
    }
  };
  
  // Activate a record
  export const activateRecord = async (recordId, childId) => {
    try {
      console.log(childId)
      console.log(recordId)
      const response = await axios.put("/api/records/activate", {
        recordId,
        childId, // Include child ID in the request
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error activating record:", error.response?.data || error);
      throw error;
    }
  };
  
  
  // Deactivate a record
  export const deactivateRecord = async (recordId) => {
    try {
      const response = await axios.put("/api/records/deactivate", { recordId });
      return response.data;
    } catch (error) {
      console.error("Error deactivating record:", error);
      throw error;
    }
  };
  
  