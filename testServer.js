//process.nextTick(function () {console.log("testServer: exports=" + JSON.stringify(module.exports))});

var connect = require("connect");
var Childseat = require("./node-childseat");

function testFunction1 () {
  console.log("TEST_SERVER: testFunction1!");
}

Childseat.add("testFunction1", testFunction1);

connect.createServer(
  connect.static(__dirname)
).listen(8090);


/*
function testFunction2() {};

module.exports.testVariable = "testVariable";
module.exports.testFunction = function () {
  console.log("testFunction");
};
module.exports.testFunction2 = testFunction2;
module.exports.testObject = {
  objectVariable : "objectVariable",
  objectFunction : function () {
    console.log("objectFunction");
  }
};
*/
