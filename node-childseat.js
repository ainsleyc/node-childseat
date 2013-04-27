
var fork = require('child_process').fork;
var uuid = require('node-uuid');

module.exports = (function () {

  var CHILDSEAT_CALL_FUNCTION = "CHILDSEAT_CALL_FUNCTION";
  var CHILDSEAT_CHILD_CALLBACK = "CHILDSEAT_CHILD_CALLBACK";
  var CHILDSEAT_ADD_FUNCTION = "CHILDSEAT_ADD_FUNCTION";
  var CHILDSEAT_REMOVE_FUNCTION = "CHILDSEAT_REMOVE_FUNCTION";
  var CHILDSEAT_FUNCTION_STUB = "CHILDSEAT_FUNCTION_STUB";

  var Childseat = {};
  var functionArray = {};
  var callbacks = {};

  // If process.send exists, then this is a child process
  Childseat.CHILD_PROCESS = process.send ? true : false;

  // Utility functions
  function convertArgs (argObject) {
    var argArray = [];
    for (var key in argObject) {
      argArray.push(argObject[key]);
    }
    return argArray;
  };

  // PARENT PROCESS FUNCTIONS
  Childseat.fork = function (path, args, options) {
    var child = fork(path, args, options);
    child.on('message', function(m) {
      processMessageFromChild(this, m);
    });
    return child;
  };

  function processMessageFromChild(child, message) {
    if (message.CHILDSEAT_ADD_FUNCTION) {
      child[message.CHILDSEAT_ADD_FUNCTION] = function() {
        var command = {};
        var callbackIndex = arguments.length - 1;
        // Check if the user has passed in a callback
        if (typeof(arguments[callbackIndex]) === 'function') {
          // If so save it so it can be called later
          var callbackUUID = uuid.v4();
          command[CHILDSEAT_FUNCTION_STUB] = callbackUUID;
          callbacks[callbackUUID] = arguments[callbackIndex];
        }
        command[CHILDSEAT_CALL_FUNCTION] = message.CHILDSEAT_ADD_FUNCTION;
        command.args = arguments;
        child.send(command);
      }
    }
    if (message.CHILDSEAT_CHILD_CALLBACK) {
      var argArray = convertArgs(arguments);
      callbacks[message.CHILDSEAT_CHILD_CALLBACK].apply(null, argArray);
      delete callbacks[message.CHILDSEAT_CHILD_CALLBACK];
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
      var argArray = convertArgs(message.args); 
      // Check if a callback was stubbed out
      if (message.CHILDSEAT_FUNCTION_STUB) {
        // If so, stub in a function to call the parent back using the uuid
        var uuid = message.CHILDSEAT_FUNCTION_STUB;
        argArray.push(function () {
          // When the function has returned, pass the arguments back to the parent
          var result = {};
          result.CHILDSEAT_CHILD_CALLBACK = uuid;
          result.args = arguments;
          process.send(result);
        }); 
      }
      functionArray[message.CHILDSEAT_CALL_FUNCTION].apply(null, argArray);
    }
  }

  return Childseat;

})();

