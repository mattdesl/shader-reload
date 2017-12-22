var Shader = require('./lib/Shader');

module.exports = createShader;
function createShader (opt = {}) {
  return new Shader(opt);
}
