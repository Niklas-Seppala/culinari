const { unlink } = require('fs');
const path = require('path');

const deletePicturesFromRecipes = (recipes) => {
  const pictures = recipes.flatMap(r => r.dataValues.picture)
  console.log("recipes",recipes);
  console.log(pictures);
  
  // delete the files
  deletePictures(pictures);
}

const deletePictures = (pictures) => {
  pictures.forEach((picture) => {
    console.log("DELETING", picture.dataValues.filename, "FROM RECIPE", picture.dataValues.recipe_id);
    let delPath = path.join('./uploads', path.basename(picture.dataValues.filename))
    unlink(delPath, (err) => {
      if(err) {
        console.log(`Cannot delete picture ${delPath}`, err)

      }
    });
  });
};

module.exports = {
  deletePictures,
  deletePicturesFromRecipes
}