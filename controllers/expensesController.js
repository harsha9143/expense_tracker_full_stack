const path = require("path");

const { fn, col, literal } = require("sequelize");

const Expense = require("../models/expense");
const User = require("../models/User");

exports.getHomePage = (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, "../views", "expenses.html"));
};

exports.addExpense = async (req, res, next) => {
  const { price, description, category } = req.body;

  try {
    const addExpense = await Expense.create({
      price,
      description,
      category,
      userId: req.user.userId,
    });

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
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.userId,
      },
    });

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
        userId: req.user.userId,
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

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

    if (!users) {
      return res.status(400).send("users cannot be fetched");
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).send("Failed to fecth users");
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const totals = await Expense.findAll({
      attributes: ["userId", [fn("SUM", col("price")), "totalPrice"]],
      group: ["userId"],
      order: [[literal("totalPrice"), "DESC"]],
    });

    res.status(200).json(totals);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};
