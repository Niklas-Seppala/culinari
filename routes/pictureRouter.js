'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const salt = () => Math.round(Math.random() * 1e9)
const fname = (file) =>
  `${Date.now()}-${salt()}${path.extname(file.originalname)}`

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, fname(file));
  },
});

const fileFilter = (req, file, cb) => {
  const mimeTypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif'];
  const mimetypeIsValid = mimeTypes.includes(file.mimetype);
  if (!mimetypeIsValid) {
    return cb(null, false);
  }
  return cb(null, true);
};

const upload = multer({ dest: './uploads/', fileFilter: fileFilter, storage: storage }).array('files');


module.exports = router;
