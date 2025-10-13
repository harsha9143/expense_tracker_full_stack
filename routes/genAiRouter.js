const express = require("express");

const genAiController = require("../controllers/genAiController");

const genAiRouter = express.Router();

genAiRouter.post("/", genAiController.getCategory);

module.exports = genAiRouter;
