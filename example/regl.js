// An example with regl WebGL framework
// The shader is passed as a prop or function, and regl
// will handle the re-compiling on the fly.

document.body.style.margin = '0';

const shader = require('./shaders/plain.shader');

// Alternative, inline shader:
// const shader = require('./shaders/inline.shader');

const regl = require('regl')(document.body);
const sphere = require('primitive-icosphere')(1, { subdivisions: 3 });

const camera = require('perspective-camera')({
  fov: 45 * Math.PI / 180
});

// set up our camera
camera.translate([ 0, 0, 6 ]);
camera.lookAt([ 0, 0, 0 ]);
camera.update();

let draw = regl({
  // Or could use regl.prop() and pass this in
  frag: () => shader.fragment,
  vert: () => shader.vertex,
  uniforms: {
    time: regl.prop('time'),
    projectionMatrix: regl.prop('projectionMatrix'),
    modelViewMatrix: regl.prop('modelViewMatrix'),
    color: [ 1, 0, 0 ]
  },
  attributes: {
    position: regl.buffer(sphere.positions),
    normal: regl.buffer(sphere.normals)
  },
  elements: regl.elements(sphere.cells)
});

regl.frame(context => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  });

  camera.viewport = [ 0, 0, context.viewportWidth, context.viewportHeight ];
  camera.update();

  draw({
    projectionMatrix: camera.projection,
    modelViewMatrix: camera.view,
    time: regl.now()
  });
});
