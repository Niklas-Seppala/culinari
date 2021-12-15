'use strict';

require('dotenv').config();
const express = require('express');
const app = express();

const https = require('https');
const http = require('http');

// Add a handler to inspect the req.secure flag (see
// http://expressjs.com/api#req.secure). This allows us
// to know whether the request was via http or https.
// https://github.com/aerwin/https-redirect-demo/blob/master/server.js

module.exports = (app, httpsPort, httpPort, options) => {
  app.enable('trust proxy');
  console.log('EXPORTING PRODUCTION');

  app.use((req, res, next) => {

    console.log('secure: ' + req.secure);
    if (req.secure) {
      // request was via https, so do no special handling
      console.log('secure');
      next();
    } else {
      // if express app run under proxy with sub path URL
      // e.g. http://www.myserver.com/app/
      // then, in your .env, set PROXY_PASS=/app
      // Adapt to your proxy settings!
      const proxypath = process.env.PROXY_PASS || '';
      // request was via http, so redirect to https
      const redirectUrl = `https://${req.headers.host}${proxypath}${req.url}`;
      console.log(`host: ${req.headers.host}\npp: ${proxypath}\nreq.url:${req.url}`);
      console.log(`redirecting to ${redirectUrl}`);
      res.redirect(301, redirectUrl);
      res.end()
    }
  });

  http.createServer(options, app).listen(httpPort);
  https.createServer(options, app).listen(httpsPort);
};
