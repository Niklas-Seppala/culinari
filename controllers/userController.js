'use strict';
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const bcryptjs = require('bcryptjs');
const { deletePicturesFromRecipes } = require('../utils/deletePictures');

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
    if (user) return res.json(user.dataValues);
    else return res.status(404).json({});
  } catch (error) {
    return res.status(500).json({ msg: 'internal error' });
  }
};

const user_private_get = async (req, res) => {
  console.log(req.params.id, req.user.id)
  try {
    if (req.params.id !== req.user.id) 
      return res.status(403).json({errors: [{msg: 'forbidden'}]})

    const user = await User.scope('includeRecipes').findOne({
      where: { id: req.user.id },
    });
    if (user) return res.json(user.dataValues);
    else return res.status(404).json({});
  } catch (error) {
    return res.status(500).json({ msg: 'internal error' });
  }
};

const user_update_password = async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(req.body.password, salt);
    await User.update({ password: hash }, { where: { id: req.user.id } });
    return res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
}

const user_update = async (req, res) => {
  try {
    const changes = {
      name: req.body.username,
      email: req.body.email,
    };
    await User.update(changes, { where: { id: req.user.id } });
    return res.json({ msg: 'success' });
  } catch (error) {
    console.log(error);
    res.status(500).json('Internal server error');
  }
};

const user_delete = async (req, res) => {
  console.log(req.params)
  if(req.user.role != 1) {
    return res.status(403).json({errors:[{msg: 'Not allowed'}]});
  }
  const user = await User.findOne({where: {id: req.params.id}});

  if(!user) {
    return res.status(404).json({errors: [{msg: 'User not found'}]})
  }
  // We want to delete the picture files from the user, so fetch the pictures the user has uploaded from the recipes
  const recipes = await Recipe.scope('includeForeignKeys').findAll({where: {owner_id: req.params.id}});
  
  const pictures = recipes.flatMap(r => r.dataValues.picture)
  console.log("recipes",recipes);
  console.log(pictures);
  deletePicturesFromRecipes(recipes);

  // then delete the user, this deletes all the rest of the things related to them
  try {
    await User.destroy({where: {id: user.dataValues.id}});
  } catch (error) {
    return res.status(500).json({ msg: 'internal error' });
  }

  return res.json({msg: 'Ok'});
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

const user_img = async (req, res, next) => {
  try {
    await User.update({ avatar: req.file.filename}, { where: { id: req.user.id } })
    res.json({msg: 'ok'})
  } catch (err) {
    next(err)
  }
}

module.exports = {
  user_update,
  user_get,
  user_private_get,
  users_get,
  user_delete,
  user_img,
  user_update_password
};
