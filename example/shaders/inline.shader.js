module.exports = require('shader-reload')({
  fragment: `precision highp float;

  uniform vec3 color;
  uniform float time;
  
  varying vec3 vNormal;
  
  void main () {
    float a = sin(time * 3.0) * 0.5 + 0.5;
    vec3 outColor = mix(vec3(1.0), color, a);
    gl_FragColor = vec4(outColor * (vNormal.z * 0.5 + 0.5), 1.0);
  }`,
  vertex: `precision highp float;

  attribute vec3 position;
  attribute vec3 normal;

  uniform float time;
  uniform mat4 projectionMatrix;
  uniform mat4 modelViewMatrix;

  varying vec3 vNormal;

  void main () {
    vec3 pos = position.xyz;
    pos += normal * 0.5 * (sin(time) * 0.5 + 0.5);
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
  }`
});
