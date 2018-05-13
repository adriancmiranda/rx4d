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
	backspace: '[\\b]',
	wordBoundary: '\\b',
	nonWordBoundary: '\\B',
	digit: '\\d',
	nonDigit: '\\D',
	formFeed: '\\f',
	lineFeed: '\\n',
	carriageReturn: '\\r',
	whiteSpace: '\\s',
	notWhiteSpace: '\\S',
	tab: '\\t',
	verticalTab: '\\v',
	alphanumeric: '\\w',
	alphanumerical: '\\w',
	nonWord: '\\W',
	nul: '\\0',
	nil: '\\0',
	lowercase: '[a-z]',
	uppercase: '[A-Z]',
	letter: '[a-zA-Z]',
	numeric: '[0-9]',
	varchar: '[a-zA-Z_$][0-9a-zA-Z_$]',
	eol: '(?:(?:\\n)|(?:\\r\\n))',
	quote: escapeRegExp,
	repeat: self => `${self}`,
	value: (self, value) => `${self}${value}`,
	unicode: (self, value) => `${self}\\u${value}`,
	control: (self, value) => `${self}\\c${value}`,
	notRemember: (self, value) => `${self}(?:${value})`,
	ifFollowedBy: (self, value) => `${self}(?=${value})`,
	ifNotFollowedBy: (self, value) => `${self}(?!${value})`,
	notCharset: (self, value) => `${self}[^${value}]`,
	charset: (self, value) => `${self}[${value}]`,
	size: (self, value) => `${self}{${0 | value}}`,
	atLeast: (self, value) => `${self}{${0 | value},}`,
	atMost: (self, value) => `${self}{,${0 | value}}`,
	group: (self, value) => `${self}(${value})`,
	range: (self, min, max) => `${self}{${0 | min},${0 | max}}`,
	replace: (self, pattern, replacement) => self.replace(pattern, replacement),
	flags: (self, value) => new RegExp(self, value),
};

const { assign } = Object;
const match = objectChain(compositions);
const rules = (custom, override) => {
	if (custom === undefined || custom === null) return match;
	return objectChain(assign({}, custom, compositions, override));
};

export { rules, match };
