"use strict";
const {Sequelize, Model} = require("sequelize");
const sequelize = require("../database/sequelize_init.js");


// define the table "step"
class Step extends Model {};
Step.init( {
    order:{
        type:Sequelize.INTEGER,
        field:"order",
        allowNull: false
    },
    content:{
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
  modelName: sequelize._TABLE_NAME_PREFIX+"step"
});

module.exports = Step;