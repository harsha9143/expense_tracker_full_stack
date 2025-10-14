const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/databaseUtil");

const ForgotPassword = sequelize.define("forgot_passwords", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ForgotPassword;
