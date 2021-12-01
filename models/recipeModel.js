"use strict";
const {Sequelize, Model} = require("sequelize");
const sequelize = require("../database/sequelize_init.js");

// define the table "recipe"
class Recipe extends Model {};
Recipe.init( {
    name: {
        type:Sequelize.STRING,
        field: "name",
        allowNull: false
    },
    desc: {
        type:Sequelize.STRING,
        field: "desc",
        allowNull: false
    },
    owner: {
        type:Sequelize.INTEGER,
        field: "owner_id",
        allowNull: false
    },
    forked_from: {
        type:Sequelize.INTEGER,
        field: "forked_from"
    }
}, 
{
  sequelize,
  modelName: "recipe"
});


module.exports = Recipe;
