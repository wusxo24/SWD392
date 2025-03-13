const express = require("express");
const router = express.Router();
const newsController = require("../controllers/NewsController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a news post
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               banner:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: News created successfully
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, authorize(["Manager"]), newsController.createNews);

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: List of news
 *       500:
 *         description: Server error
 */
router.get("/", newsController.getAllNews);

/**
 * @swagger
 * /news/{newsId}:
 *   get:
 *     summary: Get a specific news article by ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: newsId
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News article data
 *       404:
 *         description: News not found
 */
router.get("/:newsId", newsController.getNewsById);

/**
 * @swagger
 * /news/{newsId}:
 *   put:
 *     summary: Update a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsId
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               banner:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: News updated successfully
 *       404:
 *         description: News not found
 *       500:
 *         description: Server error
 */
router.put("/:newsId", authMiddleware, authorize(["Manager"]), newsController.updateNews);

/**
 * @swagger
 * /news/{newsId}:
 *   delete:
 *     summary: Delete a news article
 *     tags: [News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsId
 *         schema:
 *           type: string
 *         required: true
 *         description: News ID
 *     responses:
 *       200:
 *         description: News deleted successfully
 *       404:
 *         description: News not found
 *       500:
 *         description: Server error
 */
router.delete("/:newsId", authMiddleware, authorize(["Manager"]), newsController.deleteNews);

module.exports = router;