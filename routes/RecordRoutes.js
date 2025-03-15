const express = require("express");
const router = express.Router();
const recordController = require("../controllers/RecordController");
const { authMiddleware } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberId:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, recordController.createRecord);

/**
 * @swagger
 * /records/activate:
 *   put:
 *     summary: Activate a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recordId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record activated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Record not found
 */
router.put("/activate", authMiddleware, recordController.activateRecord);

/**
 * @swagger
 * /records/deactivate:
 *   put:
 *     summary: Deactivate a record
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recordId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record deactivated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Record not found
 */
router.put("/deactivate", authMiddleware, recordController.deactivateRecord);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get records by member ID
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of records
 *       400:
 *         description: Bad request
 */
router.get("/", authMiddleware, recordController.getRecordsByMemberId);

module.exports = router;