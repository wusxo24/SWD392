const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Retrieve a list of admins
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 */
router.get("/", authMiddleware, authorize(["Admin"]), adminController.getAdmins);

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Retrieve an admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: An admin object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
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
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: The created admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 */
router.post("/", authMiddleware, authorize(["Admin"]), adminController.createAdmin);

/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Update an admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       200:
 *         description: The updated admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Admin not found
 */
router.put("/:id", authMiddleware, authorize(["Admin"]), adminController.updateAdmin);

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: The deleted admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Admin not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), adminController.deleteAdmin);

module.exports = router;