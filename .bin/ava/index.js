#! /usr/bin/env node
const { as } = require('describe-type');
const { join, resolve } = require('path');
const { argv } = require('../config');
const spawn = require('../@/spawn');

const args = argv.$.slice(3);
const scripts = argv._;
const context = as(String, argv.dir, 'test/**');
const pattern = scripts.length > 1 ? `{${scripts.join(',')}}` : scripts[0] || '*';
const files = resolve(`${join(context, pattern)}?(.unit).js`);

try {
  spawn.sync('ava', [files].concat(args));
} catch (err) {
  console.error(err);
}
