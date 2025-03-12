const express = require("express");
const router = express.Router();
const { authMiddleware, authorize } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/PaymentController");


router.post("/receive-hook",paymentController.receivePayment);
router.post("/:serviceId",authMiddleware,  paymentController.createEmmbeddedPaymentLink);
module.exports = router;