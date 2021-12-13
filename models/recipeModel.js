'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');
const Picture = require('./pictureModel.js');
const Ingredient = require('./ingredientModel.js');
const Step = require('./stepModel.js');

const fkName = require('../utils/fkName.js');

// define the table "recipe"
class Recipe extends Model {}
Recipe.init(
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
      unique: true,
      allowNull: false,
    },
    desc: {
      type: Sequelize.STRING,
      field: 'desc',
      allowNull: false,
    },
    owner_id: {
      type: Sequelize.INTEGER,
      field: 'owner_id',
      allowNull: false,
    },
    forked_from: {
      type: Sequelize.INTEGER,
      field: 'forked_from',
    },
  },
  {
    sequelize,
    modelName: sequelize._TABLE_NAME_PREFIX + 'recipe',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', "updatedAt"]
      }
    }
  }
);

Recipe.addScope('includeForeignKeys', {
  attributes: {
    exclude: ['createdAt', "updatedAt"]
  },
  include: [
    {
      attributes: ['id', 'recipe_id', 'filename', 'order'],
      model: Picture,
      as: fkName(Picture),
    },
    {
      attributes: ['id', 'content', 'order'],
      model: Step,
      as: fkName(Step),
    },
  ],
});

module.exports = Recipe;
