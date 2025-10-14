const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { passwordResetUtil } = require("../utils/resetPasswordUtil");

exports.signupPage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "signUp.html"));
};

exports.addUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(409).json({ message: "user already exists" });
    }

    bcrypt.hash(password, 10, async (err, result) => {
      if (err) {
        return res.status(404).json({ message: "something went wrong!" });
      }
      const newUser = await User.create({ name, email, password: result });
      res
        .status(201)
        .json({ message: "User created successfully. please login" });
    });
  } catch (error) {
    console.log("error", error.message);
  }
};

exports.loginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
};

exports.userAccount = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(403).json({ message: "user not found" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(404).json({ message: "something went wrong!!!" });
      }

      if (!result) {
        return res
          .status(401)
          .json({ message: "Password is incorrect. try again!!!" });
      }

      const token = jwt.sign({ userId: user.id }, "secretKey", {
        expiresIn: "1h",
      });

      res.status(200).json({ message: "login successful", token });
    });
  } catch (error) {
    console.log(error.message);
  }
};

exports.resetPasswordPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "sendResetLink.html"));
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const trans = await passwordResetUtil(user.name, user.email);

    if (trans) {
      res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    }
  } catch (error) {
    res.status(500).json({ message: "password cannot be reset!!! Try again" });
  }
};
