var timeouts = {};
var counter = 0;

module.exports = {
  setTimeout: function(cb, delay) {
    var current = counter++;

    timeouts[current] = setTimeout(function() {
      timeouts[current] = null;
      cb();
    }, delay);

    return current;
  },

  clearTimeout: function(id) {
    global.clearTimeout(timeouts[id]);
    timeouts[id] = null;
  }
}
