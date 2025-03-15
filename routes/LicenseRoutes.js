const express = require("express");
const router = express.Router();
const LicenseController = require("../controllers/LicenseController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /licenses:
 *   post:
 *     summary: Create a new license
 *     tags: [Licenses]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: License created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, authorize(["Admin"]), LicenseController.createLicense);

/**
 * @swagger
 * /licenses:
 *   get:
 *     summary: Get all licenses
 *     tags: [Licenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of licenses
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, LicenseController.getAllLicenses);

/**
 * @swagger
 * /licenses/{id}:
 *   get:
 *     summary: Get license by ID
 *     tags: [Licenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: License ID
 *     responses:
 *       200:
 *         description: License data
 *       404:
 *         description: License not found
 */
router.get("/:id", authMiddleware, LicenseController.getLicenseById);

/**
 * @swagger
 * /licenses/{id}:
 *   put:
 *     summary: Update license
 *     tags: [Licenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: License ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: License updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: License not found
 */
router.put("/:id", authMiddleware, authorize(["Admin"]), LicenseController.updateLicense);

/**
 * @swagger
 * /licenses/{id}:
 *   delete:
 *     summary: Delete license
 *     tags: [Licenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: License ID
 *     responses:
 *       200:
 *         description: License deleted successfully
 *       404:
 *         description: License not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), LicenseController.deleteLicense);

module.exports = router;