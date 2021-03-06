'use strict';
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const validation = require('../utils/validations');
const { body, param } = require('express-validator');
const passport = require('../utils/pass.js');

router
  .route('/')
  .get(commentController.get_all)
  .post(
    passport.authenticate('jwt', { session: false }),
    body('text').trim().escape().notEmpty(),
    body('recipe')
      .trim()
      .escape()
      .isNumeric()
      .custom(async value => await validation.recipeExists(value)),
    validation.solve,
    commentController.post
  );

router
  .route('/:id')
  .get(
    param('id').custom(async val => await validation.commentExists(val)),
    validation.solve,
    commentController.get_single
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    param('id').custom(async val => await validation.commentExists(val)),
    body('text').trim().escape().notEmpty(),
    validation.solve,
    commentController.put
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    param('id').custom(async val => await validation.commentExists(val)),
    validation.solve,
    commentController.del)

router.route('/:id/like')
  .post(
    passport.authenticate('jwt', { session: false }),
    param('id').custom(async (val) => await validation.commentExists(val)),
    validation.solve,
    commentController.post_like
  )

module.exports = router;
