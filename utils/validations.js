'use strict';

const { validationResult } = require('express-validator');

/**
 * Validates request body.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {(Error) => void} next
 * @returns {void}
 */
const solve = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(item => {
        // Delete possible sensitive/useless data.
        delete item.value;
        delete item.location;
        return item;
      }),
    });
  }
  next();
};

module.exports = {
  solve,
};
