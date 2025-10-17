//local modules
const path = require("path");
const fs = require("fs");

//third-party modules
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

//custom modules
const authRouter = require("./routes/authRouter");
const User = require("./models/user");
const db = require("./utils/databaseUtil");
const expensesRouter = require("./routes/expensesRouter");
const Expense = require("./models/expense");
const { authenticate } = require("./middleware/authenticate");
const Payment = require("./models/payment");
const paymentRouter = require("./routes/PaymentRouter");
const genAiRouter = require("./routes/genAiRouter");
const ForgotPassword = require("./models/forgotPasswordRequests");

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
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
app.use("/search", genAiRouter);

app.get("/verify-token", authenticate, (req, res) => {
  res.status(200).json({ message: "Token valid" });
});

app.use((req, res, next) => {
  res.status(404).send("<h1>404 - Page not Found</h1>");
});

db.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `connection eshtablished successfully http://localhost:${process.env.PORT}/home/login`
      );
    });
  })
  .catch((err) => {
    console.log("Server connection failed", err.message);
  });
