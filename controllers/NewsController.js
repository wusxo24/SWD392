const NewsService = require("../services/NewsService");

// Create a new news post
exports.createNews = async (req, res) => {
    try {
        const newNews = await NewsService.createNews(req.body);
        res.status(201).json({ message: "News created successfully", news: newNews });
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

// Get all news (sorted by date DESC)
exports.getAllNews = async (req, res) => {
    try {
        const news = await NewsService.getAllNews();
        res.status(200).json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};

// Get a single news article by ID (with Manager's name as author)
exports.getNewsById = async (req, res) => {
    const { newsId } = req.params;
    try {
        const news = await NewsService.getNewsById(newsId);
        res.status(200).json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update a news article
exports.updateNews = async (req, res) => {
    const { newsId } = req.params;
    try {
        const updatedNews = await NewsService.updateNews(newsId, req.body);
        res.status(200).json({ message: "News updated successfully", news: updatedNews });
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a news article
exports.deleteNews = async (req, res) => {
    const { newsId } = req.params;
    try {
        await NewsService.deleteNews(newsId);
        res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: error.message });
    }
};