'use strict';
const { validationResult } = require('express-validator');

const { unlink } = require('fs');

const Recipe = require('../models/recipeModel.js');
const Ingredient = require('../models/ingredientModel.js');
const Step = require('../models/stepModel.js');
const Picture = require('../models/pictureModel.js');

/**
    Gets the list of recipes
*/
const recipe_list_get = async (req, res) => {
    /* #swagger.parameters['recipe'] = { 
           in: 'body',
           description: 'an array of recipes',
           type: 'object',
           schema: [{$ref: "#/definitions/recipe"}]
    } */
  // TODO: add pagination
  const recipes = await Recipe.scope('includeForeignKeys').findAll();
  return res.json(recipes);
};

const recipe_get = async (req, res) => {
    /* #swagger.parameters['recipe'] = { 
           in: 'body',
           description: 'Recipe',
           type: 'object',
           schema: { $ref: "#/definitions/recipe" }
    } */

  const recipeId = req.params.recipeId;
  const recipe = await Recipe.scope('includeForeignKeys').findOne({
    where: { id: recipeId },
  });
  console.log('recipeId', recipeId);

  if(!recipe) {
    return res.status(400).json({error: "Recipe not found"});
  }

  return res.json(recipe);
};

const recipe_post = async (req, res) => {
    /* #swagger.parameters['recipe'] = { 
           in: 'body',
           description: 'Recipe',
           type: 'object',
           schema: { $ref: "#/definitions/recipe" }
    } */

    const errors = validationResult(req);

    console.log(req.body);
    console.log("user is:",req.user)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipe = await Recipe.create({
        name: req.body.name,
        desc: req.body.desc,
        owner_id: req.user.id,
    });


    let stepsData = [];
    req.body.steps.forEach((step, index) => {
        console.log(step, index);
        stepsData.push({
            order: step.order,
            content: step.content,
            recipe_id: recipe.id
        });

    });


    let ingredientsData = [];
    req.body.ingredients.forEach((ingredient, index) => {
        ingredientsData.push({
            name: ingredient.name,
            amount: ingredient.amount || 0.0,
            unit: ingredient.unit || "",
            recipe_id: recipe.id
        });

    });


    await Ingredient.bulkCreate(ingredientsData);
    await Step.bulkCreate(stepsData);



    return res.json(recipe)
};

const recipe_picture_post = async (req, res) => {
    const recipeId = req.params.recipeId;
    let recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId, owner_id: req.user.id },
    });

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

const recipe_picture_delete = async (req, res) => {
    const recipeId = req.params.recipeId;
    const pictureId = req.params.pictureId;
    let recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId, owner_id: req.user.id },
    });

    if (!recipe) {
        return res.status(404).json({errors: ["Recipe not found"]});
    }

    const picture = await Picture.findOne({
        where: {id: pictureId, recipe_id: recipeId}
    });

    if(!picture) {
        return res.status(404).json({errors: ["Picture not found"]});
    }

    // delete the file itself first
    unlink(picture.dataValues.filename, (err) => {
        if(err) {
            throw err;
        }
    });

    // delete the database entry
    await picture.destroy();

    return res.json({msg: "Picture deleted succesfully"});
}

const recipe_update = async (req, res) => {
    const errors = validationResult(req);

    console.log(req.body);
    console.log("user is:",req.user)

    const userId = req.user.id;

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const recipeId = req.params.recipeId;
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId, owner_id: userId },
    });

    if(!recipe) {
        return res.status(400).json({errors: ["Recipe not found"]});
    }

    try {
        await Recipe.update({
                name: req.body.name,
                desc: req.body.desc
            },
            { where: {id: recipeId, owner_id: userId} }
        );

    } catch(error) {
        return res.status(500).json({errors: ["Something went wrong"]})
    }
    const updatedRecipe = await Recipe.scope("includeForeignKeys").findOne(
        {where: {id: recipeId, owner_id: userId}
    });
    return res.json(updatedRecipe);
};

const recipe_delete = async (req, res) => {
    const recipeId = req.params.recipeId;
    let recipe = await Recipe.scope('includeForeignKeys').findOne({
      where: { id: recipeId, owner_id: req.user.id },
    });

    await recipe.destroy();
    return res.json({msg: "Recipe deleted"});
};



const recipe_ingredient_update = async (req, res) => {
    const recipeId = req.params.recipeId;
    const ingredientId = req.params.ingredientId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //validate that recipe exists
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
        where: {id: recipeId, owner_id: req.user.id}
    });

    if (!recipe) {
        return res.status(400).json({errors: ["Recipe not found"]});
    }

    const ingredient = await Ingredient.findOne({
        where: {id: ingredientId, recipe_id: recipeId}
    });

    if(!ingredient) {
        return res.status(400).json({errors: ["Ingredient not found"]});
    }

    await Ingredient.update({
        name: req.body.name,
        amount: req.body.amount,
        unit: req.body.unit
    }, {
        where: {id: ingredientId, recipe_id: recipeId}
    });

    const updatedIngredient = await Ingredient.findOne({
        where: {id: ingredientId, recipe_id: recipeId}
    });

    return res.json(updatedIngredient);

}
const recipe_ingredient_delete = async (req, res) => {
    const recipeId = req.params.recipeId;
    const ingredientId = req.params.ingredientId;

    //validate that recipe exists
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
        where: {id: recipeId, owner_id: req.user.id}
    });

    if (!recipe) {
        return res.status(400).json({errors: ["Recipe not found"]});
    }

    // fetch the ingredient
    let ingredient = await Ingredient.findOne({
        where: {id: ingredientId, recipe_id: recipeId}
    });

    if(!ingredient) {
        return res.status(400).json({errors: ["Ingredient not found!"]})
    }

    await ingredient.destroy();

    return res.status(200).json({msg: "Ingredient deleted."});

}

const recipe_step_update = async (req, res) => {
    const recipeId = req.params.recipeId;
    const stepId = req.params.stepId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //validate that recipe exists
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
        where: {id: recipeId, owner_id: req.user.id}
    });

    if (!recipe) {
        return res.status(400).json({errors: ["Recipe not found"]});
    }

    await Step.update({
        order: req.body.order,
        content: req.body.content
    }, {
        where: {id: stepId, recipe_id: recipeId}
    });

    const updatedStep = await Step.findOne({
        where: {id: stepId, recipe_id: recipeId}
    });

    return res.json(updatedStep);
}


const recipe_step_delete = async (req, res) => {
    const recipeId = req.params.recipeId;
    const stepId = req.params.stepId;

    //validate that recipe exists
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
        where: {id: recipeId, owner_id: req.user.id}
    });

    if (!recipe) {
        return res.status(400).json({errors: ["Recipe not found"]});
    }

    // fetch the step
    let step = await Step.findOne({
        where: {id: stepId, recipe_id: recipeId}
    });

    if(!step) {
        return res.status(400).json({errors: ["Step not found!"]})
    }

    await step.destroy();

    return res.status(200).json({msg: "Step deleted."});

}

const recipe_ingredient_add = async (req,res) => {
    const recipeId = req.params.recipeId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //validate that recipe exists
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
        where: {id: recipeId, owner_id: req.user.id}
    });

    if(!recipe) {
        return res.status(400).json({errors: ["Recipe not found"]});
    }

    const newIngredient = await Ingredient.create({
        name: req.body.name,
        amount: req.body.amount,
        unit: req.body.unit,
        recipe_id: recipeId
    });

    res.json(newIngredient)
} 

const recipe_step_add = async (req,res) => {
    const recipeId = req.params.recipeId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //validate that recipe exists
    const recipe = await Recipe.scope('includeForeignKeys').findOne({
        where: {id: recipeId, owner_id: req.user.id}
    });

    if(!recipe) {
        return res.status(400).json({errors: ["Recipe not found"]});
    }

    const newStep = await Step.create({
        order: req.body.order,
        content: req.body.content,
        recipe_id: recipeId
    });

    return res.json(newStep)
}



module.exports = {
  recipe_list_get,
  recipe_get,
  recipe_picture_delete,
  recipe_picture_post,
  recipe_post,
  recipe_update,
  recipe_delete,
  recipe_ingredient_update,
  recipe_ingredient_delete,
  recipe_step_update,
  recipe_step_delete,
  recipe_ingredient_add,
  recipe_step_add
};
