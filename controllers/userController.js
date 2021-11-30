"use strict";
const {body, validationResult} = require("express-validator");
// userController
const userModel = require("../models/userModel");

const users = userModel.users;


const hide_pass = users => users.map(u => {
    delete u.password;
    return u;
});


const user_list_get = async (req, res) => {
    const users = await userModel.getAllUsers();
    console.log(users, typeof users)
    res.json(hide_pass(users));
};

const user_get = async (req, res) => {
    let userId = req.params.userId;
    const users = await userModel.getUser(userId);
    return res.json(hide_pass(users)[0]);
};

const user_update = async (req, res) => {
  const errors = validationResult(req);
  console.log("UPDATE USER", errors)
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }
  const cat = await userModel.updateUser(req.body, req.user);

  return res.json({message: "User updated!"})
};


const checkToken = (req, res, next) => {

    if (!req.user) {
     next(new Error("token not valid"));
    } else {
     res.json({ user: req.user });
  }
};



module.exports = {
  user_list_get,
  user_get,
  user_update,
  checkToken
};