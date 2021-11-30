"use strict";
const pool = require("../database/db");
const promisePool = pool.promise();

const getAllCats = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner"s name as ownername (from wop_user table).
    const [rows] = await promisePool.query("SELECT * FROM wop_cat ORDER BY cat_id DESC");
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
};

const getCat = async(catId) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM wop_cat WHERE `cat_id` = ?", catId);
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
}


const addCat = async (body, file, user) => {
  console.log("Adding cat", body.name, body.birthdate, body.weight, user)
  try {
    const name = body.name;
    const birthDate = body.birthdate;
    const weight = body.weight;
    const owner = user.user_id;
    const fileName = file.filename;

    const [rows] = await promisePool.query(
        "INSERT INTO wop_cat (name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)",
        [name, weight, owner, fileName, birthDate]
      );
    return rows;
  } catch (e) {

    console.error("error", e.message);
  }
}

const updateCat = async (body, params, user) => {
  console.log("UPDATECAT")
  try {
    console.log("user", user, "editing cat", params)
    const cId = params.catId;
    const name = body.name;
    const birthDate = body.birthdate;
    const weight = body.weight;
    const owner = user.user_id;
    console.log(body)

    let rows = [];

    // only check the owner status if its not an admin user doing the update
    if(user.role != 0) {
      rows = await promisePool.query(
        "UPDATE wop_cat SET name = ?, weight = ?, birthdate = ? WHERE cat_id = ? AND owner = ?",
        [name, weight, birthDate, cId, owner]
      );
    }
    else {
      rows = await promisePool.query(
        "UPDATE wop_cat SET name = ?, weight = ?, birthdate = ? WHERE cat_id = ?",
        [name, weight, birthDate, cId]
      );
    }
    console.log("Rows", rows)
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
}


const deleteCat = async (catId, user) => {
  console.log("Deleting cat "+catId)
  try {
    let rows = [];

    if(user.role != 0) {
      rows = await promisePool.query("DELETE FROM wop_cat WHERE cat_id = ? && owner = ?", [catId, user.user_id]);
    }
    else {
      rows = await promisePool.query("DELETE FROM wop_cat WHERE cat_id = ?", [catId]); 
    }
    return rows;
  } catch (e) {
    console.error("error", e.message);
  }
}


module.exports = {
  getCat,
  getAllCats,
  addCat,
  updateCat,
  deleteCat
};