import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchNewsDetail, fetchRelatedNews } from "@/services/newsService";
import { LoadingScreen } from "@/components/loadingScreen";
import { motion } from "framer-motion";

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getNewsDetail = async () => {
      setLoading(true);
      const data = await fetchNewsDetail(id);
      setNews(data);
      setLoading(false);
    };
    getNewsDetail();
  }, [id]);

  useEffect(() => {
    const getRelatedNews = async () => {
      const data = await fetchRelatedNews();
      setRelatedNews(data);
    };
    getRelatedNews();
  }, []);

  if (loading) return <LoadingScreen />;

  if (!news)
    return <p className="text-center text-red-500 mt-10">News not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md mb-6 shadow-md transition-transform duration-200 hover:scale-105"
        onClick={() => navigate("/news")}
      >
        ← Back
      </button>
      
      <motion.h1 
        className="text-5xl font-bold text-gray-900 text-center" 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
      >
        {news.title}
      </motion.h1>
      
      <p className="text-gray-500 text-md mt-3 text-center">
        By {news.author || "Admin"} - {new Date(news.date).toLocaleDateString()}
      </p>
      
      <motion.img
        src={news.banner}
        alt={news.title}
        className="w-full mt-6 rounded-lg shadow-lg max-h-[500px] object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      />
      
      <motion.div
        className="mt-8 text-gray-700 text-lg leading-relaxed px-4 md:px-20"
        dangerouslySetInnerHTML={{ __html: news.content }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <h2 className="text-3xl font-semibold text-gray-800 mt-12 text-center">
        Related News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {relatedNews.map((item) => (
          <motion.div
            key={item._id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/news/${item._id}`)}
            whileHover={{ scale: 1.02 }}
          >
            <img
              src={item.banner}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold text-gray-800 mt-3 text-center">
              {item.title}
            </h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsDetail;