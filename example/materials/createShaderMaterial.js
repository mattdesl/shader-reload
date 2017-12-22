module.exports = function (shader, opt) {
  // This could work with ShaderMaterial or RawShaderMaterial
  // Here we choose raw so the 'regl.js' example works the same
  const material = new THREE.RawShaderMaterial(Object.assign({}, opt, {
    vertexShader: shader.vertex,
    fragmentShader: shader.fragment
  }));

  // Tell ThreeJS the shader has changed and should be re-compiled
  shader.on('change', () => {
    material.vertexShader = shader.vertex;
    material.fragmentShader = shader.fragment;
    material.needsUpdate = true;
  });

  return material;
};
