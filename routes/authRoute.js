'use strict';
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, register } = require('../controllers/authController');
const validations = require('../utils/validations');

router.post('/login', body('username').notEmpty(), login);

router.post(
  '/register',
  body('username', 'Minimum of 3 letters')
    .isLength({ min: 3 })
    .custom(async val => await validations.nameUnique(val)),

  body('email', 'Email is not valid')
    .isEmail()
    .custom(async val => await validations.emailUnique(val)),

  body('password', 'The password needs at least one uppercase letter')
    .trim()
    .escape()
    .matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/),

  body('password', 'The password needs at least 8 characters')
    .trim()
    .escape()
    .isLength({ min: 8 }),

  body('confirm').custom(validations.passwordsMatch),

  validations.solve,
  register
);

module.exports = router;
