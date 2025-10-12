const express = require("express");

const paymentsController = require("../controllers/paymentsController");

const paymentRouter = express.Router();

paymentRouter.post("/pay", paymentsController.processPayment);
paymentRouter.get("/payment-status/:orderId", paymentsController.paymentStatus);
paymentRouter.get("/", paymentsController.getPaymentPage);

module.exports = paymentRouter;
