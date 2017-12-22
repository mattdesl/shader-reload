var Shader = require('./lib/Shader');

module.exports = createShader;
function createShader (opt) {
  opt = opt || {};
  return new Shader(opt);
}
