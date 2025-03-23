import axios from "../utils/axiosInstance"; // Adjust based on your project structure

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
  
  export const updateSubscriptionPlan = async (planId, updatedData) => {
    try {
      const response = await axios.put(`/api/services/${planId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  };

  export const createSubscriptionPlan = async (planData) => {
    try {
      const response = await axios.post("/api/services", planData);
      return response.data;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  };
  
  export const deleteSubscriptionPlan = async (planId) => {
    try {
      const response = await axios.delete(`/api/services/${planId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting subscription:", error);
      throw error;
    }
  };

  