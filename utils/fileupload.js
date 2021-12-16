'use strict';
const multer = require('multer');
const path = require('path');
const resize = require('../utils/resize');

const salt = () => Math.round(Math.random() * 1e9);
const fname = file => `${Date.now()}-${salt()}${path.extname(file.originalname)}`;

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

const upload = multer({
  dest: './uploads/',
  fileFilter: fileFilter,
  storage: storage,
});

const processImages = async (req, res, next) => {
  try {
    if (req.files) {
      console.log(req.files);
      req.files?.forEach(async file => {
        await resize.make(file.filename, path.basename(file.filename));
      });
    } else {
      console.log(req.file);
      await resize.make(req.file.filename, path.basename(req.file.filename));
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, processImages };
