import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchNews } from "@/services/newsService";
import { LoadingScreen } from "@/components/loadingScreen";

const News = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNews();
        setNewsList(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  if (loading)
    return (
      <LoadingScreen/>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        {error}
      </div>
    );

  return (
    <div id="news" className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Latest News
      </h1>

      {newsList.length === 0 ? (
        <p className="text-center text-gray-500">No news available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news) => (
            <div
              key={news._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={news.banner || "/default-news.jpg"} // Fallback image
                alt={news.title}
                className="w-full h-52 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-900">
                  {news.title}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(news.date).toLocaleDateString()}
                </p>

                <p className="text-gray-600 mt-2 line-clamp-3">
                  {news.description?.slice(0, 100) + "..." || "No description available."}
                </p>

                <Link
                  to={`/news/${news._id}`}
                  className="mt-4 inline-block text-blue-500 font-semibold hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;