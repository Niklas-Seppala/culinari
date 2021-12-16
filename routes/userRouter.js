'use strict';
const { body, param } = require('express-validator');
const express = require('express');
const passport = require('../utils/pass.js');
const userController = require('../controllers/userController');
const validations = require('../utils/validations');
const router = express.Router();
const files = require('../utils/fileupload.js');

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
      .custom(async (val, { req }) => await validations.nameUnique(val, req.user.id)),

    body('email', 'Email must be valid: foo@bar.com.')
      .trim()
      .escape()
      .isEmail()
      .custom(async (val, { req }) => await validations.emailUnique(val, req.user.id)),

    // body('password', 'Password must be at least 8 letters')
    //   .trim()
    //   .escape()
    //   .isLength({ min: 8 }),

    // body('confirm').custom(validations.passwordsMatch),
    validations.solve,
    userController.user_update
  );

// Public get single user
router
  .route('/:id')
  .get(userController.user_get)

  // admin delete user
  .delete(passport.authenticate('jwt', { session: false }), userController.user_delete);

router.route('/:id/avatar').post(
  passport.authenticate('jwt', { session: false }),
  param('id').custom(async val => await validations.userExist(val)),
  validations.solve,
  files.upload.single('avatar'),
  files.processImages,
  userController.user_img
);

router
  .route('/:id/private')
  .get(
    passport.authenticate('jwt', { session: false }),
    param('id').toInt(),
    userController.user_private_get
  );

router
  .route('/password')
  .put(
    passport.authenticate('jwt', { session: false }),
    body('password', 'Password must be at least 8 letters')
      .trim()
      .escape()
      .isLength({ min: 8 }),

    body('confirm').custom(validations.passwordsMatch),
    validations.solve,
    userController.user_update_password
  );

module.exports = router;
