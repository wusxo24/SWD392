const express = require("express");
const router = express.Router();
const accountController = require("../controllers/AccountController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
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
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, authorize(["Admin"]), accountController.createAccount);

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, authorize(["Admin"]), accountController.getAllAccounts);

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account data
 *       404:
 *         description: Account not found
 */
router.get("/:id", authMiddleware, accountController.getAccountById);

/**
 * @swagger
 * /accounts/{id}:
 *   put:
 *     summary: Update account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Account ID
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
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Account not found
 */
router.put("/:id", authMiddleware, accountController.updateAccount);

/**
 * @swagger
 * /accounts/{id}:
 *   delete:
 *     summary: Delete account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: Account not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), accountController.deleteAccount);

module.exports = router;