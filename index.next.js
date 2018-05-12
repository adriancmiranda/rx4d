import string from 'describe-type/source/is/string';
import objectChain from 'object-chain';

const reEscapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;
const escapeRegExp = (self, value) => {
	value = string(value) ? value : '';
	reEscapeRegExp.lastIndex = 0;
	return value.replace(reEscapeRegExp, '\\$&');
};

const compositions = {
	beginningOfInput: '^',
	endOfInput: '$',
	anySingleCharExceptTheNewline: '.',
	zeroOrMoreTimes: '*',
	oneOrMoreTimes: '+',
	zeroOrOneTime: '?',
	or: '|',
	escape: '\\',
	backslash: '\\',
	backspace: '\\b',
	nonWordBoundary: '\\B',
	digit: '\\d',
	nonDigitChar: '\\D',
	formFeed: '\\f',
	lineFeed: '\\n',
	carriageReturn: '\\r',
	whiteSpace: '\\s',
	tab: '\\t',
	verticalTab: '\\v',
	alphanumeric: '\\w',
	nonWordChar: '\\W',
	nil: '\\0',
	lowercase: '[a-z]',
	uppercase: '[A-Z]',
	letter: '[a-zA-Z]',
	numeric: '[0-9]',
	varchar: '[a-zA-Z_$][0-9a-zA-Z_$]',
	eol: '(?:(?:\\n)|(?:\\r\\n))',
	quote: escapeRegExp,
	repeat: self => self,
	value: (self, value) => value,
	controlChar: (self, value) => `\\c${value}`,
	notRemember: (self, value) => `(?:${value})`,
	ifFollowedBy: (self, value) => `(?=${value})`,
	ifNotFollowedBy: (self, value) => `(?!${value})`,
	notCharset: (self, value) => `[^${value}]`,
	charset: (self, value) => `[${value}]`,
	size: (self, value) => `{${0 | value}}`,
	atLeast: (self, value) => `{${0 | value},}`,
	atMost: (self, value) => `{,${0 | value}}`,
	group: (self, value) => `(${value})`,
	range: (self, min, max) => `{${0 | min},${0 | max}}`,
	flags: (self, value) => new RegExp(self, value),
};

const { assign } = Object;
const match = objectChain(compositions);
const rules = (custom, override) => {
	if (custom === undefined || custom === null) return match;
	return objectChain(assign({}, custom, compositions, override));
};

export { rules, match };
