'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');
const Picture = require('./pictureModel.js');
const Ingredient = require('./ingredientModel.js');
const RecipeIngredient = require('./recipeIngredientModel.js');
const Step = require('./stepModel.js');

const fkName = require('../utils/fkName.js');

const toJSON = function() {
  let values = Object.assign({}, this.get());
  const table = RecipeIngredient.model.getTableName();

  // flatten the recipeIngredient portion of the json
  //so the values are in a single depth object for each
  values.ingredient.forEach((ingredient) => {
    for(const [key, value] of Object.entries(ingredient[table])) {
      ingredient[key] = ingredient[table][key]
    }
    delete ingredient[table];
  });
  
  return values;
  }

// define the table "recipe"
class Recipe extends Model {}
Recipe.init(
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
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
    freezeTableName: true,
    modelName: sequelize._TABLE_NAME_PREFIX + 'recipe'
  }
);

Recipe.prototype.toJSON = toJSON;

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
      attributes: ['id', 'name'],
      model: Ingredient,
      as: fkName(Ingredient),
      through: RecipeIngredient
    },
    {
      attributes: ['id', 'content', 'order'],
      model: Step,
      as: fkName(Step),
    },
  ],
});

module.exports = Recipe;
