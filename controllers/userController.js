'use strict';
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');

const user_get = async (req, res) => {
  /* #swagger.parameters['user'] = { 
    in: 'body',
    description: 'User',
    type: 'object',
    schema: { $ref: "#/definitions/user" }
  } */
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: {
        exclude: ['email'],
      },
    });
    if (user) return res.json(user?.dataValues);
    else return res.status(404).json({});
  } catch (error) {
    return res.status(500).json({ msg: 'internal error' });
  }
};

const user_password_update = async (req, res) => {
  /* #swagger.parameters['password'] = { 
    in: 'body',
    description: 'The password',
    schema: { $ref: "#/definitions/password" }
  } */
  /* #swagger.parameters['password2'] = { 
    in: 'body',
    description: 'The password repeated',
    schema: { $ref: "#/definitions/password" }
  } */

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(item => {
        // Get rid of the plain text passwords, for god's sake :D
        delete item.value;
        delete item.location;
        return item;
      }),
    });
  }

  try {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);
    await User.update(
      { password: hash },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    return res.json({ msg: 'success' });
  } catch (error) {
    return res.status(500).json({ msg: 'internal server error' });
  }
};

const user_update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ errors: ['User not found!'] });
    }
    const changes = {
      name: req.body.username,
      email: req.body.email,
    };
    await User.update(changes, {
      where: { id: req.user.id },
    });
    return res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};

const users_get = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['email'],
      },
    });
    res.json(users || []);
  } catch (error) {
    return res.status(500).json([]);
  }
};

module.exports = {
  user_update,
  user_password_update,
  user_get,
  users_get,
};
