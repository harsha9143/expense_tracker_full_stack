const express = require("express");

const paymentsController = require("../controllers/paymentsController");
const { authenticate } = require("../middleware/authenticate");

const paymentRouter = express.Router();

paymentRouter.post("/pay", authenticate, paymentsController.processPayment);
paymentRouter.get(
  "/payment-status/:orderId",
  authenticate,
  paymentsController.paymentStatus
);
paymentRouter.get("/", paymentsController.getPaymentPage);

module.exports = paymentRouter;
