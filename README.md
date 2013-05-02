node-childseat
==============

Childseat allows you to interact with child processes using functions and callbacks. Childseat's fork() function produces the same ChildProcess produced by node's child_process.fork() function, except that you can attach function calls to it.

Childseat detects whether it has been required in a parent or child process and behaves accordingly.

## Example:

### child.js:

```javascript
var Childseat = require('node-childseat');

var childFunction (arg1, arg2, callback) {
  // Do something
  console.log("I receieved " + arg1 + " and " + arg2 + " from my parent!");
  var result = arg1 + arg2;
  callback(result);
}

Childseat.add('childFunction', childFunction);
```

### parent.js:

```javascript
var Childseat = require('node-childseat');

var child = Childseat.fork('child.js');

// Child processes take some time to spin up, as per node's child_process documentation
setTimeout(function () {
  child.childFunction(value1, value2, function (result) {
    console.log("I received " + results + " from my child!");
    expect(result).to.equal(value1 + value2);
  });
}, 1000);
```
