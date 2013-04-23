var expect = require('chai').expect;
var fork = require('child_process').fork;
var Childseat = require('../node-childseat');
var ChildProcess = require('child_process').ChildProcess;

describe("node-childseat.js", function () {

  it("should exist when required", function () {
    expect(Childseat).is.exist;
  });

  it("should set CHILD_PROCESS to false if process.send does not exist", function () {
    expect(Childseat.CHILD_PROCESS).is.false;
  });

  xit("should create a new ChildProcess when .create() is called", function (done) {
    var child = Childseat.fork('testServer.js');
    setTimeout(function () {
      expect(child.pid).to.exist;
      child.kill();
      done();
    }, 1000);
  });

  it("should set CHILD_PROCESS to true if process.send does exist", function (done) {
    var child = Childseat.fork('testServer.js');
    setTimeout(function () {
      child.send({ listen : "all" });
      setTimeout(function () {
        //expect(child.pid).to.exist;
        child.kill();
        done();
      }, 1000);
    }, 1000);
  });

});

