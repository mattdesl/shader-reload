const LiveShaderMaterial = require('./LiveShaderMaterial');
const shader = require('../shaders/plain.shader');

module.exports = function createPlainMaterial () {
  return new LiveShaderMaterial(shader, {
    uniforms: {
      color: { value: new THREE.Color('red') },
      time: { value: 0 }
    }
  });
};
