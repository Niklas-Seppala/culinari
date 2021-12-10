'use strict';
const { body } = require('express-validator');
const express = require('express');
const passport = require('../utils/pass.js');
const userController = require('../controllers/userController');

const router = express.Router();

router
// Public get all users
  .route('/')
  // Private update name and email
  .get(userController.users_get)
  .put(
    passport.authenticate('jwt', { session: false }),
    body('username', 'Username must be atleast 3 letters.')
      .trim()
      .escape()
      .isLength({ min: 3 }),
    body('email', 'Email must be valid: foo@bar.com').trim().escape().isEmail(),
    userController.user_update
  );

// Private update password.
router.route('/password').put(
  passport.authenticate('jwt', { session: false }),
  body('password', 'Password needs at least one uppercase letter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/)
    .trim()
    .escape(),
  body('password', 'Password must be atleats 8 letters')
    .trim()
    .escape()
    .isLength({ min: 8 }),

  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error("Passwords don't match");
    else return value;
  }),
  userController.user_password_update
);

// Public get single user
router.route('/:id').get(userController.user_get);

module.exports = router;
