//local modules
const path = require("path");

//third-party modules
const express = require("express");
const cors = require("cors");

//custom modules
const authRouter = require("./routes/authRouter");
const User = require("./models/user");
const db = require("./utils/databaseUtil");
const expensesRouter = require("./routes/expensesRouter");
const Expense = require("./models/expense");
const { authenticate } = require("./middleware/authenticate");
const Payment = require("./models/payment");
const paymentRouter = require("./routes/PaymentRouter");

User.hasMany(Expense);
Expense.belongsTo(User);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  console.log("Middleware 1");
  res.send("Welcome to home page");
});

app.use("/home", authRouter);
app.use("/expenses", expensesRouter);
app.use("/payments", paymentRouter);

app.get("/verify-token", authenticate, (req, res) => {
  res.status(200).json({ message: "Token valid" });
});

app.use((req, res, next) => {
  res.status(404).send("<h1>404 - Page not Found</h1>");
});

const PORT = 4000;
db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `connection eshtablished successfully http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log("Server connection failed", err.message);
  });
