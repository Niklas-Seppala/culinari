'use strict';
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');
const bcryptjs = require('bcryptjs');

const { unlink } = require('fs');
const path = require('path');

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
  
  
  // delete the files itself first
  pictures.forEach((picture) => {
    console.log("DELETING", picture.dataValues.filename, "FROM RECIPE", picture.dataValues.recipe_id);
    let delPath = path.join('./uploads', path.basename(picture.dataValues.filename))
    unlink(delPath, (err) => {
      if(err) {
        console.log(`Cannot delete picture ${delPath}`, err)
      }
    });
  });

  // then delete the user, this deletes all the rest
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

module.exports = {
  user_update,
  user_get,
  users_get,
  user_delete
};
