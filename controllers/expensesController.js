const path = require("path");
const Expense = require("../models/expense");

exports.getHomePage = (req, res, next) => {
  if (!req.query.loggedIn) {
    return res.status(404).json({ message: "user not logged in" });
  }
  res.status(200).sendFile(path.join(__dirname, "../views", "expenses.html"));
};

exports.addExpense = async (req, res, next) => {
  const { price, description, category } = req.body;

  try {
    const addExpense = await Expense.create({ price, description, category });

    if (addExpense) {
      return res.status(201).json({ message: "Expense added successfully" });
    }

    res.status(401).json({ message: "expense not added" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();

    if (!expenses) {
      return res.status(404).json({ message: "Cannot fetch items" });
    }

    res.status(200).json(expenses);
  } catch (error) {
    console.log(error.message);
  }
};

exports.removeItem = async (req, res) => {
  const id = req.params.id;

  try {
    const delItem = await Expense.destroy({
      where: {
        id,
      },
    });

    if (delItem) {
      return res.status(200).json({ message: "item deleted successfully" });
    }

    res.status(404).json({ message: "item deletion failed" });
  } catch (error) {
    res.status(405).json({ message: "Item cannot be deleted" });
  }
};
