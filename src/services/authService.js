import axios from "axios"; // Adjust based on your project structure

export const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Something went wrong. Please try again.";
    }
  };  

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('/api/auth/forgot-password', { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Something went wrong. Try again." };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`/api/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'An error occurred during registration.';
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`/api/auth/reset-password`, { newPassword }, { params: { token } });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Something went wrong. Try again.";
  }
};

export const verifyEmail = (token) => {
  return axios
    .get(`/api/auth/verify?token=${token}`)
    .then((response) => response.data.message)
    .catch((error) => {
      throw new Error(error.response?.data?.message || "Verification failed.");
    });
};
