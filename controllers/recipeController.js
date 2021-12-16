'use strict';
const Recipe = require('../models/recipeModel.js');
const Ingredient = require('../models/ingredientModel.js');
const RecipeIngredient = require('../models/recipeIngredientModel.js');
const Step = require('../models/stepModel.js');
const fkName = require('../utils/fkName');
const Like = require('../models/likeModel.js');
const Picture = require('../models/pictureModel.js');

const { QueryTypes } = require('sequelize');
const { deletePicturesFromRecipes } = require('../utils/deletePictures');

const {
  getExistingIngredients,
  getNewIngredients,
} = require('../utils/duplicateIngredients');
const { sequelize } = require('../models/pictureModel.js');

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
    console.log(req.body.ingredients.map(ing => ing.name));

    const existingIngredients = await getExistingIngredients(req.body.ingredients);
    const newIngredients = await getNewIngredients(req.body.ingredients);
    console.log('newIngredients', newIngredients);
    console.log('existingIngredients', existingIngredients);
    const recipe = await Recipe.create(
      {
        name: req.body.name,
        desc: req.body.desc,
        owner_id: req.user.id,
        forked_from: req.body.forked_from || null,
        ingredient: newIngredients.map(ing => {
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
      existingIngredients.map(ing => {
        return { ...ing, culinariRecipeId: recipe.id };
      })
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
    console.log(error);
    if (error.name == 'SequelizeForeignKeyConstraintError') {
      return res.status(404).json({
        errors: [{ param: 'forked_from', msg: 'No recipe with such id exists.' }],
      });
    } else {
      return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
    }
  }
};

// Helper for put()
const indexOfMatchingRecipe = (oldRecipeIngs, lookupTable, name) => {
  for (let j = 0; j < oldRecipeIngs.length; j++) {
    const recipeIng = oldRecipeIngs[j];
    if (lookupTable[recipeIng.culinariIngredientId].name === name) {
      return j;
    }
  }
  return -1;
}

const put = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const ingredients = req.body.ingredients;

    // Can't figure out how to make this work with sequalize.js
    // Instead we make this shitstorm.
    const oldRecipeIngs = await sequelize.query(
      'SELECT * FROM culinari_recipeIngredient WHERE culinariRecipeId = $1',
      { type: QueryTypes.SELECT, bind: [recipeId] }
    );
    const commonIngs = await sequelize.query('SELECT * FROM culinari_ingredient', {
      type: QueryTypes.SELECT,
    });
    const commonIngMap = {};
    commonIngs.forEach(item => (commonIngMap[item.id] = item));

    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];

      let matchIndex = indexOfMatchingRecipe(oldRecipeIngs, commonIngMap, ing.name)
      if (matchIndex >= 0) {
        // -- OLD INGREDIENT WAS FOUND --
        // Update on place and marke as handled by removing from old ingredient array.
        await RecipeIngredient.update(
          { unit: ing.unit, amount: ing.amount, order: ing.order },
          {
            where: {
              culinariRecipeId: recipeId,
              culinariIngredientId: oldRecipeIngs[matchIndex].culinariIngredientId,
            },
          }
        );
        oldRecipeIngs.splice(matchIndex, 1); // Remove.
      } else {
        // -- NEW INGREDIENT WAS FOUND --
        // Create new common ingredient if it doesn't exist.
        let newCommon = await Ingredient.findOne( {where: {name: ing.name}})
        if (!newCommon)
          newCommon = (await Ingredient.create({ name: ing.name }));
        
        // Link that common inggredient to new Recipe specific join model.
        await RecipeIngredient.create({
          amount: ing.amount,
          unit: ing.unit,
          culinariRecipeId: recipeId,
          culinariIngredientId: newCommon.id,
        });
      }
    }
    // The old recipes that survived after that clusterfuck, are those that get remove.
    oldRecipeIngs.forEach(async remaining => {
      await RecipeIngredient.destroy({
        where: {
          culinariIngredientId: remaining.culinariIngredientId,
          culinariRecipeId: remaining.culinariRecipeId,
        },
      });
    });

    // Continue as normal. Im glad it's over. The rest stinks as well, but what can you do.
    const newRecipe = { name: req.body.name, desc: req.body.desc }
    await Recipe.update(newRecipe, { where: { id: recipeId } });

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

    if (req.user.role == 1) {
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
