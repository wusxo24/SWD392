import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchNewsDetail, fetchRelatedNews } from "@/services/newsService";

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

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (!news)
    return <p className="text-center text-red-500 mt-10">News not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded mb-4"
        onClick={() => navigate("/home")}
      >
        ← Back
      </button>
      <h1 className="text-4xl font-bold text-gray-900">{news.title}</h1>
      <p className="text-gray-500 text-sm mt-2">
        By {news.author || "Admin"} - {new Date(news.date).toLocaleDateString()}
      </p>

      <img
        src={news.banner}
        alt={news.title}
        className="w-full mt-6 rounded-lg shadow-lg"
      />

      <div
        className="mt-6 text-gray-700 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      <h2 className="text-2xl font-semibold text-gray-800 mt-12">
        Related News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {relatedNews.map((item) => (
          <div
            key={item._id}
            className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => (window.location.href = `/news/${item._id}`)}
          >
            <img
              src={item.banner}
              alt={item.title}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold text-gray-800 mt-3">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsDetail;
