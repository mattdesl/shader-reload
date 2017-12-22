# shader-reload

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

This is an experimental interface for live shader reloading in ThreeJS, [regl](https://github.com/regl-project/regl/), and other WebGL frameworks. This means you can edit your GLSL shader files without re-starting your entire application state. Works with regular strings, template strings, and/or transforms like brfs and [glslify](https://www.npmjs.com/package/glslify). Handles errors with a client-side popup that disappears on subsequent reloads.

![screenshot](./screenshots/shader.gif)

This also includes `glsl-server`, a drop-in replacement for [budo](https://www.npmjs.com/package/budo) that supports live-reloading GLSL with `glslify` built-in.

The code here could probably be adapted to work with other environments, e.g. Webpack/Express.

## Quick Start

This module includes a simple development server to get you up and running. For a more advanced project, you may want to copy and modify the [dev.js](./bin/dev.js) script, or integrate the WebSocket events into your own environment (e.g. Webpack, Express, whatever).

From your project folder using `node@8.4.x` and `npm@5.3.x` or higher:

```sh
npm install shader-reload --save-dev
```

Now, start the development server, this will open `http://localhost:9966`:

```sh
npx glsl-server src/index.js --open
```

Add new shader modules with the extension `.shader.js` and syntax like so, and they will be live-updated without introducing a page reload.

`src/foo.shader.js`

```js
module.exports = require('shader-reload')({
  vertex: '... shader source string ...',
  fragment: '... shader source string ...'
});
```

Under the hood, the `glsl-server` script is running [budo](https://www.npmjs.com/package/budo) with [glslify](https://www.npmjs.com/package/glslify), so you can pass other options like `--dir` and `--port`. You can also add glslify transforms like [glslify-hex](https://www.npmjs.com/package/glslify-hex) to your package.json and they will get picked up by `glsl-server`.

## Usage

### Shader Files (`.shader.js`)

You will need to separate your shader source into its own module, which must have the extension `.shader.js` and require the `shader-reload` function.

Pass statically analyzable GLSL source code to the function like this:

```js
module.exports = require('shader-reload')({
  vertex: '... shader source string ...',
  fragment: '... shader source string ...'
});
```

The return value of the `shader-reload` function is a `Shader` object, which has the same `vertex` and `fragment` properties (which are mutated on file change). You can also attach a `shader.on('change', fn)` event to react to changes.

Here is an example with inline shader source, using template strings.

`blue.shader.js`

```js
module.exports = require('shader-reload')({
  fragment: `
  void main () {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
  }`,
  vertex: `
  void main () {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
  }`
});
```

Then your ThreeJS source might look like this:

`main.js`

```js
const shader = require('./blue.shader');

const material = new THREE.ShaderMaterial({
  vertexShader: shader.vertex,
  fragmentShader: shader.fragment
});

shader.on('change', () => {
  // Mark shader for recompilation
  material.vertexShader = shader.vertex;
  material.fragmentShader = shader.fragment;
  material.needsUpdate = true;
});

const mesh = new THREE.Mesh(geometry, material);
...
```

### Development Tool

For this to be used, you will need a development server like [budo](https://www.npmjs.com/package/budo). You will need to use WebSockets to communicate to the client-side code.

The tool needs to broadcast `'shader-reload'` events to the connected WebSocket clients, see [here](./bin/dev.js) for an example.

### Browserify Transform

You must also include the [transform](./transform.js) when bundling, e.g. `-t shader-reload/transform`, or in options;

```js
...
  browserify: {
    transform: [ 'shader-reload/transform' ]
  }
```

## Use with glslify

You can also use glslify to organize your GLSL into their own files and to require glsl modules from npm. Make sure to include `glslify` as a source transform *before* the `shader-reload` transform.

`blue.shader.js`

```js
const glslify = require('glslify');
const path = require('path');

module.exports = require('shader-reload')({
  vertex: glslify(path.resolve(__dirname, 'blue.vert')),
  fragment: glslify(path.resolve(__dirname, 'blue.frag'))
});
```

## :warning: Babel and ES6 `import`

Babel will replace `import` statements with code that isn't easy to statically analyze, causing problems with this module. Instead of using `import` for `'shader-reload'`, you should `require()` it.

The same goes for requiring `glslify`.

## Production Bundling

During production or when publishing the source to a non-development environment (i.e. without WebSockets), simply omit the `shader-reload` transform. Shaders will not change after construction.

## Running from Source

Clone this repo and `npm install`, then `npm run example-three` (ThreeJS) or `npm run example-regl` (regl). Edit the files inside the [example/shaders/](./examples/shaders/) folder and the shader will update without reloading the page. Saving other frontend files will reload the page as usual, restarting the application state.

## Why not Webpack/Parcel HMR?

In my experience, trying to apply Hot Module Replacement to an entire WebGL application leads to a lot of subtle issues because GL relies so heavily on state, GPU memory, performance, etc.

However, shaders are easy to "hot replace" since they are really just strings. I wanted a workflow that provides lightning fast GLSL reloads, works smoothly with glslify, and does not rely on a bundle-wide HMR solution (which would be overkill). This module also handles some special edge cases like handling shader errors with a client-side popup.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/shader-reload/blob/master/LICENSE.md) for details.
