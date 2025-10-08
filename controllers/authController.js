const path = require("path");
const User = require("../models/User");

exports.signupPage = async (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "signUp.html"));
};

exports.addUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await User.create({ name, email, password });

    res
      .status(201)
      .json({ message: "User created successfully. please login" });
  } catch (error) {
    console.log("error", error.message);
  }
};

exports.loginPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "login.html"));
};

exports.getUser = async (req, res, next) => {
  const email = req.params.email;

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return res
        .status(403)
        .json({ message: "User already exists", password: user.password });
    }

    res.status(200).json({ message: "user doesn't exist" });
  } catch (error) {
    console.log(error.message);
  }
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
      return res.status(404).json({ message: "user not found" });
    }

    if (user.password !== password) {
      return res
        .status(403)
        .json({ message: "password not correct. try again" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.log(error.message);
  }
};
