const express = require("express");

const signupController = require("../controllers/signupController");

const signUpRouter = express.Router();

signUpRouter.get("/signup", signupController.signupPage);
signUpRouter.post("/signup", signupController.registeredUser);

module.exports = signUpRouter;
