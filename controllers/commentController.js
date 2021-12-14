'use strict';
const Comment = require('../models/commentModel');

const get_all = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    res.status(500).json({});
  }
};

const get_single = async (req, res) => {
  try {
    return res.json(await Comment.findOne({ where: { id: req.params.id } }));
  } catch (err) {
    res.status(500).json({});
  }
};

const post = async (req, res) => {
  try {
    const comment = await Comment.create({
      author_id: req.user.id,
      text: req.body.text,
      recipe_id: req.body.recipe,
    });
    return res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
};

const put = async (req, res) => {
  try {
    const newVals = { text: req.body.text };
    await Comment.update(newVals, { where: { id: req.params.id } });
    return res.json(await Comment.findOne({ where: { id: req.params.id } }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
};

const del = async (req, res) => {
  try {
    const comment = await Comment.findOne({where: {id: req.params.id}})
    comment.destroy();
    return res.json({msg: 'ok'})
  } catch (err) {
    return res.status(500).json({errors: [{msg: 'Internal server error'}]})
  }
}

module.exports = {
  get_all,
  get_single,
  post,
  put,
  del,
};
