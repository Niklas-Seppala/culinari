"use strict";
// catRoute

const { body, validationResult } = require("express-validator");



const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/")
    .get(userController.user_list_get)
    /*.put(
        body("name").isLength({min: 3}).trim().escape(),
        body("email").isEmail().trim().escape(),
        body("passwd").matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/).trim().escape(),
        body("passwd").isLength({min: 8}).trim().escape(),
        userController.user_update
    )
    .delete((req, res) => {
        res.send("With this endpoint you can delete users.");
    });*/
    
router.get("/token", userController.checkToken);
router.route("/:userId").get(userController.user_get)


module.exports = router