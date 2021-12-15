'use strict';
const Recipe = require('../models/recipeModel.js');
const Ingredient = require('../models/ingredientModel.js');
const Step = require('../models/stepModel.js');
const fkName = require('../utils/fkName');
const Like = require('../models/likeModel.js');
const Picture = require('../models/pictureModel.js');

const validation = require('../utils/validations');

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
    const recipe = await Recipe.create(
      {
        name: req.body.name,
        desc: req.body.desc,
        owner_id: req.user.id,
        forked_from: req.body.forked_from || null,
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
      { include: [{ model: Ingredient, as: fkName(Ingredient) }] }
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
    let recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: req.params.id, owner_id: req.user.id },
    });
    if (!recipe) {
      return res.status(404).json({ errors: [{ msg: 'No such recipe' }] });
    }
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
      const imgs = req.files.map((file, i) => {
        return {
          recipe_id: req.params.id,
          filename: file.filename,
          order: i,
        };
      });
      await Picture.bulkCreate(imgs);
    }
    res.status(200).json({ msg: 'ok' });
    next();
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
