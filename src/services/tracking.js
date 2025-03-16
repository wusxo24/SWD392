import React from "react";
import { toast } from "react-toastify";
import axios from "@/utils/axiosInstance";

export const Tracking = async () => {
  try {
    const response = await axios.get(`https://66722715e083e62ee43e2228.mockapi.io/trackings/1`);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch tracking data.");
  }
};
