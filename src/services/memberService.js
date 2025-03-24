import axios from "@/utils/axiosInstance";
import { toast } from "react-toastify";

export const getAllMembers = async () => {
  try {
    const response = await axios.get("/api/members");
    console.log("Members data:", response.data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Fetch members error:", error.response?.data || error.message);
    toast.error("Failed to fetch members.");
  }
};

export const getMemberById = async (memberId) => {
  try {
    if (!memberId) throw new Error("Missing memberId.");
    
    const response = await axios.get(`/api/members/${memberId}`);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Fetch member error:", error.response?.data || error.message);
    toast.error("Failed to fetch member details.");
  }
};

export const updateMember = async (memberId, memberData) => {
  try {
    if (!memberId) throw new Error("Missing memberId.");
    
    const response = await axios.put(`/api/members/${memberId}`, memberData);
    if (response.status === 200 || response.status === 201) {
      toast.success("Member updated successfully!");
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Update member error:", error.response?.data || error.message);
    toast.error("Failed to update member.");
  }
};

export const deleteMember = async (memberId) => {
  try {
    if (!memberId) throw new Error("Missing memberId.");
    
    const response = await axios.delete(`/api/members/${memberId}`);
    if (response.status === 200 || response.status === 204) {
      toast.success("Member deleted successfully!");
      return response.data;
    } else {
      throw new Error("Unexpected response from server.");
    }
  } catch (error) {
    console.error("Delete member error:", error.response?.data || error.message);
    toast.error("Failed to delete member.");
  }
};

export const updateMemberStatus = async (memberId, status) => {
    try {
      if (!memberId) throw new Error("Missing memberId.");
      if (!status) throw new Error("Missing status.");
  
      const response = await axios.patch(`/api/members/${memberId}/status`, { status });
  
      if (response.status === 200) {
        toast.success("Member status updated successfully!");
        return response.data;
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Update member status error:", error.response?.data || error.message);
      toast.error("Failed to update member status.");
    }
  };

  export const saveMember = async (memberData, editId = null) => {
    try {
        if (editId) {
            const response = await axios.put(`/api/members/${editId}`, memberData);
            console.log("Member updated successfully:", response.data);
            return response.data; // Returning the response for further handling
        }
    } catch (error) {
        console.error("Error saving member:", error.response?.data || error.message || error);
        throw error; // Rethrowing the error to propagate it to the caller
    }
};