var expect = require('chai').expect;
var fork = require('child_process').fork;
var Childseat = require('../node-childseat');
var ChildProcess = require('child_process').ChildProcess;

describe("node-childseat.js", function () {

  describe("initialization", function () {
    it("should exist when required", function () {
      expect(Childseat).is.exist;
    });

    it("should set CHILD_PROCESS to false if process.send does not exist", function () {
      expect(Childseat.CHILD_PROCESS).is.false;
    });
  });

  describe("child creation", function () {
    
    var child;
    before(function (done) {
      child = Childseat.fork('testServer.js');
      setTimeout(function () {
        done();
      }, 1000);
    });

    after(function () {
      child.kill();
    });

    it("should create a new ChildProcess when .fork() is called", function () {
      expect(child.pid).to.exist;
    });

    it("should add a function to child when Childseat.add() is called", function () {
      expect(child.testFunction1).to.exist;
      expect(typeof(child.testFunction1)).to.equal('function');
    });

  });

});

