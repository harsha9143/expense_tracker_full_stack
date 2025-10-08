const express = require("express");

const authController = require("../controllers/authController");

const authRouter = express.Router();

authRouter.get("/signup", authController.signupPage);
authRouter.post("/signup", authController.addUser);
authRouter.get("/login", authController.loginPage);
authRouter.post("/login", authController.userAccount);

module.exports = authRouter;
