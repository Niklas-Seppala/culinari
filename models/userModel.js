  'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');

const fkName = require('../utils/fkName.js');
const Recipe = require('../models/recipeModel');
const Comment = require('./commentModel')
const CommentLike = require('./commentLike')

// define the table "user"
class User extends Model {}
User.init(
  {
    name: {
      type: Sequelize.STRING,
      field: 'name',
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      field: 'password',
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      field: 'email',
      unique: true,
      allowNull: false,
    },
    role: {
      type: Sequelize.INTEGER,
      field: 'role',
      allowNull: false,
    },
    score: {
      type: Sequelize.INTEGER,
      field: 'score',
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
      field: 'avatar',
      allowNull: true
    }
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: sequelize._TABLE_NAME_PREFIX + 'user',
    defaultScope: {
      attributes: { exclude: ['password', 'updatedAt', 'createdAt'] },
    },
  }
);

User.prototype.isAdmin = function() {
  let values = Object.assign({}, this.get());
  console.log(values);
};

User.addScope('includeRecipesSecret', {
  attributes: {
    exclude: ['password'],
  },
  include: [
    {
      attributes: {
        include: ['text', 'id'],
      },
      model: Comment,
      as: fkName(Comment),
    },
    {
      attributes: {
        include: ['name', 'desc', 'owner_id', 'forked_from',],
      },
      model: Recipe,
      as: fkName(Recipe),
    },
  ],
});

User.addScope('includeRecipes', {
  attributes: {
    exclude: ['password', 'email'],
  },
  include: [
    {
      attributes: {
        include: ['name', 'desc', 'owner_id', 'forked_from'],
      },
      model: Recipe,
      as: fkName(Recipe),
    },
  ],
});

User.addScope('includePassword', {
  include: [
    {
      attributes: {
        include: ['password'],
      },
    },
  ],
});

module.exports = User;
