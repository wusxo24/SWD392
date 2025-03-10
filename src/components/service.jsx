// services.jsx
import axios from "../utils/axiosInstance"; // Adjust based on your project structure

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
// Fetch pricing plans
export const getPricingPlans = async () => {
  try {
    const response = await axios.get("/api/services");
    return response.data;
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    throw error;
  }
};

// Subscribe to a plan
export const subscribeToPlan = async (planId) => {
  try {
    const response = await axios.post(`/api/payments/${planId}`);
    return response.data;
  } catch (error) {
    console.error("Subscription error:", error);
    throw error;
  }
};

export const getChildren = async () => {
  try {
    const response = await axios.get("/api/children/");
    return response.data;
  } catch (error) {
    console.error("Error fetching children:", error);
    throw error;
  }
};

export const addChild = async (childData) => {
  try {
    const response = await axios.post("/api/children/", childData);
    return response.data;
  } catch (error) {
    console.error("Error adding child:", error);
    throw error;
  }
};