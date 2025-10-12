const path = require("path");

const Payment = require("../models/payment");
const {
  createOrder,
  getPaymentStatus,
  verifyPayment,
} = require("../services/cashfreeService");

exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "payments.html"));
};

exports.processPayment = async (req, res) => {
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerId = "1";
  const customerPhone = "9876543210";

  try {
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );

    const paymentCreate = await Payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "PENDING",
    });

    if (!paymentCreate) {
      console.log("Error occured");
    }

    res.status(201).json({ paymentSessionId, orderId });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "Error while making payment" });
  }
};

exports.paymentStatus = async (req, res) => {
  try {
    const paymentStatus = await getPaymentStatus(req.params.orderId);

    const statusUpdate = await Payment.update(
      { paymentStatus: paymentStatus },
      {
        where: {
          orderId: req.params.orderId,
        },
      }
    );

    if (!statusUpdate) {
      return res.status(400).send(`<h2>Payment Status</h2>
      <p>Order ID: ${req.params.orderId}</p>
      <p>Status: ${paymentStatus}</p>
      <a href="/checkout.html">Back to Home</a>
    `);
    }

    res.status(200).send(`<h2>Payment Status</h2>
      <p>Order ID: ${req.params.orderId}</p>
      <p>Status: ${paymentStatus}</p>
      <a href="/checkout.html">Back to Home</a>
    `);
  } catch (error) {
    res.status(400).send("Error occured while doing payment");
  }
};
