const News = require("../models/News");

// Create a new news post
exports.createNews = async (req, res) => {
  try {
    const { title, banner, description, content, user_id } = req.body;
    const newNews = new News({
      title,
      banner,
      description,
      content,
      user_id,
      date: new Date(), // Add current date
    });

    await newNews.save();
    res.status(201).json({ message: "News created successfully", news: newNews });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Get all news (sorted by date DESC)
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find()
      .populate("user_id", "username")
      .sort({ date: -1 }); // Sort news by date descending
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
      const news = await News.findById(newsId)
          .populate("user_id", "username email role");

      if (!news) {
          return res.status(404).json({ message: "News not found." });
      }

      if (news.user_id.role !== "Manager") {
          return res.status(400).json({ message: "News can only be authored by Managers." });
      }

      res.status(200).json({
          title: news.title,
          banner: news.banner,
          description: news.description,
          content: news.content,
          date: news.date,
          author: news.user_id.username, // ✅ Display manager's name
      });
  } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Update a news article
exports.updateNews = async (req, res) => {
  const { newsId } = req.params;
  const { title, banner, description, content, user_id } = req.body;

  try {
    const updatedNews = await News.findByIdAndUpdate(
      newsId,
      { title, banner, description, content, user_id, date: new Date() }, // Update date as well
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json({ message: "News updated successfully", news: updatedNews });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// Delete a news article
exports.deleteNews = async (req, res) => {
  const { newsId } = req.params;
  try {
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
