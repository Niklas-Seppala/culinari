"use strict";
const db = require("../database/db.js");
const Sequelize = require("Sequelize");


// define the table "recipe"
const Recipe = db.define("recipe", {
    name: {
        type:Sequelize.STRING(),
        field: "name",
        allowNull: false
    }
    desc: {
        type:Sequelize.STRING(),
        field: "desc",
        allowNull: false
    }
    date: {
        type:Sequelize.BIGINT(),
        field: "date",
        allowNull: false
    }
    owner: {
        type:Sequelize.INT(),
        field: "owner",
        allowNull: false
    }
    forked_from: {
        type:Sequelize.INT(),
        field: "forked_from"
    }
});

module.export = Recipe;
