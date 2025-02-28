const express = require("express");
const router = express.Router();
const childrenController = require("../controllers/ChildrenController");

router.post("/", childrenController.createChild); // Tạo mới
router.get("/", childrenController.getAllChildren); // Lấy danh sách
router.get("/:id", childrenController.getChildById); // Lấy 1 trẻ
router.put("/:id", childrenController.updateChild); // Cập nhật
router.delete("/:id", childrenController.deleteChild); // Xóa

module.exports = router;
