'use strict';
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.route('/').get(recipeController.recipe_list_get);

router.route('/:recipeId').get(recipeController.recipe_get);
module.exports = router;
