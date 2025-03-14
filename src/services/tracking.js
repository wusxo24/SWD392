import React from "react";
import { toast } from "react-toastify";
import axios from "@/utils/axiosInstance";

export const Tracking = async () => {
  try {
    const response = await axios.get("/api/trackings/");
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch tracking data.");
  }
};
