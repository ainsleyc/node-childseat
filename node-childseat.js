
var fork = require('child_process').fork;

module.exports = (function () {

  var Childseat = {};
  var functionArray = {};
  var CHILDSEAT_CALL_FUNCTION = "CHILDSEAT_CALL_FUNCTION";
  var CHILDSEAT_ADD_FUNCTION = "CHILDSEAT_ADD_FUNCTION";
  var CHILDSEAT_REMOVE_FUNCTION = "CHILDSEAT_REMOVE_FUNCTION";

  // If process.send exists, then this is a child process
  Childseat.CHILD_PROCESS = process.send ? true : false;

  // PARENT PROCESS FUNCTIONS
  Childseat.fork = function (path, args, options) {
    var child = fork(path, args, options);
    child.on('message', function(m) {
      processMessageFromChild(this, m);
    });
    return child;
  };

  function processMessageFromChild(child, message) {
    if(message.CHILDSEAT_ADD_FUNCTION) {
      child[message.CHILDSEAT_ADD_FUNCTION] = function() {
        var command = {};
        command[CHILDSEAT_CALL_FUNCTION] = message.CHILDSEAT_ADD_FUNCTION;
        command.args = arguments;
        child.send(command);
      }
    }
  };

  // CHILD PROCESS FUNCTIONS
  if (Childseat.CHILD_PROCESS) {
    process.on('message', function (message) {
      processMessageFromParent(message);  
    });

    Childseat.add = function (name, func) {
      functionArray[name] = func;
      var message = {};
      message[CHILDSEAT_ADD_FUNCTION] = name;
      process.send(message);
    };

    Childseat.remove = function (name) {
      // TBD
    };
  }

  function processMessageFromParent(message) {
    if (message.CHILDSEAT_CALL_FUNCTION && functionArray[message.CHILDSEAT_CALL_FUNCTION]) {
      var argArray = [];
      for (var key in message.args) {
        argArray.push(message.args[key]);
      }
      functionArray[message.CHILDSEAT_CALL_FUNCTION].apply(null, argArray);
    }
  }

  return Childseat;

})();

