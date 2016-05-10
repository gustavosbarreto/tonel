var config = require('./config');
var uuid = require('node-uuid');
var timeout = require('./timeout');
var redis = require('redis');
var redisClient = redis.createClient(config.redis.port, config.redis.host);

var responses = {};

function sendRequestToClient(server, subdomain, req, res) {
  function send(err, socket) {
    var reqId = uuid.v1();

    server.to(socket).emit('REQUEST', {
        id: reqId,
        url: req.url,
        headers: req.headers,
        method: req.method,
        body: req.body
    });

    var timeoutId = timeout.setTimeout(function() {
      res.sendStatus(504)
    }, config.tunnel.timeout);

    redisClient.set('/requests/' + reqId + '/timeout_id', timeoutId);

    responses[reqId] = res;
  }

  redisClient.get('/subdomains/' + subdomain, send);
}

function sendResponseToClient(res) {
  var client = responses[res.id];

  client.writeHead(res.statusCode, res.headers);
  client.write(res.body);
  client.end();

  responses[res.id] = null;
}

module.exports = {
  sendRequestToClient: sendRequestToClient,
  sendResponseToClient: sendResponseToClient
}
