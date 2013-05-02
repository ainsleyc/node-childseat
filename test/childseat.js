var expect = require('chai').expect;
var fork = require('child_process').fork;
var Childseat = require('../childseat');
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

  describe("child behavior", function () {
    
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
      expect(child.testFunction3).to.exist;
      expect(typeof(child.testFunction3)).to.equal('function');
      expect(child.testFunction4).to.exist;
      expect(typeof(child.testFunction4)).to.equal('function');
    });

    it("should throw error if a function is called by parent that was not registered");

    it("should call child function when child.function() is called", function (done) {
      child.on('message', function (message) {
        expect(message.result).to.exist;
        expect(message.result).to.equal('testFunction1');
        done();
      });
      child.testFunction1();
    });

    it("should throw error if a function is called by child that was not registered");

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

    it("should call parent callback when provided", function (done) {
      child.testFunction3("testInput", function () {
        done();
      });
    });

    it("should pass arguments from child back to parent callback", function (done) {
      child.testFunction4(function () {
        expect(arguments[0] === "testInput");
        expect(arguments[1] === 50);
        expect(arguments[2] === true);
        done();
      });
    });

    xit("should delete temp callback when it has been called", function (done) {
      child.testFunction3("testInput", function () {
        done();
      });
    });

    xit("should not allow functions other than callback to be passed in to child", function (done) {
      child.testFunction3("testInput", function () {
        done();
      });
    });

    xit("should set 'this' to null during child function call", function (done) {
      child.testFunction3("testInput", function () {
        done();
      });
    });

    xit("should set 'this' to null during parent function call", function (done) {
      child.testFunction3("testInput", function () {
        done();
      });
    });

    it("should remove functions when remove() is called", function(done) {
      child.on('message', function (message) {
        if (message.result === 'removeFunctions') {
          expect(child.testFunction1).to.not.exist;
          expect(child.testFunction2).to.not.exist;
          expect(child.testFunction3).to.not.exist;
          expect(typeof(child.testFunction4)).to.equal('function');
          done();
        }
      });
      child.removeFunctions();
    });
  });

});

