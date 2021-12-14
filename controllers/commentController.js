'use strict';
const CommentLike = require('../models/commentLike');
const Comment = require('../models/commentModel');
const Like = require('../models/likeModel');

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
    const comment = await Comment.findOne({ where: { id: req.params.id } });
    comment.destroy();
    return res.json({ msg: 'ok' });
  } catch (err) {
    return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
};

const post_like = async (req, res) => {
  try {
    const like = await CommentLike.create({
      comment_id: req.params.id,
      user_id: req.user.id,
    });
    return res.json(like);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

const del_like = async (req, res) => {
  try {
    let like = await CommentLike.findOne({
      where: {
        comment_id: req.params.id,
        user_id: req.user.id,
      },
    });
    if (like) {
      await like.destroy();
      return res.json({ msg: 'ok' });
    } else {
      return res
        .status(403)
        .json({ errors: [{ param: '', msg: 'forbidden' }] });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = {
  get_all,
  get_single,
  post,
  put,
  del,
  post_like,
  del_like,
};
