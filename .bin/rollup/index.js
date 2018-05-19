const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const optimizeJs = require('rollup-plugin-optimize-js');
const filesize = require('rollup-plugin-filesize');
const buble = require('rollup-plugin-buble');
const { terser } = require('rollup-plugin-terser');
const { minify } = require('uglify-es');
const { env, flag } = require('../config');
const targets = require('./targets');
const watch = require('./watch');

module.exports = file => ({
  watch,
  input: file.source,
  output: targets.parseOutput(file),
  plugins: [
    buble(),
    nodeResolve({ jsnext: true, main: true, browser: !targets.hasFormat(file, 'cjs') }),
    commonjs(),
  ].concat(file.plugins || []).concat(env.MINIFY ? [
    terser({ output: { preamble: flag, ascii_only: true } }, minify),
    optimizeJs(),
  ].concat(env.GZIP ? [filesize()] : []) : []),
});
