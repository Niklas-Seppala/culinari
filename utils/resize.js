'use strict';
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

let config = undefined;

const configure = options => {
  config = options;
};

const make = async (src, out, dim) => {
  console.log(out);
  if (config?.srcDir) src = path.join(config.srcDir, src);
  if (config?.outDir) out = path.join(config.outDir, out);
  if (!dim) {
    if (!config) throw 'Thumbnail dimensions missing';
    dim = config.dim;
  }

  const buffer = fs.readFileSync(src);
  await sharp(buffer)
    .resize(dim.x, dim.y)
    .jpeg({
      mozjpeg: true,
      quality: 70,
    })
    .toFile(out);
};

module.exports = { make, configure };