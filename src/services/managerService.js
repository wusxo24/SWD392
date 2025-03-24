import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export const getAllManagers = async () => {
  try {
    const response = await axios.get("/api/managers");
    console.log("Managers data:", response.data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Fetch managers error:", error.response?.data || error.message);
    toast.error("Failed to fetch managers.");
  }
};

export const getManagerById = async (managerId) => {
  try {
    if (!managerId) throw new Error("Missing managerId.");
    
    const response = await axios.get(`/api/managers/${managerId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Fetch manager error:", error.response?.data || error.message);
    toast.error("Failed to fetch manager details.");
  }
};

export const updateManager = async (managerId, managerData) => {
  try {
    if (!managerId) throw new Error("Missing managerId.");
    
    const response = await axios.put(`/api/managers/${managerId}`, managerData);
    if (response.status === 200 || response.status === 201) {
      toast.success("Manager updated successfully!");
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Update manager error:", error.response?.data || error.message);
    toast.error("Failed to update manager.");
  }
};

export const deleteManager = async (managerId) => {
  try {
    if (!managerId) throw new Error("Missing managerId.");
    
    const response = await axios.delete(`/api/managers/${managerId}`);
    if (response.status === 200 || response.status === 204) {
      toast.success("Manager deleted successfully!");
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Delete manager error:", error.response?.data || error.message);
    toast.error("Failed to delete manager.");
  }
};

export const updateManagerStatus = async (managerId, status) => {
  try {
    if (!managerId) throw new Error("Missing managerId.");
    if (!status) throw new Error("Missing status.");

    const response = await axios.patch(`/api/managers/${managerId}/status`, { status });
    
    if (response.status === 200) {
      toast.success("Manager status updated successfully!");
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Update manager status error:", error.response?.data || error.message);
    toast.error("Failed to update manager status.");
  }
};

export const saveManager = async (managerData, editId = null) => {
  try {
    if (editId) {
      console.log("Sending update request:", managerData);
      await axios.put(`/api/managers/${editId}`, managerData);
    }
  } catch (error) {
    console.error("Error saving manager:", error.response?.data || error);
    throw error;
  }
};

export const createManager = async (managerData) => {
    try {
      const response = await axios.post("/api/managers", { ...managerData, role: "Manager" });
      if (response.status === 201) {
        toast.success("Manager created successfully!");
        return response.data;
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Create manager error:", error.response?.data || error.message);
      toast.error("Failed to create manager.");
    }
  };