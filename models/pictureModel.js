"use strict";
const {Sequelize, Model} = require("sequelize");
const sequelize = require("../database/sequelize_init.js");


// define the table "picture"
class Picture extends Model {};
Picture.init( {
    name: {
        type:Sequelize.STRING,
        field: "name",
        allowNull: false
    },
    recipe_id: {
        type: Sequelize.INTEGER,
        field: "recipe_id",
        allowNull: false
    },
    filename: {
        type: Sequelize.STRING,
        field: "filename",
        allowNull: false
    },
    order: {
        type: Sequelize.INTEGER,
        field: "order",
        allowNull: false
    }

}, 
{
  sequelize,
  modelName: "picture"
});

module.exports = Picture;