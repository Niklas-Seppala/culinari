"use strict";
const {Sequelize, Model} = require("sequelize");
const sequelize = require("../database/sequelize_init.js");


// define the table "comment"
class Comment extends Model {};
Comment.init( {
    recipe_id: {
        type: Sequelize.INTEGER,
        field: "recipe_id",
        allowNull: false
    },
    author_id: {
        type: Sequelize.INTEGER,
        field: "author_id",
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        field: "text",
        allowNull: false
    }
}, 
{
  sequelize,
  modelName: "comment"
});

module.exports = Comment;
