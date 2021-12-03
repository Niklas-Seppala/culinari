"use strict";

const Recipe = require("../models/recipeModel.js");
const Picture = require("../models/pictureModel.js");

/**
    Gets the list of recipes
*/
const recipe_list_get = async (req, res) => {
    // TODO: add pagination
    const recipes = await Recipe.scope("includePictures").findAll();
    return res.json(recipes);
};


const recipe_get = async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipe = await Recipe.scope("includePictures").findOne(
        {where: {id: recipeId}}
    );
    console.log("recipeId", recipeId);
    console.log("recipe", recipe);
    return res.json(recipe);
};


const recipe_post = async (req, res) => {

};


const recipe_update = async (req, res) => {

};


const recipe_delete = async (req, res) => {

};




module.exports = {
  recipe_list_get,
  recipe_get,
  recipe_post,
  recipe_update,
  recipe_delete
};