'use strict';
const express = require('express');
const router = express.Router();
const passport = require('../utils/pass.js');
const recipeController = require('../controllers/recipeController');
const { body, param } = require('express-validator');
const validation = require('../utils/validations');
const files = require('../utils/fileupload.js');

router
  .route('/')
  .get(recipeController.get_all)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('name').trim().escape().isLength({ min: 2 }),
    body('desc').trim().escape().notEmpty().isLength({ max: 160 }),
    body('ingredients.*.name').trim().escape().notEmpty(),
    body('ingredients.*.unit').trim().escape().notEmpty(),
    body('ingredients').custom(value =>
      validation.arrayOfSize(value, { min: 1, max: 15 })
    ),
    body('instructions.*.content').trim().escape().notEmpty(),
    body('instructions').custom(value =>
      validation.arrayOfSize(value, { min: 1, max: 15 })
    ),
    validation.solve,
    recipeController.post
  );

router
  .route('/:id')
  .get(recipeController.get_single)

  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').custom(async val => await validation.recipeExists(val)),
    body('name').trim().escape().isLength({ min: 2 }),
    body('desc').trim().escape().notEmpty().isLength({ max: 160 }),
    body('ingredients.*.name').trim().escape().notEmpty(),
    body('ingredients.*.unit').trim().escape().notEmpty(),
    body('ingredients').custom(value =>
      validation.arrayOfSize(value, { min: 1, max: 15 })
    ),
    body('instructions.*.content').trim().escape().notEmpty(),
    body('instructions').custom(value =>
      validation.arrayOfSize(value, { min: 1, max: 15 })
    ),
    validation.solve,
    recipeController.put
  )

  .delete(passport.authenticate('jwt', { session: false }), recipeController.del);

router
  .route('/:id/like')
  .post(
    passport.authenticate('jwt', { session: false }),
    param('id').custom(async (val) => await validation.recipeExists(val)),
    validation.solve,
    recipeController.post_like
  )

router.route('/:id/img')
  .post(
    passport.authenticate('jwt', {session: false}),
    param('id').custom(async (val) => await validation.recipeExists(val)),
    validation.solve,
    files.upload,
    files.processImages,
    recipeController.post_img)

module.exports = router;
