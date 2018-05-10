const cross = require('cross-spawn');
const parse = require('cross-spawn/lib/parse');
const enoent = require('cross-spawn/lib/enoent');
const processExit = require('./processExit');

function spawn(cmd, args, options) {
  const opts = options == null ? { stdio: 'inherit' } : options;
  const childProcess = cross(cmd, args, opts);
  return childProcess;
}

function spawnSync(cmd, args, options) {
  const opts = options == null ? { stdio: 'inherit' } : options;
  const result = cross.sync(cmd, args, opts);
  const error = processExit(result.code, result.signal);
  if (error) throw error;
  return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;
module.exports._processExit = processExit;
module.exports._parse = parse;
module.exports._enoent = enoent;
