'use strict';
const jwt = require('jsonwebtoken');
const passport = require('../utils/pass');
const bcryptjs = require('bcryptjs');
const User = require('../models/userModel.js');
const Recipe = require('../models/recipeModel');

const login = (req, res) => {
  /* #swagger.parameters['username'] = {in: 'body', example: "password", description: 'The name of the user (e.g. "Markku23", type: 'string' } */
  /* #swagger.parameters['password'] = {in: 'body', description: 'The password of the user', type: 'string' } */

  // Validate login attempt.
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        errors: [
          {
            param: 'password',
            msg: info.message,
          },
        ],
      });
    }

    // Generate a signed json web token for succesful login.
    // Bundle user's own recipes into response
    // Send a response to client with public user data and token.
    req.login(user, { session: false }, async err => {
      if (err) next(err);
      const recipes = await Recipe.scope('includeForeignKeys').findAll({ where: {owner_id: user.id} });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return res.json({ ...user, recipes: recipes, token: token });
    });
  })(req, res);
};

const register = async (req, res) => {
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(req.body.password, salt);
  const newUser = User.create({
    name: req.body.username,
    password: hash,
    email: req.body.email,
    role: 0,
    score: 0,
  });
  if (newUser) {
    return res.json({ msg: `success` });
  } else {
    return res.status(500).json({ error: 'register error' });
  }
};

module.exports = {
  login,
  register,
};
