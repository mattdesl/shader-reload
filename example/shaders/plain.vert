precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform float time;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 vNormal;

#pragma glslify: noise = require('glsl-noise/simplex/4d')

void main () {
  vec3 pos = position.xyz;
  pos += normal * 0.75 * noise(vec4(position.xyz, time * 0.5));
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
}