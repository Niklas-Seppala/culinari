'use strict'
const Recipe = require('../models/recipeModel.js');
const Ingredient = require('../models/ingredientModel.js');
const RecipeIngredient = require('../models/recipeIngredientModel.js');

/**
  Checks which of the ingredient objects already have ingredients that exist in the database and returns them

  @param ingredients the ingredient in a list of objects passed by the controller
  @return a list of objects suitable for RecipeIngredient.bulkCreate()
*/
const getExistingIngredients = async (ingredients) => {
  const existingIngredients = await Ingredient.findAll(
    {
      where: {
        name: ingredients.map(ing => ing.name.trim())
      }
    }
  );

  // get unique existing ingredients in case there is something wrong with the db's state 
  let ingredientsToReturn = [];
  let existingNames = [];

  existingIngredients.forEach((ing) => {
    if(!existingNames.includes(ing.dataValues.name)) {
      const bodyIngredient = ingredients.find(ing => ing.name == ing.name);
      // add the amount and unit data we got so we can add those to the RecipeIngredient table
      ingredientsToReturn.push({
        amount: bodyIngredient.amount,
        unit: bodyIngredient.unit,
        culinariIngredientId: ing.id, //as were doing this manually, we must use this column name defined in the db
      });
      existingNames.push(ing.dataValues.name);
    }
  });

  return ingredientsToReturn
};

/**
  Checks which of the ingredient objects already have ingredients that exist in the database 
  and return ONLY the ones that don't exist

  @param ingredients the ingredient in a list of objects passed by the controller
  @return a list of objects suitable for Recipe.create()
*/
const getNewIngredients = async (ingredients) => {
  const existingIngredients = await Ingredient.findAll(
    {
      where: {
        name: ingredients.map(ing => ing.name.trim())
      }
    }
  );
  const existingNames = existingIngredients.map(ing => ing.name);
  // only add the ingredients to the db that we can't just create M2M associations to
  const ingredientsToCreate = ingredients.filter(ing => !existingNames.includes(ing.name));
  return ingredientsToCreate;
}

module.exports = {
  getExistingIngredients, getNewIngredients
}