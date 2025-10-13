const path = require("path");

const { fn, col, literal } = require("sequelize");

const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../utils/databaseUtil");

exports.getHomePage = (req, res, next) => {
  res.status(200).sendFile(path.join(__dirname, "../views", "expenses.html"));
};

exports.addExpense = async (req, res, next) => {
  const { price, description, category } = req.body;
  const transaction = await sequelize.transaction();

  try {
    const addExpense = await Expense.create(
      {
        price,
        description,
        category,
        userId: req.user.userId,
      },
      { transaction }
    );

    await User.increment(
      {
        totalExpenses: price,
      },
      {
        where: {
          id: req.user.userId,
        },
        transaction,
      }
    );
    await transaction.commit();

    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    await transaction.rollback();
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
  const transaction = await sequelize.transaction();

  try {
    const delItem = await Expense.findOne({
      where: {
        id,
        userId: req.user.userId,
      },
    });

    const price = delItem.price;
    await delItem.destroy({ transaction });

    await User.decrement(
      {
        totalExpenses: price,
      },
      {
        where: {
          id: req.user.userId,
        },
      }
    );

    await transaction.commit();

    if (delItem) {
      return res.status(200).json({ message: "item deleted successfully" });
    }

    res.status(404).json({ message: "item deletion failed" });
  } catch (error) {
    await transaction.rollback();
    res.status(405).json({ message: "Item cannot be deleted" });
  }
};

exports.getUserwiseExpenses = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        [fn("SUM", col("expenses.price")), "totalPrice"],
      ],
      include: [
        {
          model: Expense,
          attributes: [],
        },
      ],
      group: ["users.id"],
      order: [[literal("totalPrice"), "DESC"]],
    });

    if (!users) {
      return res.status(400).send("users cannot be fetched");
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).send("Failed to fecth users");
  }
};

exports.getUserType = async (req, res) => {
  try {
    const userType = await User.findByPk(req.user.userId, {
      attributes: ["isPremiumUser"],
    });

    res.status(200).json(userType);
  } catch (error) {
    console.log(error.message);
  }
};
