const path = require("path");

exports.signupPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../views", "signUp.html"));
};

exports.registeredUser = (req, res, next) => {
  console.log(req.body);
  res.status(201).send("user registered successfully");
};
