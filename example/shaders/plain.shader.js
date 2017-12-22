const glslify = require('glslify');
const path = require('path');

module.exports = require('shader-reload')({
  vertex: glslify(path.resolve(__dirname, 'plain.vert')),
  fragment: glslify(path.resolve(__dirname, 'plain.frag'))
});
