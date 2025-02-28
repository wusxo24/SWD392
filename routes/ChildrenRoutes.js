const express = require("express");
const router = express.Router();
const childrenController = require("../controllers/ChildrenController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, childrenController.createChild); // Tạo mới
router.get("/", authMiddleware,childrenController.getChildByMemberId); // Lấy trẻ theo phụ huynh
router.put("/:id", childrenController.updateChild); // Cập nhật
router.delete("/:id", childrenController.deleteChild); // Xóa

module.exports = router;
