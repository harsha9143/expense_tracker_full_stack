const express = require("express");

const expensesController = require("../controllers/expensesController");
const authenticator = require("../middleware/authenticate");

const expensesRouter = express.Router();

expensesRouter.get("/", expensesController.getHomePage);
expensesRouter.post(
  "/",
  authenticator.authenticate,
  expensesController.addExpense
);
expensesRouter.get(
  "/items",
  authenticator.authenticate,
  expensesController.getExpenses
);

expensesRouter.delete(
  "/remove/:id",
  authenticator.authenticate,
  expensesController.removeItem
);

expensesRouter.get(
  "/leader-board",
  authenticator.authenticate,
  expensesController.getUserwiseExpenses
);

module.exports = expensesRouter;
