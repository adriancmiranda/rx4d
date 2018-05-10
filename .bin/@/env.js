const { is } = require('describe-type');

const create = Object.create;
const keys = Object.keys;

exports.param = key => {
  const multi = /,/;
  if (is.string(key) && multi.test(key)) {
    key = key.split(multi);
  }
  if (/^false$/i.test(key)) {
    return false;
  }
  if (/^true$/i.test(key)) {
    return true;
  }
  if (/^([0-9]+|NaN|Infinity)$/.test(key)) {
    return Number(key);
  }
  return key;
};

exports.params = env => {
  return keys(env || '').reduce((params, key) => {
    params[key] = exports.param(env[key]);
    return params;
  }, create(null));
};
