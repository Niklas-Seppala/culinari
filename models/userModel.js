"use strict";
const db = require("../database/db.js");
const Sequelize = require("Sequelize");



// define the table "user"
const User = db.define("user", {

  name: {
    type: Sequelize.STRING(),
    field: "name"
    allowNull: false,
  }
  password: {
    type: Sequelize.STRING(),
    field: "password"
    allowNull: false,
  }
  email: {
    type: Sequelize.STRING(),
    field: "email"
    allowNull: false,
  }
  role: {
    type: Sequelize.INT(),
    field: "role"
    allowNull: false,
  }
  score: {
    type: Sequelize.INT(),
    field: "score"
    allowNull: false,
  }
});

module.export = User;

/*
const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM wop_user");
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
};

const getUser = async(userId) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM wop_user WHERE `user_id` = ?", userId);
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
}

const getUserLogin = async (params) => {
  console.log("getUserLogin params", params);
  try {
    const [rows] = await promisePool.execute(
        "SELECT * FROM wop_user WHERE email = ?;",
        params);
    return rows;
  } catch (e) {
    console.log("error", e.message);
  }
};

const addUser = async (params) => {

  try {
    const [name, email, password] = params;

    const [rows] = await promisePool.query(
        "INSERT INTO wop_user (name, email, password, role) VALUES (?, ?, ?, 0)",
        [name, email, password]
      );
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
}

const updateUser = async (body, user) => {
  try {
    const name = body.name;
    const email = body.email;
    const password = body.passwd;

    const [rows] = await promisePool.query(
        "UPDATE wop_user SET name = ?, email = ?, password = ? WHERE user_id = ?",
        [name, email, password, user.user_id]
      );
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
}
*/

module.exports = {
  getUser,
  getUserLogin,
  getAllUsers,
  addUser,
  updateUser
};