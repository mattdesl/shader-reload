precision highp float;

uniform vec3 color;
uniform float time;

varying vec3 vNormal;

void main () {
  gl_FragColor = vec4(color * (vNormal.z * 0.5 + 0.5), 1.0);
}