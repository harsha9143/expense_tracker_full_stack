const express = require("express");

const authController = require("../controllers/authController");

const authRouter = express.Router();

authRouter.get("/signup", authController.signupPage);
authRouter.post("/signup", authController.addUser);
authRouter.get("/login", authController.loginPage);
authRouter.post("/login", authController.userAccount);
authRouter.get("/reset-password", authController.resetPasswordPage);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.get("/reset-password-page", authController.newPasswordPage2);
authRouter.get("/password-reset/:uuid", authController.newPasswordPage);
authRouter.post("/password-reset", authController.setNewPassword);

module.exports = authRouter;
