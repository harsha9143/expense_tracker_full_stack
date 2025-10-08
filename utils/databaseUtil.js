const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "expense_tracker_fullstack",
  "root",
  "vm4udte@W",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

(async () => {
  await sequelize.authenticate();
  console.log("Database connected successfully");
})();

module.exports = sequelize;
