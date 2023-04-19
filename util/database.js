const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expressjs-database", "root", "Tin@1542002", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
