'use strict';
const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

const recipeController = require('../controllers/recipeController');

router.route('/').get(recipeController.recipe_list_get);


const passport = require('../utils/pass.js');
const { checkRelatedExists } = require('../utils/customValidators.js');


const cors = require("cors");

const multer  = require("multer")
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("destination", file)
    cb(null, "./uploads/")
  },
  filename: function (req, file, cb) {
    console.log("filename", file)
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
});


const fileFilter = (req, file, cb) => {
    const mimeTypes = ["image/jpg", "image/png", "image/jpeg", "image/gif"];
    const mimetypeIsValid = mimeTypes.includes(file.mimetype);


    if(!mimetypeIsValid) {
        console.log("WRONG FILE TYPE!");
        return cb(null, false);
    }

    return cb(null, true);
};

const upload = multer({ dest: "./uploads/", 
    fileFilter: fileFilter,
    storage: storage
});



router.route("/")
    .get(recipeController.recipe_list_get)
    .post(
        passport.authenticate('jwt', { session: false }),
        body('name').notEmpty().trim().escape(),
        body('desc').notEmpty().trim().escape(),
        checkRelatedExists("steps"),
        checkRelatedExists("ingredients"),
        recipeController.recipe_post
    )

router.route("/:recipeId")
    .get(recipeController.recipe_get)
    .delete(
        passport.authenticate('jwt', { session: false }),
        recipeController.recipe_delete
    )


router.route("/:recipeId/picture")
    .post(
        passport.authenticate('jwt', { session: false }),
        upload.array("pictures", 10),
        body("pictures").custom((recipe, { req, location, path }) => {
          return req.file != null;
        }),
        recipeController.recipe_picture_post
    )


module.exports = router;

