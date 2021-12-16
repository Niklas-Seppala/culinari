'use strict';

//db.sync();
const sequelize = require('./sequelize_init.js');
const faker = require('faker');

console.log('ASSOCIATE');

//const Comment = require("../models/commentModel.js");
//const Ingredient = require("../models/ingredientModel.js");
//const Picture = require("../models/pictureModel.js");

//Recipe.belongsTo(User);

const fkName = require('../utils/fkName.js');
const Picture = require('../models/pictureModel.js');
const Recipe = require('../models/recipeModel.js');
const User = require('../models/userModel.js');
const Comment = require('../models/commentModel.js');
const Like = require('../models/likeModel.js');
const Ingredient = require('../models/ingredientModel.js');
const RecipeIngredient = require('../models/recipeIngredientModel.js');
const Step = require('../models/stepModel.js');
const CommentLike = require('../models/commentLike')

// define relations
User.hasMany(Recipe, { as: fkName(Recipe), foreignKey: 'owner_id' });
User.hasMany(Comment, { as: fkName(Comment), foreignKey: 'author_id' });
User.hasMany(Like, { as: fkName(Like), foreignKey: 'user_id' });

//many-to-many relationship between ingredient and recipe
Recipe.belongsToMany(Ingredient, {as: fkName(Ingredient), through: RecipeIngredient});
Ingredient.belongsToMany(Recipe, {as: fkName(Recipe),  through: RecipeIngredient});

Recipe.hasMany(Picture, { as: fkName(Picture), foreignKey: 'recipe_id' });
Recipe.hasMany(Step, { as: fkName(Step), foreignKey: 'recipe_id' });
Recipe.hasMany(Comment, { as: fkName(Comment), foreignKey: 'recipe_id' });
Recipe.hasMany(Like, {as: fkName(Like), foreignKey: 'recipe_id'});
Comment.hasMany(CommentLike, {as: fkName(CommentLike), foreignKey: 'comment_id'});

Recipe.hasMany(Recipe, {
 as: 'fork', // special case, don't use fkName() as its a self-referential relationship
 foreignKey: 'forked_from'
});

const forceUpdate = process.env.DB_FORCE_UPDATE == 1;
const alterUpdate = process.env.DB_ALTER_UPDATE == 1;

const sync = async () => {
  sequelize.sync({ force: forceUpdate, alter: alterUpdate }).then(async () => {
    if (forceUpdate) {
      console.log('FORCED UPDATE');
      // load test picture names
      const bcryptjs = require('bcryptjs');
      const fs = require('fs');

      const testPictures = fs.readdirSync('./testdata/food_pics', (err, files) => {
        return files;
      });

      // db is empty, insert fake data for testing/presentation purposes
      const admin_user = await User.create({
        name: 'Leevi the Admin',
        email: 'leevipp+admin@metropolia.fi', //test data, doesn't matter
        password: bcryptjs.hashSync('password', 10), //test data, doesn't matter
        role: 1,
        score: 0,
      });

      // add fake users
      for (var i = 0; i < 10; i++) {
        const user = await User.create({
          name: faker.name.findName(),
          email: faker.internet.email(), //test data, doesn't matter
          password: bcryptjs.hashSync('password', 10), //test data, doesn't matter
          role: 0,
          score: 0,
        });
        console.log(`add user ${user.name} ${user.email} ${user.id}`);
        //add recipe(s)
        for (var j = 0; j < 3; j++) {

          let ingredients = [];
          for(var m = 0; m < 3; m++) {
            ingredients.push(
              {
                name: faker.lorem.word(),
                culinari_recipeIngredient: {
                  amount: 1.0,
                  unit: "kpl"
                }
              }
            )
          }
          console.log("ingredients ", ingredients)
          const recipe = await Recipe.create({
            name: faker.lorem.word() + ' ' + faker.lorem.word(),
            desc: faker.lorem.sentences().substring(0, 250),
            owner_id: user.id,
            ingredient: ingredients,
          }, {include: [{model: Ingredient, as: fkName(Ingredient)}]});


          // add pictures
          for (var k = 0; k < 3; k++) {
            const picture = await Picture.create({
              recipe_id: recipe.id,
              filename: testPictures[Math.floor(Math.random() * testPictures.length)],
              order: k,
            });
          }

          for (var l = 0; l < 4; l++) {
            const step = await Step.create({
              content: faker.lorem.sentences().substring(0, 250),
              recipe_id: recipe.id,
              order: l,
            });
          }
        }
      }
    }
  });
};
sync();

module.exports = {
  User,
  Recipe,
  Comment,
  Like,
  CommentLike,
  Picture,
  Ingredient,
};
