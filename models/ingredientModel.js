"use strict";
const db = require("../database/db.js");
const Sequelize = require("Sequelize");

// define the table "ingredient"
const Ingredient = db.define("ingredient", {
    name:{
        type:Sequelize.STRING(),
        field:"name",
        allowNull: false
    }
    amount:{
        type:Sequelize.FLOAT(),
        field:"amount",
        allowNull: false
    }
    unit:{
        type:Sequelize.STRING(),
        field:"unit"
    }
    recipe_id:{
        type:Sequelize.INTEGER(),
        field:"recipe_id",
        allowNull: false
    }
}

module.export = Ingredient;