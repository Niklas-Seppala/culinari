'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');

const fkName = require('../utils/fkName.js');
const Recipe = require('../models/recipeModel');

//const Model = Sequelize.Model;

// define the table "user"
class User extends Model {}
User.init(
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      field: 'password',
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      field: 'email',
      allowNull: false,
    },
    role: {
      type: Sequelize.INTEGER,
      field: 'role',
      allowNull: false,
    },
    score: {
      type: Sequelize.INTEGER,
      field: 'score',
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: sequelize._TABLE_NAME_PREFIX + 'user',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  }
);

User.addScope('includeRecipes', {
  include: [
    {
      attributes: {
        exclude: ['password'],
        include: ['name', 'desc', 'owner_id', 'forked_from'],
      },
      model: Recipe,
      as: fkName(Recipe),
    },
  ],
});

User.addScope('includePassword', {
  include: [
    {
      attributes: {
        include: ["password"],
      }
    },
  ],
});

module.exports = User;

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
/*
module.exports = {
  getUser,
  getUserLogin,
  getAllUsers,
  addUser,
  updateUser
};
*/
