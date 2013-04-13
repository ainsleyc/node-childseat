var connect = require("connect");
var Childseat = require("./node-childseat");

connect.createServer(
  connect.static(__dirname)
).listen(8090);
