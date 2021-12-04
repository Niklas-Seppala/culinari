'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/userModel');

const bcryptjs = require('bcryptjs');

// local strategy for username password login

const getUserLogin = async username => {
  console.log('getUserLogin username', username);
  try {
    const user = await User.findOne({ where: { email: username } });
    return user;
  } catch (e) {
    console.log('error', e.message);
  }
};

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await getUserLogin(username);

      const salt = bcryptjs.genSaltSync(10);
      const hash = bcryptjs.hashSync(password, salt);

      console.log(
        'Local strategy',
        user,
        password,
        'correct?: ' + bcryptjs.compareSync(password, user.password)
      ); // result is binary row
      console.log('hash of input', hash);
      if (user === undefined) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!bcryptjs.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, { ...user }, { message: 'Logged In Successfully' }); // use spread syntax to create shallow copy to get rid of binary row type
    } catch (err) {
      return done(err);
    }
  })
);

// TODO: JWT strategy for handling bearer token
// consider .env for secret, e.g. secretOrKey: process.env.JWT_SECRET

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
      /*return getUserLogin(jwtPayload.username)
            .then(user => {
                return done(null, jwtPayload.user);
            })
            .catch(err => {
                console.log("error");
                return done(err);
            });*/
    }
  )
);

module.exports = passport;
