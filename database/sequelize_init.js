"use strict";
const Sequelize = require("sequelize");

require("dotenv").config();

// initialize the database connection using the Sequelize library
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_TYPE,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

console.log("DB CALLED NOW");
module.exports = sequelize;