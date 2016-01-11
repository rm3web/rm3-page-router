var PageRouter = require('../lib/index.js');
var should = require('should');

describe('page-router',function() {
  var router;
  var req;
  var res;

  beforeEach(function() {
    router = new PageRouter();
    req = {};
    req.method = 'GET';
    res = {};
  });

  it('routes all', function(done) {
    router.routeAll('edit',function(req, res, next) {
      res.ok = 'pretty';
      done();
    });

    router.canHandle('get','edit').should.equal(true);
    router.canHandle('GET','edit').should.equal(true);

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

    router.canHandle('GET','edit').should.equal(true);
    router.canHandle('get','edit').should.equal(true);

    router.handle('edit', req, res, function(err) {
      res.ok.should.equal('pretty');
      done();
    });
  });

  it('routes a chain in order', function(done) {
    var first = false;
    router.get('edit',function(req, res, next) {
      first = true;
      res.ok = 'shiny';
      next();
    });

    router.get('edit',function(req, res, next) {
      first.should.equal(true);
      res.ok.should.equal('shiny');
      res.second = 'sparkles';
      next();
    });

    router.canHandle('GET','edit').should.equal(true);

    router.handle('edit', req, res, function(err) {
      res.ok.should.equal('shiny');
      res.second.should.equal('sparkles');
      done();
    });
  });

  it('routes errors', function(done) {
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