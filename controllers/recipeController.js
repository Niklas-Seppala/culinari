'use strict';
const Recipe = require('../models/recipeModel.js');
const Ingredient = require('../models/ingredientModel.js');
const Step = require('../models/stepModel.js');
const fkName = require('../utils/fkName');


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
  const recipe = await Recipe.create(
    {
      name: req.body.name,
      desc: req.body.desc,
      owner_id: req.user.id,
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
};


const put = async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId, owner_id: req.user.id },
    });
    if (!recipe) {
      return res.status(404).json({ errors: [{ msg: 'No such recipe exists' }] });
    }

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

    await Step.destroy({where: {recipe_id: recipeId}})
    await Step.bulkCreate(
      [...req.body.instructions].map(item => {
        item.recipe_id = recipe.id;
        return item;
      }),
    );

    const updated = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId, owner_id: req.user.id },
    });
    res.json(updated)

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
      return res.status(404).json({errors: [{msg: 'No such recipe'}]})
    }
    await recipe.destroy();
    return res.json({msg: 'ok'})
  } catch (error) {
    res.status(500).json({errors: [{msg: 'Internal server error'}]})
  }
}

module.exports = {
  get_all,
  get_single,
  post,
  put,
  del,
};
