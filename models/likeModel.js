"use strict";
const {Sequelize, Model} = require("sequelize");
const sequelize = require("../database/sequelize_init.js");


// define the table "like"
class Like extends Model {};
Like.init( {
    recipe_id:{
        type:Sequelize.INTEGER,
        field:"recipe_id",
        allowNull: false
    },
    user_id:{
        type: Sequelize.INTEGER,
        field:"user_id",
        allowNull:false
    }
},
{
    sequelize,
    modelName: sequelize._TABLE_NAME_PREFIX+"like"
}
);

module.exports = Like;