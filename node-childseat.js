
var fork = require('child_process').fork;

module.exports = (function () {

  var Childseat = {};

  Childseat.create = function (path, args, options) {
    return fork(path, args, options);
  };

  return Childseat;

})();

