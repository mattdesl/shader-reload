# ThreeJS Materials

The `shader-reload` module maintains two ThreeJS utility materials: LiveShaderMaterial and LiveRawShaderMaterial. This makes it easier to work with Shader Reloading in ThreeJS, and they will auto-update when the passed shader is changed.

```js
const LiveShaderMaterial = require('shader-reload/three/LiveShaderMaterial');
const shader = require('./fancy-effect.shader');

// Pass the shader to set up vertexShader / fragmentShader
const material = new LiveShaderMaterial(shader, {
  // Pass shader material parameters as usual
  side: THREE.DoubleSide,
  uniforms: {
    time: { value: 0 }
  }
});
```

When NODE_ENV is `'production'`, the shader reload check will be ignored to avoid any performance impacts.

_Note:_ These modules already assume that `THREE` exists in global (window) scope.