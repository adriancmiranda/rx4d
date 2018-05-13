import string from 'describe-type/source/is/string';
import objectChain from 'object-chain';

const reEscapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;
const escapeRegExp = (value) => {
	value = string(value) ? value : '';
	reEscapeRegExp.lastIndex = 0;
	return value.replace(reEscapeRegExp, '\\$&');
};

const compositions = {
	beginningOfInput: '^',
	endOfInput: '$',
	anySingleCharExceptTheNewline: '.',
	anySingleChar: '[\\s\\S]',
	somethingExceptTheNewline: '(?:.+)',
	something: '(?:[\\s\\S]+)',
	anythingExceptTheNewline: '(?:.*)',
	anything: '(?:[\\s\\S]*)',
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
	startCapture: '(',
	endCapture: ')',
	startGroup: '(',
	endGroup: ')',
	startCharset: '[',
	endCharset: ']',
	quote: (self, last, value) => `${self}${escapeRegExp(value)}`,
	value: (self, last, value) => `${self}${value}`,
	unicode: (self, last, value) => `${self}\\u${value}`,
	control: (self, last, value) => `${self}\\c${value}`,
	notRemember: (self, last, value) => `${self}(?:${value})`,
	then: (self, last, value) => `${self}(?:${value})`,
	find: (self, last, value) => `${self}(?:${value})`,
	maybe: (self, last, value) => `${self}(?:${value})?`,
	anythingBut: (self, last, value) => `${self}(?:[^${value}]*)`,
	somethingBut: (self, last, value) => `${self}(?:[^${value}]+)`,
	ifFollowedBy: (self, last, value) => `${self}(?=${value})`,
	ifNotFollowedBy: (self, last, value) => `${self}(?!${value})`,
	notCharset: (self, last, value) => `${self}[^${value}]`,
	charset: (self, last, value) => `${self}[${value}]`,
	any: (self, last, value) => `${self}[${value}]`,
	anyOf: (self, last, value) => `${self}[${value}]`,
	size: (self, last, value) => `${self}{${0 | value}}`,
	atLeast: (self, last, value) => `${self}{${0 | value},}`,
	atMost: (self, last, value) => `${self}{,${0 | value}}`,
	group: (self, last, value) => `${self}(${value})`,
	range: (self, last, min, max) => `${self}{${0 | min},${0 | max}}`,
	repeat: (self, last, times) => `${self}${new Array((0 | times) + 1).join(last)}`,
	replace: (self, last, pattern, replacement) => self.replace(pattern, replacement),
	flags: (self, last, value) => new RegExp(self, value),
	either: (self, last, ...rest) => `${self}${rest.join('|')}`,
};

const { assign } = Object;
const match = objectChain(compositions);
const rules = (custom, override, middleware) => {
	if (custom === undefined || custom === null) return match;
	return objectChain(assign({}, custom, compositions, override), middleware);
};

export { rules, match };
