// Here we use RawShaderMaterial, but it would also
// work with ShaderMaterial.

// We hook into needsUpdate so it will lazily check
// shader updates every frame of rendering.

var inherits = require('util').inherits;
var isDevelopment = process.env.NODE_ENV !== 'production';

function LiveShader (shader, parameters) {
  parameters = parameters || {};
  THREE.RawShaderMaterial.call(this, parameters);
  this.shader = shader;
  if (this.shader) {
    this.vertexShader = this.shader.vertex;
    this.fragmentShader = this.shader.fragment;
  }
  this.shaderVersion = this.shader ? this.shader.version : undefined;
  this._needsUpdate = true;
}

inherits(LiveShader, THREE.RawShaderMaterial);

// Handle material.clone() and material.copy() functions properly
LiveShader.prototype.copy = function (source) {
  THREE.RawShaderMaterial.prototype.copy.call(this, source);
  this.shader = source.shader;
  this.shaderVersion = this.shader.version;
  this.vertexShader = this.shader.vertex;
  this.fragmentShader = this.shader.fragment;
  return this;
};

// Check if shader is out of date, if so we should mark this as dirty
LiveShader.prototype.isShaderUpdate = function () {
  const shader = this.shader;

  var dirty = false;
  if (isDevelopment) {
    // If source has changed, recompile.
    // We could also do a string equals check, but since this is
    // done per frame across potentially thousands of objects,
    // it's probably better to just use the integer version check.
    dirty = this.shaderVersion !== shader.version;
    if (dirty) {
      this.shaderVersion = shader.version;
      this.vertexShader = shader.vertex;
      this.fragmentShader = shader.fragment;
      this.needsUpdate = true;
    }
  }

  return dirty;
};

// Hook into needsUpdate so we can check shader version per frame
Object.defineProperty(LiveShader.prototype, 'needsUpdate', {
  get: function () {
    return this.isShaderUpdate() || this._needsUpdate;
  },
  set: function (v) {
    this._needsUpdate = v;
  }
});

module.exports = LiveShader;
