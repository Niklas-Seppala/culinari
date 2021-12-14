'use strict';
const { Sequelize, Model } = require('sequelize');
const sequelize = require('../database/sequelize_init.js');

// define the table "like"
class CommentLike extends Model {}
CommentLike.init(
  {
    comment_id: {
      type: Sequelize.INTEGER,
      field: 'comment_id',
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      field: 'user_id',
      allowNull: false,
    },
  },
  {
    sequelize,
    freezeTableName: true,
    modelName: sequelize._TABLE_NAME_PREFIX + 'commentLike',
  }
);

module.exports = CommentLike;
