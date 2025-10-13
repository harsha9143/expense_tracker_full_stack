const path = require("path");

const Payment = require("../models/payment");
const {
  createOrder,
  getPaymentStatus,
  verifyPayment,
} = require("../services/cashfreeService");
const User = require("../models/user");
const sequelize = require("../utils/databaseUtil");

exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "payments.html"));
};

exports.processPayment = async (req, res) => {
  const orderId = "ORDER-" + Date.now();
  const orderAmount = 2000;
  const orderCurrency = "INR";
  const customerId = "1";
  const customerPhone = "9876543210";
  const transaction = await sequelize.transaction();

  try {
    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone
    );

    const paymentCreate = await Payment.create(
      {
        orderId,
        paymentSessionId,
        orderAmount,
        orderCurrency,
        paymentStatus: "PENDING",
      },
      { transaction }
    );

    if (!paymentCreate) {
      console.log("Error occured");
    }

    await User.update(
      { isPremiumUser: true },
      {
        where: {
          id: req.user.userId,
        },
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({ paymentSessionId, orderId });
  } catch (error) {
    await transaction.rollback();
    console.log(error.message);
    res.status(400).json({ message: "Error while making payment" });
  }
};

exports.paymentStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const paymentStatus = await getPaymentStatus(req.params.orderId);

    const statusUpdate = await Payment.update(
      { paymentStatus: paymentStatus },
      {
        where: {
          orderId: req.params.orderId,
        },
      },
      { transaction }
    );

    if (!statusUpdate) {
      await transaction.rollback();
      return res.status(400).send(`<h2>Payment Status</h2>
      <p>Order ID: ${req.params.orderId}</p>
      <p>Status: ${paymentStatus}</p>
      <a href="/expenses">Back to Home</a>
    `);
    }

    await transaction.commit();

    res.status(200).send(`<h2>Payment Status</h2>
      <p>Order ID: ${req.params.orderId}</p>
      <p>Status: ${paymentStatus}</p>
      <a href="/expenses">Back to Home</a>
    `);
  } catch (error) {
    await transaction.rollback();
    res.status(400).send("Error occured while doing payment");
  }
};
