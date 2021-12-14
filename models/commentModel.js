'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');

const fkName = require('../utils/fkName');
const CommentLike = require('./commentLike.js');

// define the table "comment"
class Comment extends Model {}
Comment.init(
  {
    recipe_id: {
      type: Sequelize.INTEGER,
      field: 'recipe_id',
      allowNull: false,
    },
    author_id: {
      type: Sequelize.INTEGER,
      field: 'author_id',
      allowNull: false,
    },
    text: {
      type: Sequelize.STRING,
      field: 'text',
      allowNull: false,
    },
  },
  {
    defaultScope: {
      include: [
        {
          attributes: ['id', 'user_id'],
          model: CommentLike,
          as: fkName(CommentLike),
        },
      ]
    },
    sequelize,
    freezeTableName: true,
    modelName: sequelize._TABLE_NAME_PREFIX + 'comment',
  }
);

module.exports = Comment;
