import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "https://swd-392-api.vercel.app/api",
  timeout: 10000, 
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem("authToken");
      // Handle redirection to login screen if needed
    }
    return Promise.reject(error);
  }
);

export const get = async (url: string) => {
  return axiosInstance.get(url);
};

export const post = async (url: string, data: any) => {
  return axiosInstance.post(url, data);
};

export const put = async (url: string, data: any) => {
  return axiosInstance.put(url, data);
};

export const del = async (url: string) => {
  return axiosInstance.delete(url);
};
