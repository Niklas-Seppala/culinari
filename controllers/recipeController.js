'use strict';

const Recipe = require('../models/recipeModel.js');
const Picture = require('../models/pictureModel.js');

/**
    Gets the list of recipes
*/
const recipe_list_get = async (req, res) => {
  // TODO: add pagination
  const recipes = await Recipe.scope('includeForeignKeys').findAll();
  return res.json(recipes);
};

const recipe_get = async (req, res) => {
  const recipeId = req.params.recipeId;
  const recipe = await Recipe.scope('includeForeignKeys').findOne({
    where: { id: recipeId },
  });
  console.log('recipeId', recipeId);
  console.log('recipe', recipe);
  return res.json(recipe);
};

const recipe_post = async (req, res) => {
    // TODO: validation
    console.log(req.body);
    console.log("user is:",req.user)
    const userId = req.user.dataValues.id;

    const recipe = await Recipe.create({
        name: req.body.name,
        desc: req.body.desc,
        owner_id: userId,
    });

    return res.json(recipe)
};

const recipe_picture_post = async (req, res) => {
    const recipeId = req.params.recipeId;
    let recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId },
    });
    // TODO: validation

    if (!recipe) {
        return res.status(404).json({errors: ["Recipe not found"]});
    }
    console.log(req);
    // handle the pictures
    if(req.files.length > 0) {
    
        // get the amount of pre-existing pictures for the order numbers
        const pictureCount = recipe.pictures.length;
        let pictures = [];

        req.files.forEach((file, index) => {
            console.log(index)
            pictures.push(
                {
                    recipe_id: recipe.id,
                    filename: file.path,
                    order: pictureCount+index+1
                }
            )
        });
        
        await Picture.bulkCreate(pictures);

        return res.json(recipe);
    }
    await Picture

    
};

const recipe_update = async (req, res) => {};

const recipe_delete = async (req, res) => {};

module.exports = {
  recipe_list_get,
  recipe_get,
  recipe_picture_post,
  recipe_post,
  recipe_update,
  recipe_delete,
};
