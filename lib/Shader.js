var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function Shader (opt) {
  EventEmitter.call(this);
  opt = opt || {};
  this.vertex = opt.vertex || '';
  this.fragment = opt.fragment || '';
}

inherits(Shader, EventEmitter);

module.exports = Shader;
