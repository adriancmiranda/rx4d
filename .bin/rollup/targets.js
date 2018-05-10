const { as, is } = require('describe-type');
const { env, flag } = require('../config');

const defaultFormats = ['umd'];

const target = (name, outputPath, format) => ({
  sourcemap: env.MINIFY,
  file: `${outputPath}${env.USE_FILE_FORMAT ? `.${format}` : ''}${env.MINIFY ? '.min' : ''}.js`,
  banner: env.SIGN ? flag : '',
  indent: env.INDENT,
  format,
  name,
});

exports.parseFormats = ({ formats }) => {
  formats = is.string(formats) ? [formats] : formats;
  formats = as(Array, formats, defaultFormats);
  return formats;
};

exports.hasFormat = (file, format) => {
  const formats = exports.parseFormats(file);
  return formats.indexOf(format) !== -1;
};

exports.parseOutput = ({ module, output, formats }) => {
  formats = exports.parseFormats({ formats });
  return formats.map(format => target(module, output, format));
};
