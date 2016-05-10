var config = require('./config');
var io = require('socket.io');
var tld = require('tldjs');
var timeout = require('./timeout');
var requests = require('./requests');
var redis = require('redis');

var redisClient = redis.createClient(config.redis.port, config.redis.host);

tld.validHosts = [ 'localhost' ];

function socketServer(httpServer) {
  var server = io(httpServer);

  server.on('connection', function(socket) {
    var subdomain = tld.getSubdomain(socket.handshake.headers.host);

    if (!subdomain.length) {
      socket.disconnect();
      return;
    }

    redisClient.set('/subdomains/' + subdomain, socket.id);

    socket.on('CONNECT', function(data) {
      redisClient.get('/subdomains/' + subdomain + '/token', function(err, token) {
        if (!token) {
          if (data.token) {
            redisClient.set('/subdomains/' + subdomain + '/token', data.token);
          }

          socket.emit('READY');
        } else {
          if (token == data.token) {
            socket.emit('READY');
          } else {
            socket.emit('UNAUTHORIZED')
          }
        }
      });
    });

    socket.on('RESPONSE', function(res) {
      function clearRequestTimeout(err, id) {
        timeout.clearTimeout(id);
      }

      redisClient.get('/requests/' + res.id + '/timeout_id', clearRequestTimeout);

      requests.sendResponseToClient(res);
    });
  });

  return server;
}

module.exports = socketServer;
