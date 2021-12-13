'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');

// define the table "recipeIngredient" that works as a through table for the many-to-many relationship between Recipe and Ingredient
class RecipeIngredient extends Model {}
RecipeIngredient.init(
  {
    amount: {
      type: Sequelize.FLOAT,
      field: 'amount',
      allowNull: false,
    },
    unit: {
      type: Sequelize.STRING,
      field: 'unit',
    }
  },
{
    sequelize,
    freezeTableName: true,
    modelName: sequelize._TABLE_NAME_PREFIX + 'recipeIngredient',
  }
);

module.exports = RecipeIngredient;
