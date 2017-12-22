#!/usr/bin/env node
const budoAttach = require('./budo-attach');

const app = require('budo').cli(process.argv.slice(2), {
  browserify: {
    transform: [
      require('glslify'),
      require('../transform')
    ]
  }
});

if (app) {
  budoAttach(app);
}
