import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";
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

  export const fetchChildDetails = async (id) => {
    try {
      const response = await axios.get(`api/children/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Cannot fetch child's details");
      throw new Error("Failed to fetch child details");
    }
  };
  
  export const updateChildDetails = async (id, data) => {
    try {
      const response = await axios.put(`api/children/${id}`, data);
      toast.success("Edit success");
      return response.data;
    } catch (error) {
      toast.error("Edit error");
      throw new Error("Failed to update child details");
    }
  };