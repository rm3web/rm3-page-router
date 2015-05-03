var methods = require('methods');
var async = require('async');

var route = function(method, command, fn) {
  var self = this;

  // Ripped from express 4.
  if (typeof fn !== 'function') {
    var type = {}.toString.call(fn);
    var msg = 'route requires callback functions but got a ' + type;
    throw new Error(msg);
  }

  if (!self.dispatch[method].hasOwnProperty(command)) {
    self.dispatch[method][command] = [];
  }
  self.dispatch[method][command].push(fn);
};

var PageRouter = function() {
  var self = this;
  this.dispatch = {};

  methods.concat('all').forEach(function(method){
    self.dispatch[method] = {};
    PageRouter.prototype[method] = route.bind(self, method);
  });
};

PageRouter.prototype.route = route;

PageRouter.prototype.route_all = function(command, fn) {
  var self = this;
  methods.concat('all').forEach(function(method){
    self.route(method, command, fn);
  });
};

PageRouter.prototype.can_handle = function(method, command) {
  var self = this;
  if (self.dispatch.hasOwnProperty(method)) {
    if (self.dispatch[method].hasOwnProperty(command)) {
      return self.dispatch[method][command].length !== 0;
    }
  }
  return false;
};

PageRouter.prototype.handle = function(command, req, res, done) {
  var self = this;
  var method = req.method;
  if (self.can_handle(method, command)) {
    var callbacks = self.dispatch[method][command];
    async.eachSeries(callbacks, function(fn, callback) {
      fn(req, res, callback);
    },
    function(err) {
      done(err);
    });
  } else {
    done();
  }
};

module.exports = exports = PageRouter;