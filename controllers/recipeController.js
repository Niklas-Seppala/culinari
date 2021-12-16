'use strict';
const Recipe = require('../models/recipeModel.js');
const Ingredient = require('../models/ingredientModel.js');
const RecipeIngredient = require('../models/recipeIngredientModel.js');
const Step = require('../models/stepModel.js');
const fkName = require('../utils/fkName');
const Like = require('../models/likeModel.js');
const Picture = require('../models/pictureModel.js');

const validation = require('../utils/validations');
const { deletePicturesFromRecipes } = require('../utils/deletePictures');



const get_single = async (req, res) => {
  const recipe = await Recipe.scope('includeForeignKeys').findOne({
    where: { id: req.params.id },
  });
  if (!recipe) {
    return res.status(404).json({ errors: [{ msg: 'No recipe with such id exists.' }] });
  }
  return res.json(recipe);
};

const get_all = async (req, res) => {
  const recipes = await Recipe.scope('includeForeignKeys').findAll();
  return res.json(recipes);
};

const post = async (req, res) => {
  try {

    console.log(req.body.ingredients.map(ing => ing.name))
    // check which of the ingredients exist in the db already so we don't create duplicates
    const existingIngredients = await Ingredient.findAll(
      {
        where: {
          name: req.body.ingredients.map(ing => ing.name.trim())
        }
      }
    );

    // get unique existing ingredients in case there is something wrong with the db's state 
    let ingredientsToAssociate = [];
    let existingNames = [];

    existingIngredients.forEach((ing) => {
      if(!existingNames.includes(ing.dataValues.name)) {
        const bodyIngredient = req.body.ingredients.find(ing => ing.name == ing.name);

        // add the amount and unit data we got so we can add those to the RecipeIngredient table
        ingredientsToAssociate.push({
          amount: bodyIngredient.amount,
          unit: bodyIngredient.unit,
          culinariIngredientId: ing.id, //as were doing this manually, we must use this column name defined in the db
        });
        existingNames.push(ing.dataValues.name);
      }
    });

    // only add the ingredients to the db that we can't just create M2M associations to
    const ingredientsToCreate = req.body.ingredients.filter(ing => !existingNames.includes(ing.name));


    const recipe = await Recipe.create(
      {
        name: req.body.name,
        desc: req.body.desc,
        owner_id: req.user.id,
        forked_from: req.body.forked_from || null,
        ingredient: ingredientsToCreate.map(ing => {
          return {
            name: ing.name,
            culinari_recipeIngredient: {
              amount: ing.amount,
              unit: ing.unit,
            },
          };
        }),
      },
      { include: [{ model: Ingredient, as: fkName(Ingredient) }] }
    );


    // bulk create the associations in the M2M table
    const recipeIngredients = await RecipeIngredient.bulkCreate(
      ingredientsToAssociate.map(ing => {return {...ing, culinariRecipeId:recipe.id}})
    );


    await Step.bulkCreate(
      [...req.body.instructions].map(item => {
        item.recipe_id = recipe.id;
        return item;
      })
    );

    const result = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipe.id },
    });

    return res.json(result);
  } catch (error) {
    if (error.name == 'SequelizeForeignKeyConstraintError') {
      return res
        .status(404)
        .json({
          errors: [{ param: 'forked_from', msg: 'No recipe with such id exists.' }],
        });
    } else {
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }
};

const put = async (req, res) => {
  try {
    const recipeId = req.params.id;
    await Recipe.update(
      {
        name: req.body.name,
        desc: req.body.desc,
        ingredient: req.body.ingredients.map(ing => {
          return {
            name: ing.name,
            culinari_recipeIngredient: {
              amount: ing.amount,
              unit: ing.unit,
            },
          };
        }),
      },
      {
        where: { id: recipeId },
        include: [{ model: Ingredient, as: fkName(Ingredient) }],
      }
    );

    await Step.destroy({ where: { recipe_id: recipeId } });
    await Step.bulkCreate(
      [...req.body.instructions].map(item => {
        item.recipe_id = recipeId;
        return item;
      })
    );

    const updated = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId, owner_id: req.user.id },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
};

const del = async (req, res) => {

  try {
    let whereParams = { id: req.params.id, owner_id: req.user.id };

    if(req.user.role == 1) {
        // don't check the owner_id if the user is an admin
        delete whereParams.owner_id;
    }

    let recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: whereParams,
    });

    if (!recipe) {
      return res.status(404).json({ errors: [{ msg: 'No such recipe' }] });
    }

    // delete the image files
    deletePicturesFromRecipes([recipe]);


    await recipe.destroy();
    return res.json({ msg: 'ok' });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
};

const post_like = async (req, res) => {
  try {
    const existing = await Like.findOne({
      where: { recipe_id: req.params.id, user_id: req.user.id },
    });
    if (existing) {
      // Dislike Recipe
      existing.destroy();
      return res.json({ OP: 'DEL' });
    }
    // Like Recipe
    const like = await Like.create({
      recipe_id: req.params.id,
      user_id: req.user.id,
    });
    return res.json({ OP: 'POST', data: like });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

const post_img = async (req, res, next) => {
  try {
    if (req.files) {
        console.log(req.files);
      const imgs = req.files.map((file, i) => {
        return {
          recipe_id: req.params.id,
          filename: file.filename,
          order: i,
        };
      });
      const asd = await Picture.bulkCreate(imgs);
      res.status(200).json(asd);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  get_all,
  get_single,
  post,
  put,
  del,
  post_like,
  post_img,
};
