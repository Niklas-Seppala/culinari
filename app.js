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
const ingredientRouter = require('./routes/ingredientRouter');

const passport = require('./utils/pass.js');
const authRoute = require('./routes/authRoute.js');
const resize = require('./utils/resize');

resize.configure({
  outDir: './uploads',
  srcDir: './uploads',
  dim: { x: 350, y: 300 },
});

console.log(
  `Starting local port: ${process.env.HTTP_PORT} https port: ${process.env.HTTPS_PORT} port: ${process.env.HTTPS_PORT}`
);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
app.use(passport.initialize());
app.enable('trust proxy');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'production') {
  console.log('Node env prod');
  require('./utils/production')(app, process.env.HTTPS_PORT, process.env.HTTP_PORT, options);
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


app.use('/auth', authRoute);
app.use('/recipe', recipeRouter);
app.use('/comment', commentRouter);
app.use('/ingredient', ingredientRouter);
app.use('/user', userRouter);
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  console.log(err)
  const status = err.status || 500;
  res.status(status).json({ msg: err.msg || 'internal error' });
});