import axios from "../utils/axiosInstance"; // Adjust based on your project structure

export const fetchNews = async () => {
  try {
    const res = await axios.get("/api/news");
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Error fetching news.";
  }
};

export const fetchNewsDetail = async (id) => {
  try {
    const res = await axios.get(`/api/news/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching news:", err);
    return null;
  }
};

export const fetchRelatedNews = async () => {
  try {
    const res = await axios.get("/api/news");
    return res.data.slice(0, 2); // Get 2 related articles
  } catch (err) {
    console.error("Error fetching related news:", err);
    return [];
  }
};