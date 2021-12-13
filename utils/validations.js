'use strict';

const { validationResult } = require('express-validator');
const { Op } = require('sequelize/dist');
const User = require('../models/userModel');

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
  passwordsMatch
};