var expect = require('chai').expect;
var Childseat = require('../node-childseat');
var ChildProcess = require('child_process').ChildProcess;

describe("node-childseat.js", function () {

  it("should exist when required", function () {
    expect(Childseat).is.exist;
  });

  it("should create a new ChildProcess when .create() is called", function (done) {
    var child = Childseat.create('testServer.js');
    setTimeout(function () {
      expect(child.pid).to.exist;
      child.kill();
      done();
    }, 1000);
  });

});

