var listener = require('./lib/websocket-listener');
var Shader = require('./lib/Shader');
var errors = require('./lib/error-reporter');

var shaderMap = {};

module.exports = createShader;
function createShader (opt, filename) {
  opt = opt || {};
  var shader = new Shader(opt);
  if (shaderMap && typeof filename === 'string') {
    if (filename in shaderMap) {
      console.warn('Shader already exists in cache:', filename);
    }
    shaderMap[filename] = shader;
  }
  return shader;
}

function reloadShaders (updates) {
  if (!shaderMap) return;
  updates = (Array.isArray(updates) ? updates : [ updates ]).filter(Boolean);
  updates.forEach(function (update) {
    var file = update.file;
    if (!file) {
      console.warn('no file field in update');
      return;
    }
    if (file in shaderMap) {
      var shader = shaderMap[file];
      var oldVertex = shader.vertex;
      var oldFragment = shader.fragment;
      shader.vertex = update.vertex || '';
      shader.fragment = update.fragment || '';
      shader.emit('touch');
      if (oldVertex !== shader.vertex || oldFragment !== shader.fragment) {
        shader.emit('change');
      }
    } else {
      console.log('File is not yet attached', file);
    }
  });
}

// Listen for LiveReload connections during development
listener({
  route: '/shader-reload'
}, function (data) {
  if (data.event === 'shader-reload' || data.event === 'reload') {
    errors.hide();
  }
  if (data.event === 'shader-reload' && data.updates && data.updates.length > 0) {
    reloadShaders(data.updates);
  } else if (data.event === 'shader-error' && data.error) {
    errors.show(data.error);
  }
});
