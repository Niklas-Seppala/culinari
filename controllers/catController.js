'use strict';
// catController
const { body, validationResult } = require('express-validator');
const { makeThumbnail } = require('../utils/resize.js');

const path = require('path');

const catModel = require('../models/catModel');

const cat_list_get = async (req, res) => {
  const cats = await catModel.getAllCats();
  res.json(cats);
};

const cat_get = async (req, res) => {
  const catId = req.params.catId;
  const cats = await catModel.getCat(catId);
  return res.json(cats[0]);
};

const cat_post = async (req, res) => {
  const errors = validationResult(req);
  console.log('Adding cat', req.user);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log('Thumbing', req.file, req.file);
  const filepath = req.file.path;
  const thumbpath = req.file.filename;
  makeThumbnail(filepath, thumbpath);

  const cat = await catModel.addCat(req.body, req.file, req.user);
  return res.json({ message: 'New cat added!' });
};

const cat_update = async (req, res) => {
  const errors = validationResult(req);
  console.log('UPDATE CAT', errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const cat = await catModel.updateCat(req.body, req.params, req.user);

  return res.json({ message: 'Cat updated!' });
};

const cat_delete = async (req, res) => {
  console.log(req.params);
  const catId = req.params.catId;
  const cat = catModel.deleteCat(catId, req.user);
  console.log('Deleting cat ' + catId);
  return res.json({ message: 'Cat deleted!' });
};

module.exports = {
  cat_list_get,
  cat_get,
  cat_post,
  cat_update,
  cat_delete,
};
