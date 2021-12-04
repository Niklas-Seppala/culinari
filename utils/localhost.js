'use strict';
const express = require('express');

require('dotenv').config();

const https = require('https');
const http = require('http');

const httpsRedirect = http.createServer((req, res) => {
  const url = `https://localhost:${process.env.HTTPS_PORT}${req.url}`;
  console.log('Going to ', req.url);
  console.log(`Redirect to ${url}`);
  res.writeHead(301, { Location: url });
  res.end();
});

module.exports = (app, httpsPort, httpPort, options) => {
  console.log('EXPORTING LOCAL', httpsPort, httpPort);
  httpsRedirect.listen(httpPort);
  https.createServer(options, app).listen(httpsPort);
};
