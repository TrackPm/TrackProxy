var expect = require('Chai').expect;
var request = require('request');
var http = require('http');

process.env.NODE_ENV = 'test';

var server = require('../server.js');

var httpserver = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('hello world');
  res.end();
});

describe('server response', function () {
  before(function () {
    httpserver.listen(4000);
  });
  
  it('should return 200', function (done) {
    var options = {
        url: 'http://localhost:3001'
    };
    request.get(options, function (err, res, body) {
    expect(res.statusCode).to.equal(200);
    expect(res.body).to.equal('hello world');
    done();
  });
});

  after(function () {
    httpserver.close();
  });
});


