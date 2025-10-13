const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseUtil");

const User = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalExpenses: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isPremiumUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
