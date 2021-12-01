"use strict";
const {Sequelize, Model} = require("sequelize");
const sequelize = require("../database/sequelize_init.js");


// define the table "ingredient"
class Ingredient extends Model {};
Ingredient.init( {
    name:{
        type:Sequelize.STRING,
        field:"name",
        allowNull: false
    },
    amount:{
        type:Sequelize.FLOAT,
        field:"amount",
        allowNull: false
    },
    unit:{
        type:Sequelize.STRING,
        field:"unit"
    },
    recipe_id:{
        type:Sequelize.INTEGER,
        field:"recipe_id",
        allowNull: false
    }
}, 
{
  sequelize,
  modelName: "ingredient"
});

module.exports = Ingredient;