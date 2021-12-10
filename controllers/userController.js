'use strict';
const { body, validationResult } = require('express-validator');
// userController
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

const bcryptjs = require('bcryptjs');




const hide_pass = users =>
  users.map(u => {
    console.log(u);
    delete u.dataValues.password;
    return u;
  });

const user_list_get = async (req, res) => {
  /* #swagger.parameters['user'] = { 
         in: 'body',
         description: 'an array of users',
         type: 'object',
         schema: [{$ref: "#/definitions/user"}]
  } */
  const users = await User.findAll();
  res.json(hide_pass(users));
};

const user_get = async (req, res) => {
  /* #swagger.parameters['user'] = { 
         in: 'body',
         description: 'User',
         type: 'object',
         schema: { $ref: "#/definitions/user" }
  } */

  let userId = req.params.userId;

  const user = await User.scope('includeRecipes').findOne({ where: { id: userId } });
  //return res.json(hide_pass(user)[0]);

  return res.json(hide_pass([user])[0]);
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
  console.log('UPDATE USER PASSWORD', errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({where: {id: req.user.dataValues.id}});

  if(req.body.password != req.body.password2) {
    return res.status(400).json({errors: ["Passwords don't match"]});
  }

  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(req.body.password, salt);

  await User.update(
    {
      password: hash
    }, 
    {
      where: {
          id: req.user.dataValues.id
        }
    }
  );

  return res.json({msg: "Password changed succesfully"});

}

const user_update = async (req, res) => {
  const errors = validationResult(req);
  console.log('UPDATE USER', errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findOne({where: {id: req.user.dataValues.id}});

  if(!user) {
    return res.status(404).json({errors: ["User not found!"]});
  }

  await User.update(
    {
      name: req.body.name,
      email: req.body.email
    }, 
    {
      where: {
        id: req.user.dataValues.id
      }}
  );

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
  user_password_update,
  checkToken,
};
