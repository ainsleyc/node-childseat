
var fork = require('child_process').fork;

module.exports = (function () {

  var Childseat = {};

  // If process.send exists, then this is a child process
  Childseat.CHILD_PROCESS = process.send ? true : false;

  if (Childseat.CHILD_PROCESS) {
    extractGlobal();
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

  Childseat.create = function (path, args, options) {
    return fork(path, args, options);
  };

  return Childseat;

})();

