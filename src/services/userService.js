import axios from "@/utils/axiosInstance";

export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(`api/members/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch member.");
  }
};

export const updateUserProfile = async (userId, formData) => {
  try {
    await axios.put(`api/members/${userId}`, formData);
    return true;
  } catch (error) {
    throw new Error("Failed to update profile.");
  }
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
