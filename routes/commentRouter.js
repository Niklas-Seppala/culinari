'use strict';
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const validation = require('../utils/validations');
const { body } = require('express-validator');
const passport = require('../utils/pass.js');

router
  .route('/')
  .get(commentController.get_all)
  .post(
    passport.authorize('jwt', { session: false }),
    body('text').trim().escape().notEmpty(),
    body('recipe')
      .trim()
      .escape()
      .isNumeric()
      .custom(async value => await validation.commentExists(value)),
    validation.solve,
    commentController.post
  );

router
  .route('/:id')
  .get(commentController.get_single)
  .put(
    passport.authorize('jwt', { session: false }),
    body('text').trim().escape().notEmpty(),
    body('recipe').trim().escape().isNumeric(),
    validation.solve,
    commentController.put
  );

module.exports = router;
