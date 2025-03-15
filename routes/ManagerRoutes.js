const express = require("express");
const router = express.Router();
const managerController = require("../controllers/ManagerController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /managers:
 *   get:
 *     summary: Get all managers
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of managers
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, authorize(["Admin", "Manager"]), managerController.getManagers);

/**
 * @swagger
 * /managers/{id}:
 *   get:
 *     summary: Get manager by ID
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Manager ID
 *     responses:
 *       200:
 *         description: Manager data
 *       404:
 *         description: Manager not found
 */
router.get("/:id", authMiddleware, authorize(["Admin", "Manager"]), managerController.getManagerById);

/**
 * @swagger
 * /managers:
 *   post:
 *     summary: Create a new manager
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Manager created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, authorize(["Admin"]), managerController.createManager);

/**
 * @swagger
 * /managers/{id}:
 *   put:
 *     summary: Update manager
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Manager ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Manager updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Manager not found
 */
router.put("/:id", authMiddleware, authorize(["Admin"]), managerController.updateManager);

/**
 * @swagger
 * /managers/{id}:
 *   delete:
 *     summary: Delete manager
 *     tags: [Managers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Manager ID
 *     responses:
 *       200:
 *         description: Manager deleted successfully
 *       404:
 *         description: Manager not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), managerController.deleteManager);

module.exports = router;