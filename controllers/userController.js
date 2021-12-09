'use strict';
const { body, validationResult } = require('express-validator');
// userController
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

const hide_pass = users =>
  users.map(u => {
    console.log(u);
    delete u.dataValues.password;
    return u;
  });

const user_list_get = async (req, res) => {
  const users = await User.findAll();
  res.json(hide_pass(users));
};

const user_get = async (req, res) => {
  let userId = req.params.userId;

  const user = await User.scope('includeRecipes').findOne({ where: { id: userId } });
  //return res.json(hide_pass(user)[0]);

  return res.json(hide_pass([user])[0]);
};

const user_update = async (req, res) => {
  const errors = validationResult(req);
  console.log('UPDATE USER', errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = await userModel.updateUser(req.body, req.user);

  return res.json({ message: 'User updated!' });
};

const checkToken = (req, res, next) => {
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

module.exports = {
  user_list_get,
  user_get,
  user_update,
  checkToken,
};
