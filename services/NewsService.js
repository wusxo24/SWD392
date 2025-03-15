const News = require("../models/News");

const createNews = async (newsData) => {
    const { title, banner, description, content, user_id } = newsData;
    const newNews = new News({
        title,
        banner,
        description,
        content,
        user_id,
        date: new Date(), // Add current date
    });

    await newNews.save();
    return newNews;
};

const getAllNews = async () => {
    return await News.find()
        .populate("user_id", "username")
        .sort({ date: -1 }); // Sort news by date descending
};

const getNewsById = async (newsId) => {
    const news = await News.findById(newsId)
        .populate("user_id", "username email role");

    if (!news) {
        throw new Error("News not found.");
    }

    if (news.user_id.role !== "Manager") {
        throw new Error("News can only be authored by Managers.");
    }

    return {
        title: news.title,
        banner: news.banner,
        description: news.description,
        content: news.content,
        date: news.date,
        author: news.user_id.username, // Display manager's name
    };
};

const updateNews = async (newsId, newsData) => {
    const { title, banner, description, content, user_id } = newsData;

    const updatedNews = await News.findByIdAndUpdate(
        newsId,
        { title, banner, description, content, user_id, date: new Date() }, // Update date as well
        { new: true }
    );

    if (!updatedNews) {
        throw new Error("News not found.");
    }

    return updatedNews;
};

const deleteNews = async (newsId) => {
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
        throw new Error("News not found.");
    }

    return deletedNews;
};

module.exports = { createNews, getAllNews, getNewsById, updateNews, deleteNews };