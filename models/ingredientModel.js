'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');

// define the table "ingredient"
class Ingredient extends Model {}
Ingredient.init(
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: sequelize._TABLE_NAME_PREFIX + 'ingredient',
  }
);

module.exports = Ingredient;
