"use strict";
const db = require("../database/db.js");
const Sequelize = require("Sequelize");


// define the table "picture"
const Picture = db.define("picture", {
    name: {
        type:Sequelize.STRING(),
        field: "name",
        allowNull: false
    }

    recipe_id: {
        type: Sequelize.INTEGER(),
        field: "recipe_id",
        allowNull: false
    }
    filename: {
        type: Sequelize.STRING(),
        field: "filename",
        allowNull: false
    }
    order: {
        type: Sequelize.INTEGER(),
        field: "order",
        allowNull: false
    }

});

module.export = Picture;