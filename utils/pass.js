'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/userModel');

const bcryptjs = require('bcryptjs');

const getUserLogin = async (payload, done) => {
  const user = await User.findOne({
    where: { id: payload.id },
    attributes: {
      include: ['password'],
    },
  });
  done(null, user?.dataValues)
};

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = (await User.findOne({
        where: { name: username },
        attributes: {
          include: ['password'],
        },
      }))?.dataValues;

      // Incorrect email.
      if (!user) return done(null, false, { message: 'Incorrect email.' });

      // Incorrect password.
      if (!bcryptjs.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      // Success.
      delete user.password
      return done(null, user, { message: 'Welcome.' });
    } catch (err) {
      console.log(err)
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    getUserLogin
  )
);

module.exports = passport;
