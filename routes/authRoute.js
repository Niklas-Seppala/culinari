'use strict';
const express = require('express');
const router = express.Router();
const { body, sanitizeBody } = require('express-validator');
const { login, register } = require('../controllers/authController');

router.post('/login', body("username").notEmpty(), login);

router.post(
  '/register',
  [
    body('username', 'Minimum of 3 letters').isLength({ min: 3 }),
    body('email', 'Email is not valid').isEmail(),
    body("password", "The password needs at least one uppercase letter").trim().escape().matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/),
    body("password", "The password needs at least 8 characters").trim().escape().isLength({min: 8}),
    body('confirm').custom((value,{ req }) => {
      if (value !== req.body.password) throw new Error("Passwords don't match");
      else return value;
    }),
    sanitizeBody('name').escape(),
  ],
  register
);

module.exports = router;
