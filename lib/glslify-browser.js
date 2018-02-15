// From:
// https://github.com/glslify/glslify/blob/master/browser.js

// Included manually in this module to speed up install time.

module.exports = function (strings) {
  if (typeof strings === 'string') strings = [strings];
  var exprs = [].slice.call(arguments, 1);
  var parts = [];
  for (var i = 0; i < strings.length - 1; i++) {
    parts.push(strings[i], exprs[i] || '');
  }
  parts.push(strings[i]);
  return parts.join('');
};
