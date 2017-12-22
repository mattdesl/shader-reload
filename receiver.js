var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
emitter.setMaxListeners(10000);
module.exports = emitter;
