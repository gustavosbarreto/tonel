var path = require('path');

module.exports = {
  tunnel: {
    port: process.env.TUNNEL_PORT || 80,
    timeout: process.env.TUNNEL_TIMEOUT || 45
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379
  }
}
