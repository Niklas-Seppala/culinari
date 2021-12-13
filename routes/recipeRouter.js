'use strict';
const express = require('express');
const router = express.Router();
const passport = require('../utils/pass.js');
const recipeController = require('../controllers/recipeController');
const { body } = require('express-validator');
const validation = require('../utils/validations')

// router.route('/').get(recipeController.recipe_list_get);

router.route('/')
    .get(recipeController.get_all)
    .post(
      passport.authenticate('jwt', {session: false}),
      body('name').trim().escape().isLength({min: 2}),
      body('desc').trim().escape().notEmpty().isLength({max: 160}),
      body('ingredients').custom((value) => validation.arrayOfSize(value, {min: 1, max: 15})),
      body('instructions').custom((value) => validation.arrayOfSize(value, {min: 1, max: 15})),
      validation.solve,
      recipeController.post
    )

router.route('/:id')
  .get(recipeController.get_single)


// const { checkRelatedExists } = require('../utils/customValidators.js');


// const multer  = require("multer")
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     console.log("destination", file)
//     cb(null, "./uploads/")
//   },
//   filename: function (req, file, cb) {
//     console.log("filename", file)
//     cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
//   }
// });


// const fileFilter = (req, file, cb) => {
//     const mimeTypes = ["image/jpg", "image/png", "image/jpeg", "image/gif"];
//     const mimetypeIsValid = mimeTypes.includes(file.mimetype);


//     if(!mimetypeIsValid) {
//         console.log("WRONG FILE TYPE!");
//         return cb(null, false);
//     }

//     return cb(null, true);
// };

// const upload = multer({ dest: "./uploads/", 
//     fileFilter: fileFilter,
//     storage: storage
// });



// router.route("/")
//     .get(recipeController.recipe_list_get)
//     .post(
//         passport.authenticate('jwt', { session: false }),
//         body('name').notEmpty().trim().escape(),
//         body('desc').notEmpty().trim().escape(),
//         checkRelatedExists("steps"),
//         checkRelatedExists("ingredients"),
//         recipeController.recipe_post
//     )

// router.route("/:recipeId")
//     .get(recipeController.recipe_get)
//     .put(
//         passport.authenticate('jwt', { session: false }),
//         body('name').notEmpty().trim().escape(),
//         body('desc').notEmpty().trim().escape(),
//         recipeController.recipe_update
//     )
//     .delete(
//         passport.authenticate('jwt', { session: false }),
//         recipeController.recipe_delete
//     )

// // add ingredient to existing recipe
// router.route("/:recipeId/ingredient")
//     .post(
//         passport.authenticate('jwt', { session: false }),
//         body('name').notEmpty().trim().escape(),
//         body('amount').notEmpty().trim().escape(),
//         body('unit').notEmpty().trim().escape(),
//         recipeController.recipe_ingredient_add
//     )

// // add step to existing recipe
// router.route("/:recipeId/step")
//     .post(
//         passport.authenticate('jwt', { session: false }),
//         body('order').notEmpty().trim().escape(),
//         body('content').notEmpty().trim().escape(),
//         recipeController.recipe_step_add
//     )

// router.route("/:recipeId/ingredient/:ingredientId")
//     .put(
//         passport.authenticate('jwt', { session: false }),
//         body('name').notEmpty().trim().escape(),
//         body('amount').notEmpty().trim().escape(),
//         body('unit').notEmpty().trim().escape(),
//         recipeController.recipe_ingredient_update
//     )
//     .delete(
//         passport.authenticate('jwt', { session: false }),
//         recipeController.recipe_ingredient_delete
//     )

// router.route("/:recipeId/step/:stepId")
//     .put(
//         passport.authenticate('jwt', { session: false }),
//         body('order').notEmpty().trim().escape(),
//         body('content').notEmpty().trim().escape(),
//         recipeController.recipe_step_update
//     )
//     .delete(
//         passport.authenticate('jwt', { session: false }),
//         recipeController.recipe_step_delete
//     )




// router.route("/:recipeId/picture")
//     .post(
//         passport.authenticate('jwt', { session: false }),
//         upload.array("pictures", 10),
//         body("pictures").custom((recipe, { req, location, path }) => {
//           return req.file != null;
//         }),
//         recipeController.recipe_picture_post
//     )

// router.route("/:recipeId/picture/:pictureId")
//     .delete(
//         passport.authenticate('jwt', { session: false }),
//         recipeController.recipe_picture_delete
//     )


module.exports = router;

