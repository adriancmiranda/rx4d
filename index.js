const objectChain = require('object-chain');

const rx4d = (fn) => function _() {
	return fn.apply(this, Array.from(arguments).reduce((acc, arg, i) => {
		if (typeof arg === 'function') arguments[i] = arg();
		return acc;
	}, arguments));
};

const reEscapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;
const escapeRegExp = (self, value) => {
	value = typeof value === 'string' || value instanceof String ? value : '';
	reEscapeRegExp.lastIndex = 0;
	return value.replace(reEscapeRegExp, '\\$&');
};

module.exports = objectChain({
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
	upercaseVowel: '[AEIOU]',
	lowercaseVowel: '[aeiou]',
	uppercaseConsonant: '[B-DF-HJ-NP-TV-Z]',
	lowercaseConsonant: '[b-df-hj-np-tv-z]',
	lowercase: '[a-z]',
	uppercase: '[A-Z]',
	letter: '[a-zA-Z]',
	numeric: '[0-9]',
	varchar: '[$0-9A-Za-z_\\s]',
	eol: '(?:(?:\\n)|(?:\\r\\n))',
	quote: rx4d(escapeRegExp),
	value: rx4d((self, value) => value),
	controlChar: rx4d((self, value) => `\\c${value}`),
	notRemember: rx4d((self, value) => `(?:${value})`),
	ifFollowedBy: rx4d((self, value) => `(?=${value})`),
	ifNotFollowedBy: rx4d((self, value) => `(?!${value})`),
	notCharset: rx4d((self, value) => `[^${value}]`),
	charset: rx4d((self, value) => `[${value}]`),
	size: rx4d((self, value) => `{${0 | value}}`),
	atLeast: rx4d((self, value) => `{${0 | value},}`),
	atMost: rx4d((self, value) => `{,${0 | value}}`),
	group: rx4d((self, value) => `(${value})`),
	range: rx4d((self, min, max) => `{${0 | min},${0 | max}}`),
	flags: rx4d((self, value) => new RegExp(self, value)),
});
