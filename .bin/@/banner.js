const pirateFlag = require('pirate-flag');
const moment = require('moment');

const assign = Object.assign;

moment.locale();

module.exports = (pack, git, options) => pirateFlag(pack, {
  commit: git.commithash(),
  moment: moment().format('LLLL'),
  homepage: pack.homepage,
  author: pack.author,
  license: `(c) 2016-${+moment().format('GGGG') + 3} Adrian C. Miranda\n`,
}, assign({ comment: true }, options));
