'use strict';
const { body } = require('express-validator');
const express = require('express');
const passport = require('../utils/pass.js');
const userController = require('../controllers/userController');
const validations = require('../utils/validations');
const router = express.Router();

router
  // Public get all users
  .route('/')
  .get(userController.users_get)

  // Private update
  .put(
    passport.authenticate('jwt', { session: false }),

    body('username', 'Username must be at least 3 letters.')
      .trim()
      .escape()
      .isLength({ min: 3 })
      .custom(async (val, {req}) => await validations.nameUnique(val, req.user.id)),

    body('email', 'Email must be valid: foo@bar.com.')
      .trim()
      .escape()
      .isEmail()
      .custom(async (val, {req}) => await validations.emailUnique(val, req.user.id)),

    body('password', 'Password must be at least 8 letters')
      .trim()
      .escape()
      .isLength({ min: 8 }),

    body('confirm').custom(validations.passwordsMatch),

    validations.solve,
    userController.user_update
  );

// Public get single user
router.route('/:id').get(userController.user_get);

module.exports = router;
