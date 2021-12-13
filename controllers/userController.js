'use strict';
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

const user_update = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ errors: ['User not found!'] });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);
    const changes = {
      name: req.body.username,
      email: req.body.email,
      password: hash,
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

const users_get = async (req, res) => {
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
  user_get,
  users_get,
};
