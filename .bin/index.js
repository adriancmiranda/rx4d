const { env } = require('./config');
const rollup = require('./rollup');

module.exports = ([{
  module: 'rx4d',
  source: 'index.next',
  output: 'index',
  format: env.FORMATS,
}]).map(file => rollup(file));
