const express = require("express");

const expensesController = require("../controllers/expensesController");

const expensesRouter = express.Router();

expensesRouter.get("/", expensesController.getHomePage);
expensesRouter.post("/", expensesController.addExpense);
expensesRouter.get("/items", expensesController.getExpenses);
expensesRouter.delete("/remove/:id", expensesController.removeItem);

module.exports = expensesRouter;
