"use strict";
// catRoute

const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");


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

const catController = require("../controllers/catController");

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
    .get(catController.cat_list_get)
    .post(
        upload.single("cat"),
        body("cat").custom((cat, {req, location, path}) => {
            return req.file != null
        }),
        body("name").notEmpty().trim().escape(),
        body("birthdate").isDate().trim().escape(),
        body("weight").isNumeric().trim().escape(),
        catController.cat_post
    )

router.route("/:catId")
    .get(catController.cat_get)
    .delete(catController.cat_delete)
    .put(
        body("name").notEmpty().trim().escape(),
        body("birthdate").isDate().trim().escape(),
        body("weight").isNumeric().trim().escape(),
        catController.cat_update
    );

module.exports = router
