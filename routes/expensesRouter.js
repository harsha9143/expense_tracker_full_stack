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

expensesRouter.get(
  "/all-items",
  authenticator.authenticate,
  expensesController.getAllExpenses
);

expensesRouter.delete(
  "/remove/:id",
  authenticator.authenticate,
  expensesController.removeItem
);

expensesRouter.get(
  "/users",
  authenticator.authenticate,
  expensesController.getAllUsers
);

module.exports = expensesRouter;
