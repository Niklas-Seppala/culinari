"use strict";
const db = require("../database/db.js");
const Sequelize = require("Sequelize");


// define the table "comment"
const Comment = db.define("comment", {
    recipe_id: {
        type: Sequelize.INTEGER(),
        field: "recipe_id",
        allowNull: false
    }
    author_id: {
        type: Sequelize.INTEGER(),
        field: "author_id",
        allowNull: false
    }
    text: {
        type: Sequelize.STRING(),
        field: "text",
        allowNull: false
    }
})

module.export = Comment
