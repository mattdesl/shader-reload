var listener = require('./lib/websocket-listener');
var Shader = require('./lib/Shader');
var errors = require('./lib/error-reporter');
var receiver = require('./receiver');

var shaderMap = {};

module.exports = createShader;
function createShader (opt, filename) {
  opt = opt || {};
  var shader = new Shader(opt);
  if (shaderMap && typeof filename === 'string') {
    if (filename in shaderMap) {
      // File already exists in cache, we could warn the user...?
    }
    shaderMap[filename] = shader;
  }
  return shader;
}

function reloadShaders (updates) {
  if (!shaderMap) return;
  updates = (Array.isArray(updates) ? updates : [ updates ]).filter(Boolean);
  if (updates.length === 0) return;

  var hasTouched = false;
  var hasChanged = false;
  updates.forEach(function (update) {
    var file = update.file;
    if (!file) {
      // No file field, just skip this...
      return;
    }
    if (file in shaderMap) {
      var shader = shaderMap[file];
      var oldVertex = shader.vertex;
      var oldFragment = shader.fragment;
      shader.vertex = update.vertex || '';
      shader.fragment = update.fragment || '';
      shader.emit('touch');
      hasTouched = true;
      if (oldVertex !== shader.vertex || oldFragment !== shader.fragment) {
        shader.emit('change');
        shader.version++;
        hasChanged = true;
      }
    } else {
      // We have a file field but somehow it didn't end up in our shader map...
      // Maybe user isn't using the reload-shader function?
    }
  });

  // broadcast change events
  if (hasTouched) receiver.emit('touch');
  if (hasChanged) receiver.emit('change');
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
