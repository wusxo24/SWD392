import React from "react";
import { toast } from "react-toastify";
import axios from "@/utils/axiosInstance";

export const Tracking = async (recordId) => {
  try {
    if (!recordId) {
      throw new Error("Missing recordId.");
    }
    const response = await axios.get(`/api/trackings?recordId=${recordId}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch tracking data.");
    console.error("Error fetching tracking data:", error);
  }
};
export const getChildByRecordId = async (recordId) => {
  try {
    if (!recordId) {
      throw new Error("Missing recordId.");
    }
    const response = await axios.get(`/api/trackings/child/${recordId}`);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch tracking data.");
    console.error("Error fetching tracking data:", error);
  }
};




