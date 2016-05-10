'use strict';

var config = require('../config');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var qs = require('qs');
var tld = require('tldjs');
var requests = require('./requests');

var app = express();
var server = http.Server(app);

var socketServer = require('./socketServer')(server);

app.set('query parser', function(body){
  return qs.parse(body);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  var subdomain = tld.getSubdomain(req.headers.host);

  if (!subdomain.length) {
    next();
  } else {
    requests.sendRequestToClient(socketServer, subdomain, req, res);
  }
});

tld.validHosts = [ 'localhost' ];

module.exports = server;
