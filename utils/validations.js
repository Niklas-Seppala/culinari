'use strict';

const { validationResult } = require('express-validator');
const { Op, Model } = require('sequelize/dist');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const Recipe = require('../models/recipeModel');

const emailUnique = async (email, ownerId) => {
  ownerId = ownerId ? ownerId : -1;
  const match = Boolean(
    await User.findOne({ where: { email: email, id: { [Op.ne]: ownerId } } })
  );
  if (match) throw new Error('Email already taken');
  return email;
};

const nameUnique = async (name, ownerId) => {
  ownerId = ownerId ? ownerId : -1;
  const match = Boolean(
    await User.findOne({ where: { name: name, id: { [Op.ne]: ownerId } } })
  );
  if (match) throw new Error('Username already taken');
  return name;
};

const passwordsMatch = (value, {req}) => {
  if (value !== req.body.password) throw new Error("Passwords don't match");
  else return value;
}

const commentExists = async (value) => {
  const comment = await Comment.findOne({where: {id : value}})
  if (!comment) throw Error('No comment with that id exist')
  return value;
}

/**
 * 
 * @param {[]} value 
 * @param {{min: number, max: number}} options
 */
const arrayOfSize = (value, options) => {
  if (value.length < (options.min || 1))
    throw new Error('Collection has too few items.')

  if (options.max && value.length > options.max)
    throw new Error('Colleaction has too many items.')

  return value;
}

const recipeExists = async (value, res) => {
  const recipe = await Recipe.findOne({where: {id: value}})
  if (!recipe) throw Error('no recipe with that id exists')
  return value
}

const userExist = async (value) => {
  const user = await User.findOne({where: {id: value}})
  if (!user) throw Error('no user with that id exists')
  return value
}

const canLike = async (value, Model, req) => {
  const entry = await Model.findOne({where: {comment_id: value, user_id: req.user.id}})
  if (entry) throw Error('Already liked')
  return value
}

/**
 * Validates request body.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {(Error) => void} next
 * @returns {void}
 */
const solve = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(item => {
        // Delete possible sensitive/useless data.
        delete item.value;
        delete item.location;
        return item;
      }),
    });
  }
  next();
};

module.exports = {
  solve,
  emailUnique,
  nameUnique,
  passwordsMatch,
  commentExists,
  arrayOfSize,
  recipeExists,
  canLike,
  userExist
};
