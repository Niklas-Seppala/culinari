'use strict';
const express = require('express');
const app = express();

require('dotenv').config();

const cors = require('cors');

const fs = require('fs');

const swaggerUI = require("swagger-ui-express");
const swagger_docs = require('./swagger_output.json');

const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
  key: sslkey,
  cert: sslcert,
};

// sync the database schema with the defined models

const sequelize = require('./database/sequelize_init.js');
const db = require('./database/db');

const userRouter = require('./routes/userRouter');

const recipeRouter = require('./routes/recipeRouter');
const commentRouter = require('./routes/commentRouter');
const pictureRouter = require('./routes/pictureRouter');
const ingredientRouter = require('./routes/ingredientRouter');

const passport = require('./utils/pass.js');
const authRoute = require('./routes/authRoute.js');

console.log(
  `Starting local port: ${process.env.HTTP_PORT} https port: ${process.env.HTTPS_PORT} port: ${process.env.PORT}`
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(passport.initialize());
app.enable('trust proxy');
app.use('/auth', authRoute);

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  console.log('Node env prod');
  require('./utils/production')(app, process.env.PORT, process.env.HTTP_PORT, options);
  app.listen(process.env.HTTP_PORT);
} else {
  console.log('Node env localhost');
  require('./utils/localhost')(
    app,
    process.env.HTTPS_PORT,
    process.env.HTTP_PORT,
    options
  );
}

// API docs
const swaggerOptions = {
  customCss: ".try-out__btn {display: none !important;}",
  customSiteTitle: "Culinari REST API"
}

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swagger_docs, swaggerOptions));


app.use((err, req, res, next) => {
  console.log('Error!');
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'internal error' });
});


app.use('/recipe', recipeRouter);
app.use('/comment', commentRouter);
app.use('/picture', pictureRouter);
app.use('/ingredient', ingredientRouter);
app.use('/user', userRouter);
app.use('/uploads', express.static('uploads'));
