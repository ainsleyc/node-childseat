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

    it("should not have add function if in parent process", function () {
      expect(Childseat.add).is.not.exist;
    });

    it("should not have remove function if in parent process", function () {
      expect(Childseat.remove).is.not.exist;
    });
  });

  describe("child creation", function () {
    
    var child;
    beforeEach(function (done) {
      child = Childseat.fork('testServer.js');
      setTimeout(function () {
        done();
      }, 1000);
    });

    afterEach(function () {
      child.kill();
    });

    it("should create a new ChildProcess when .fork() is called", function () {
      expect(child.pid).to.exist;
    });

    it("should add a function to child when Childseat.add() is called", function () {
      expect(child.testFunction1).to.exist;
      expect(typeof(child.testFunction1)).to.equal('function');
      expect(child.testFunction2).to.exist;
      expect(typeof(child.testFunction2)).to.equal('function');
    });

    it("should call child function when child.function() is called", function (done) {
      child.on('message', function (message) {
        expect(message.result).to.exist;
        expect(message.result).to.equal('testFunction1');
        done();
      });
      child.testFunction1();
    });

    it("should pass arguments to child.function()", function (done) {
      child.on('message', function (message) {
        expect(message.result).to.exist;
        expect(message.result[0]).to.equal('testInput');
        expect(message.result[1]).to.equal(20);
        expect(message.result[2]).to.equal(false);
        done();
      });
      child.testFunction2("testInput", 20, false);
    });

    xit("should return to parent whatever is returned by child.function()", function (done) {
      done(); 
    });

    xit("should call parent callback when provided", function (done) {
      done(); 
    });
  });

});

