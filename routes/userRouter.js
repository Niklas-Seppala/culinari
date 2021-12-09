'use strict';
// catRoute

const { body, validationResult } = require('express-validator');

const express = require('express');
const router = express.Router();
const passport = require('../utils/pass.js');

const userController = require('../controllers/userController');

router.route('/')
    .put(
        passport.authenticate('jwt', { session: false }),
        body("name").isLength({min: 3}).trim().escape(),
        body("email").isEmail().trim().escape(),
        userController.user_update
    )
router.route('/password')
    .put(
        passport.authenticate('jwt', { session: false }),
        body("password", "The password needs at least one uppercase letter").matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/).trim().escape(),
        body("password").isLength({min: 8}).trim().escape(),
        userController.user_password_update
    )

router.get('/token', userController.checkToken);
router.route('/:userId').get(userController.user_get);

module.exports = router;
