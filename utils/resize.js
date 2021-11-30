"use strict";
const sharp = require("sharp");

const path = require("path");

const makeThumbnail = async (file, thumbname) => { // file = full path to image (req.file.path), thumbname = filename (req.file.filename)
  // TODO: use sharp to create a png thumbnail of 160x160px, use async await

  console.log("makeThumbnail", "file"+file, "thumbname"+thumbname);
  const thumb = await sharp(file)
                  .resize(160, 160)
                  .toFile(path.join("thumbnails", thumbname), (err, info) => {
                    console.log(err, info);
                  });
    };

module.exports = {
  makeThumbnail,
};