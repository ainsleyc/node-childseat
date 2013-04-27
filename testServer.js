
var connect = require("connect");
var Childseat = require("./node-childseat");

function testFunction1 () {
  process.send({ result : "testFunction1" });
}

function testFunction2 () {
  process.send({ result : arguments });
}

function testFunction3 (value, callback) {
  callback("testFunction3");
}

function testFunction4 (callback) {
  callback("testInput", 50, true);
}

Childseat.add("testFunction1", testFunction1);
Childseat.add("testFunction2", testFunction2);
Childseat.add("testFunction3", testFunction3);
Childseat.add("testFunction4", testFunction4);

connect.createServer(
  connect.static(__dirname)
).listen(8090);


