const Git = require('git-revision-webpack-plugin');
const readArgv = require('read-argv');
const { resolve, dirname } = require('path');
const { params } = require('./@/env');
const banner = require('./@/banner');

exports.pack = require('../package.json');

exports.source = resolve(dirname(exports.pack.module));

exports.git = new Git({ lightweightTags: true, branch: true });

exports.argv = readArgv(process.argv);

exports.env = params(process.env);

exports.flag = banner(exports.pack, exports.git);
