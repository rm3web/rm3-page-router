var PageRouter = require('../lib/index.js');
var should = require('should');

describe('page-router',function() {
  var router;
  var req;
  var res;

  beforeEach(function() {
    router = new PageRouter();
    req = {};
    req.method = 'get';
    res = {};
  });

  it('routes all', function(done) {
    router.route_all('edit',function(req, res, next) {
      res.ok = 'pretty';
      done();
    });

    router.can_handle('get','edit').should.be.ok;

    router.handle('edit', req, res, function(err) {
      res.ok.should.equal('pretty');
      done();
    });
  });

  it('routes a single function', function(done) {
    router.get('edit',function(req, res, next) {
      res.ok = 'pretty';
      done();
    });

    router.post('edit',function(req, res, next) {
      should.fail();
    });

    router.post('cool', function(req, res, next) {
      should.fail();
    });

    router.can_handle('get','edit').should.be.ok;

    router.handle('edit', req, res, function(err) {
      res.ok.should.equal('pretty');
      done();
    });
  });

  it('routes a chain in order', function(done) {

    var router = new PageRouter();
    router.get('edit',function(req, res, next) {
      res.ok = 'shiny';
      done();
    });

    router.get('edit',function(req, res, next) {
      res.ok.should.equal('t');
      res.second = 'sparkles';
      done();
    });

    router.can_handle('get','edit').should.be.ok;

    router.handle('edit', req, res, function(err) {
      res.ok.should.equal('shiny');
      res.second.should.equal('sparkles');
      done();
    });
  });

  it('routes errors', function(done) {
    var router = new PageRouter();
    router.get('edit',function(req, res, next) {
      next(new Error('injected error'));
    });

    router.get('edit',function(req, res, next) {
      should.fail();
      done();
    });

    router.handle('edit', req, res, function(err) {
      err.should.be.an.instanceOf(Error);
      done();
    });
  });

  it('prevents non-funcs from being added', function() {
    var router = new PageRouter();
    (function(){
      router.get('edit');
    }).should.throw();
  });
});