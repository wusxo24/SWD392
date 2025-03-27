const express = require("express");
const {
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
    updateMemberStatus,
    updateMemberForMember
} = require("../controllers/MemberController");

const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getAllMembers);

/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member data
 *       404:
 *         description: Member not found
 */
router.get("/:id", authMiddleware, getMemberById);

/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Update member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
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
 *         description: Member updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Member not found
 */
router.put("/:id", authMiddleware, authorize(["Member", "Manager", "Admin"]), updateMember);

router.put("/:id/member", authMiddleware, authorize(["Member", "Manager", "Admin"]), updateMemberForMember);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Delete member
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *       404:
 *         description: Member not found
 */
router.delete("/:id", authMiddleware, authorize(["Admin"]), deleteMember);

router.patch("/:id/status", authMiddleware, authorize(["Admin"]), updateMemberStatus);

module.exports = router;