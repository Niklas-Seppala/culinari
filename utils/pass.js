'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/userModel');

const bcryptjs = require('bcryptjs');

const getUserLogin = async username => {
  const user = await User.findOne({
    where: { email: username },
    attributes: {
      include: ['password'],
    },
  });
  return { ...user?.dataValues }
};

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await getUserLogin(username);

      // Incorrect email.
      if (!user) return done(null, false, { message: 'Incorrect email.' });

      // Incorrect password.
      if (!bcryptjs.compareSync(password, user.password)) {
        console.log('incorrect pw')
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      // Success.

      return done(null, user, { message: 'Welcome.' });
    } catch (err) {
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
