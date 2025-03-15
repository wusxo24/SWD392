import React from "react";
import { toast } from "react-toastify";
import axios from "@/utils/axiosInstance";

export const Tracking = async () => {
  try {
    const response = await axios.get(`/api/trackings?recordId=67c3e147401c29858df96623`);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch tracking data.");
  }
};
