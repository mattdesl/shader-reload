const staticModule = require('static-module');
const through = require('through');
const path = require('path');
const escape = require('jsesc');
const glslifyConcat = require('./lib/glslify-browser');
const pumpify = require('pumpify');
const reloader = require('./server');
const entryFilePath = require.resolve('./browser.js');

module.exports = function shaderReloadTransform (file, opts) {
  if (!/\.shader\.js$/i.test(file)) return through();

  if (!opts) opts = {};
  const vars = opts.vars || {
    __filename: file,
    __dirname: path.dirname(file)
  };

  const glslify = staticModule({ 'glslify': glslifyHandler }, { vars: vars });
  const reload = staticModule({ 'shader-reload': reloadHandler }, { vars: vars });

  return pumpify(glslify, reload);

  function glslifyHandler (parts) {
    return `'${escape(glslifyConcat(parts))}'`;
  }

  function reloadHandler (opt) {
    const fileRelative = path.join(path.sep, path.relative(process.cwd(), file));
    const vertex = opt.vertex || '';
    const fragment = opt.fragment || '';
    reloader.updateShaderSource(fileRelative, { vertex, fragment });

    return [
      `require('${escape(entryFilePath)}')({\n`,
      `  vertex: '${escape(vertex)}',\n`,
      `  fragment: '${escape(fragment)}'\n`,
      `}, '${escape(fileRelative)}')`
    ].join('');
  }
};
