'use strict';
const jwt = require('jsonwebtoken');
const passport = require('../utils/pass');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/userModel.js');
const { Op } = require('sequelize');

const login = (req, res) => {
  /* #swagger.parameters['username'] = {in: 'body', example: "password", description: 'The email of the user', type: 'string' } */
  /* #swagger.parameters['password'] = {in: 'body', description: 'The password of the user', type: 'string' } */

  // Validate login attempt.
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: err,
        user: null,
        info: info,
      });
    }

    // Generate a signed json web token for succesful login.
    // Send a response to client with public user data and token.
    req.login(user, { session: false }, err => {
      if (err) next(err);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return res.json({
        name: user.name,
        email: user.email,
        role: user.role,
        score: user.score,
        joined: user.createdAt,
        token: token,
      });
    });
  })(req, res);
};

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const register_post = async (req, res) => {
  // Extract the validation errors from a request.
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log('register error', validationErrors);
    return res.send(validationErrors.array());
  }

  // Check for pre-existing user with same name/email
  const users = await User.findAll({
    where: {
      [Op.or]: { // Single one of these conditions is enough to abort.
        name: req.body.name.toLowerCase(),
        email: req.body.email.toLowerCase(),
      },
    },
  });

  if (users.length > 0) {
    const errors = [];
    users.forEach(usr => {
      // Check if name collides => add name error. One is enough, please.
      if (usr.name === req.body.name && !errors.find(err => err.field === 'name')) {
        errors.push({
          field: 'name',
          error: 'User already exists with that username',
        });
      }
      // Check if email collides => add email error. One is enough, please.
      if (usr.email === req.body.email && !errors.find(err => err.field === 'email')) {
        errors.push({
          field: 'email',
          error: 'User already exists with that email',
        });
      }
    });
    return res.status(400).json({ errors: errors });
  }

  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(req.body.password, salt);
  const newUser = User.create({
    name: req.body.name,
    password: hash,
    email: req.body.email,
    role: 0,
    score: 0,
  });

  if (newUser) {
    return res.json({ msg: `User added` });
  } else {
    return res.status(500).json({ error: 'register error' }); // My bad, not user's.
  }
};

module.exports = {
  login,
  logout,
  register_post,
};
