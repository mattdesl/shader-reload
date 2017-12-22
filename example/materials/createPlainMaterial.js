const createShaderMaterial = require('./createShaderMaterial');
const shader = require('../shaders/plain.shader');

module.exports = function () {
  return createShaderMaterial(shader, {
    uniforms: {
      color: { value: new THREE.Color('red') },
      time: { value: 0 }
    }
  });
};
