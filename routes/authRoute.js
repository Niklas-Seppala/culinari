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
    body('email', 'email is not valid').isEmail(),
    body('password', 'at least one upper case letter').matches('(?=.*[A-Z]).{8,}'),
    sanitizeBody('name').escape(),
    sanitizeBody('email').escape(),
  ],
  user_create_post
);

module.exports = router;
