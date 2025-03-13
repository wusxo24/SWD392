const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, authorize(["Admin"]), adminController.getAdmins);

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin data
 *       404:
 *         description: Admin not found
 */
router.get("/:id", authMiddleware, authorize(["Admin"]), adminController.getAdminById);

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
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
 *         description: Admin created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, authorize(["Admin"]), adminController.createAdmin);

/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Update admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin ID
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
 *         description: Admin updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Admin not found
 */
router.put("/:id", authMiddleware, authorize(["Admin"]), adminController.updateAdmin);

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), adminController.deleteAdmin);

module.exports = router;