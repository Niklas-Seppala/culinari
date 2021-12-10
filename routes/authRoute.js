'use strict';
const express = require('express');
const router = express.Router();
const { body, sanitizeBody } = require('express-validator');
const { login, logout, user_create_post } = require('../controllers/authController');

router.post('/login', login);
router.get('/logout', logout);

router.post(
  '/register',
  [
    body('name', 'minimum 3 characters').isLength({ min: 3 }),
    body('username', 'email is not valid').isEmail(),
    body("password", "The password needs at least one uppercase letter").matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/).trim().escape(),
    body("password", "The password needs at least 8 characters").isLength({min: 8}).trim().escape(),
    sanitizeBody('name').escape(),
    sanitizeBody('email').escape(),
  ],
  user_create_post
);

module.exports = router;
