//local modules
const path = require("path");

//third-party modules
const express = require("express");

//custom modules
const signUpRouter = require("./routes/signUpRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res, next) => {
  console.log("Middleware 1");
  res.send("Welcome to home page");
});

app.use("/home", signUpRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`connection eshtablished successfully http://localhost:${PORT}`);
});
