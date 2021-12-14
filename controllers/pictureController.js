'use strict';
const Picture = require('../models/pictureModel.js');

const picture_list_get = async (req, res) => {};
const picture_get = async (req, res) => {};
const picture_post = async (req, res) => {};
const picture_delete = async (req, res) => {};

// const recipe_picture_post = async (req, res) => {
//     const recipeId = req.params.recipeId;
//     let recipe = await Recipe.scope('includeForeignKeys').findOne({
//       where: { id: recipeId, owner_id: req.user.id },
//     });

//     if (!recipe) {
//         return res.status(404).json({errors: ["Recipe not found"]});
//     }
//     console.log(req);
//     // handle the pictures
//     if(req.files.length > 0) {

//         // get the amount of pre-existing pictures for the order numbers
//         const pictureCount = recipe.pictures.length;
//         let pictures = [];

//         req.files.forEach((file, index) => {
//             console.log(index)
//             pictures.push(
//                 {
//                     recipe_id: recipe.id,
//                     filename: file.path,
//                     order: pictureCount+index+1
//                 }
//             )
//         });

//         await Picture.bulkCreate(pictures);

//         return res.json(recipe);
//     }
//     await Picture

// };

// const recipe_picture_delete = async (req, res) => {
//     const recipeId = req.params.recipeId;
//     const pictureId = req.params.pictureId;
//     let recipe = await Recipe.scope('includeForeignKeys').findOne({
//       where: { id: recipeId, owner_id: req.user.id },
//     });

//     if (!recipe) {
//         return res.status(404).json({errors: ["Recipe not found"]});
//     }

//     const picture = await Picture.findOne({
//         where: {id: pictureId, recipe_id: recipeId}
//     });

//     if(!picture) {
//         return res.status(404).json({errors: ["Picture not found"]});
//     }

//     // delete the file itself first
//     unlink(picture.dataValues.filename, (err) => {
//         if(err) {
//             throw err;
//         }
//     });

//     // delete the database entry
//     await picture.destroy();

//     return res.json({msg: "Picture deleted succesfully"});
// }

module.exports = {
  picture_list_get,
  picture_get,
  picture_post,
  picture_delete,
};
