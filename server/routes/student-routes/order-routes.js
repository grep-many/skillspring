const express = require("express");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
  cancelPaymentAndCleanup,
} = require("../../controllers/student-controller/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);
router.post("/cancel", cancelPaymentAndCleanup);

module.exports = router;