'use strict';
const express = require('express');

require('dotenv').config();

const https = require('https');
const http = require('http');

const httpsRedirect = http.createServer((req, res) => {

  const url = `https://localhost:${process.env.HTTPS_PORT}${req.url}`;
  console.log('Going to ', req.url);
  console.log(`Redirect to ${url}`);

  // add CORS header
  res.writeHead(301, {Location: url, 'Access-Control-Allow-Origin': '*'});
  res.end()
});

module.exports = (app, httpsPort, httpPort, options) => {
  console.log('EXPORTING LOCAL', httpsPort, httpPort);

  httpsRedirect.listen(httpPort);
  https.createServer(options, app).listen(httpsPort);
};
