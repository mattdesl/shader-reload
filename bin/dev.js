#!/usr/bin/env node
const budoAttach = require('./budo-attach');

const newArgs = [
  '-t', require.resolve('glslify'),
  '-t', require.resolve('../transform.js')
];

// insert a full stop for budo
let args = process.argv.slice(2);
if (args.indexOf('--') === -1) {
  args.push('--');
}

// insert new arguments with local transforms
args = args.concat(newArgs);

const app = require('budo').cli(args, {
  live: false // ignore --live CLI option
});

if (app) {
  budoAttach(app);
}
