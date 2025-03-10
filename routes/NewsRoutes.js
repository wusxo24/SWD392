const express = require("express");
const router = express.Router();
const newsController = require("../controllers/NewsController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

// Create a news post
router.post("/", authMiddleware, authorize(["Manager"]), newsController.createNews);

// Get all news
router.get("/",newsController.getAllNews);

// Get a specific news article by ID
router.get("/:newsId", newsController.getNewsById);

// Update a news article
router.put("/:newsId", authMiddleware, authorize(["Manager"]), newsController.updateNews);

// Delete a news article
router.delete("/:newsId", authMiddleware, authorize(["Manager"]), newsController.deleteNews);

module.exports = router;
