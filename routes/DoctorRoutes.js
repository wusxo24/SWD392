const express = require("express");
const { createDoctor, getDoctors, updateDoctor, deleteDoctor, getDoctorById, softDeleteDoctor, restoreDoctor, updateDoctorStatus } = require("../controllers/DoctorController");
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
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
 *         description: Doctor created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, authorize(["Admin"]), createDoctor);

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getDoctors);

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update doctor information
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor ID
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
 *         description: Doctor updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Doctor not found
 */
router.put("/:id", authMiddleware, authorize(["Admin", "Doctor"]), updateDoctor);

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Delete doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       404:
 *         description: Doctor not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), deleteDoctor);


router.get("/:id", authMiddleware, authorize(["Admin"]), getDoctorById);

// Soft delete doctor (update status to "Inactive")
router.put("/:id/soft-delete", authMiddleware, authorize(["Admin"]), softDeleteDoctor);

// Restore doctor (update status to "Active")
router.put("/:id/restore", authMiddleware, authorize(["Admin"]), restoreDoctor);

router.patch("/:id/status", authMiddleware, authorize(["Admin"]), updateDoctorStatus);
router.get("/Available", authMiddleware, authorize(["Manager"]), getDoctors);
module.exports = router;