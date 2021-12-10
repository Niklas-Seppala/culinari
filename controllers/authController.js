'use strict';
const jwt = require('jsonwebtoken');
const passport = require('../utils/pass');
const bcryptjs = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User  = require('../models/userModel.js');

require('dotenv').config({ path: '../.env' });

const login = (req, res) => {
    /* #swagger.parameters['username'] = {in: 'body', example: "password", description: 'The email of the user', type: 'string' } */
    /* #swagger.parameters['password'] = {in: 'body', description: 'The password of the user', type: 'string' } */ 

    passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(err, user, info);

    if (err || !user) {
      return res.status(400).json({
        message: err,
        user: user,
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        next(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ user: user, token: token });
    });
  })(req, res);
};

const logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

const user_create_post = async (req, res, next) => {
  // Extract the validation errors from a request.
  const errors = validationResult(req); // TODO require validationResult, see userController

  if (!errors.isEmpty()) {
    console.log('user create error', errors);
    return res.send(errors.array());
  } else {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);

    const users = await User.findAll({
      where: {
        name: req.body.name.toLowerCase(),
        email: req.body.email.toLowerCase()
      }
    });
    console.log("users", users)
    if(users.length > 0) {
      return res.status(400).json({errors: ["User already exists with this email"]});
    } 

    const newUser = User.create({
      name: req.body.name,
      password: hash,
      email: req.body.email,
      role: 0,
      score: 0,
    });



    if (newUser) {
      return res.json({ msg: `User added`});
    } else {
      return res.status(400).json({ error: 'register error' });
    }
  }
};

module.exports = {
  login,
  logout,
  user_create_post,
};
