
var fork = require('child_process').fork;

module.exports = (function () {

  var Childseat = {};
  var CHILDSEAT_REGISTER_FUNCTION = "CHILDSEAT_REGISTER_FUNCTION";
  var CHILDSEAT_CALL_FUNCTION = "CHILDSEAT_CALL_FUNCTION";
  var CHILDSEAT_SET_VARIABLE = "CHILDSEAT_SET_VARIABLE";

  // If process.send exists, then this is a child process
  Childseat.CHILD_PROCESS = process.send ? true : false;

  if (Childseat.CHILD_PROCESS) {
    process.nextTick(registerExports);
    process.on('message', function (m) {
      if(m.get) {
        if(m.get === "CHILD_PROCESS") {
          process.send({ "CHILD_PROCESS" : Childseat.CHILD_SEAT });
        };
      }
      if(m.listen) {
        if(m.listen === 'all') {
          // attach function listeners to all functions
          applyGlobal();
        } else {
          // attempt to find the individual function that is indicated by listen
          applySingle(m.listen);
        }
      };
    });
  };

  function registerExports () {
    var exportObject = copy(module.parent.exports);
    var sendObject = {};
    sendObject[CHILDSEAT_REGISTER_FUNCTION] = exportObject;
    process.send(sendObject);
  }

  function copy(target) {
    var result = {};
    var type = typeof(target);
    if (type === 'function') {
      return 'function';
    } else if (type === 'object') {
      for (var key in target) {
        result[key] = copy(target[key]);
      }
      return result;
    } else {
      return target;
    }
  }

  function extractGlobal () {
    console.log("*** EXAMINING GLOBAL SCOPE ***"); 
    for(var i in global) {
      //console.log(i + " " + global[i]);
    }
  };

  function applyGlobal() {
    console.log("*** APPLY GLOBAL ***"); 
  };

  function applySingle(functionName) {
    console.log("*** APPLY SINGLE ***"); 
  };

  function callFunction(name, args) {
    
  };

  Childseat.fork = function (path, args, options) {
    var child = fork(path, args, options);
    child.on('message', function(m) {
      console.log("child registering function: " + JSON.stringify(m));
    });
    return child;
  };

  Childseat.sync = function () {

  };

  return Childseat;

})();

