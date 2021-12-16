'use strict';
const CommentLike = require('../models/commentLike');
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
    const newComment = await Comment.findOne({where: {id: comment.id}})
    return res.json(newComment);
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
    let whereParams = { id: req.params.id, author_id: req.user.id };

    if(req.user.role == 1) {
      // if user is admin, don't check the author id (allow admins to delete comments from everyone)
      delete whereParams.author_id;
    }

    const comment = await Comment.findOne({ where: whereParams });
    if (comment) {
      comment.destroy();
      return res.json({ msg: 'ok' });
    } else {
      return res.status(403).json({ errors: [{ msg: 'That is not your comment' }] })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
  }
};

const post_like = async (req, res) => {
  try {
    const existing = await CommentLike.findOne({where: {comment_id: req.params.id, user_id: req.user.id}})
    if(existing) {
      // Dislike comment
      existing.destroy();
      return res.json({ OP: 'DEL' });
    }
    // Like comment
    const like = await CommentLike.create({
      comment_id: req.params.id,
      user_id: req.user.id,
    });
    return res.json({OP: 'POST', data: like});
  } catch (error) {
    console.log(error)
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
};
