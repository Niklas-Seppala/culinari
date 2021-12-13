'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');

const fkName = require('../utils/fkName.js');
const Recipe = require('../models/recipeModel');

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
      unique: true,
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
      attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
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
        include: ['password'],
      },
    },
  ],
});

module.exports = User;
