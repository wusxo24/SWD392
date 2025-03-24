const express = require("express");
const router = express.Router();
const childrenController = require("../controllers/ChildrenController");
const { authorizeChildOwner, authMiddleware } = require("../middleware/authMiddleware");
 
router.get("/children", authMiddleware, childrenController.getAllChildren);
/**
 * @swagger
 * /children:
 *   post:
 *     summary: Create a new child
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthdate:
 *                 type: string
 *               gender:
 *                 type: string
 *               memberId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Child created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, childrenController.createChild);

/**
 * @swagger
 * /children:
 *   get:
 *     summary: Get children by member ID
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of children
 *       400:
 *         description: Bad request
 */
router.get("/", authMiddleware, childrenController.getChildByMemberId);

/**
 * @swagger
 * /children/{id}:
 *   put:
 *     summary: Update child information
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Child ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthdate:
 *                 type: string
 *               gender:
 *                 type: string
 *     responses:
 *       200:
 *         description: Child updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Child not found
 */
router.put("/:id", authMiddleware, authorizeChildOwner, childrenController.updateChild);

/**
 * @swagger
 * /children/{id}:
 *   delete:
 *     summary: Delete child
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Child ID
 *     responses:
 *       200:
 *         description: Child deleted successfully
 *       404:
 *         description: Child not found
 */
router.delete("/:id", authMiddleware, authorizeChildOwner, childrenController.deleteChild);

/**
 * @swagger
 * /children/{id}:
 *   get:
 *     summary: Get child by ID
 *     tags: [Children]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Child ID
 *     responses:
 *       200:
 *         description: Child data
 *       404:
 *         description: Child not found
 */
router.get("/:id", authMiddleware, authorizeChildOwner, childrenController.getChildById);

module.exports = router;