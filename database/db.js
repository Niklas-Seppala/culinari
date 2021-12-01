"use strict"

//db.sync();
const sequelize = require("./sequelize_init.js");
console.log("ASSOCIATE")

//const Comment = require("../models/commentModel.js");
//const Ingredient = require("../models/ingredientModel.js");
//const Picture = require("../models/pictureModel.js");


//Recipe.belongsTo(User);



const Recipe = require("../models/recipeModel.js");
const User = require("../models/userModel.js");
const Comment = require("../models/commentModel.js");
const Like = require("../models/likeModel.js");
const Picture = require("../models/pictureModel.js");
const Ingredient = require("../models/ingredientModel.js");
console.log("Recipe is:", Recipe)

// define relations
User.hasMany(Recipe, {foreignKey: "owner_id"});
User.hasMany(Comment, {foreignKey: "user_id"});
User.hasMany(Like, {foreignKey: "user_id"});

Recipe.hasMany(Ingredient, {foreignKey: "recipe_id"});
Recipe.hasMany(Picture, {foreignKey: "recipe_id"});

sequelize.sync({force: process.env.}).then(() => {
    console.log("DATABASE SYNCED");
});


module.exports = {
    User,
    Recipe,
    Comment,
    Like,
    Picture,
    Ingredient
}