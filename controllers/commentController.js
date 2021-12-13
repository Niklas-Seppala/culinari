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
    const comment = await Comment.findOne({ where: { id: req.params.id } });
    if (comment) return res.json(comment);
    res.status(404).json({
      errors: [
        {
          msg: 'No comments exist with such id.',
        },
      ],
    });
  } catch (err) {
    res.status(500).json({});
  }
};

const post = async (req, res) => {
  try {
    const comment = await Comment.create({
      author_id: req.body.author,
      text: req.body.text,
      recipe_id: req.body.recipe
    })
    return res.json(comment)
  } catch (err) {
    console.error(err)
  }

  res.json({ msg: 'not implemented' });
};

const put = async (req, res) => {
  res.json({ msg: 'not implemented' });
};

module.exports = {
  get_all,
  get_single,
  post,
  put,
};
