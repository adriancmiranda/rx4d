import number from 'describe-type/source/is/number';
import string from 'describe-type/source/is/string';
import objectChain from 'object-chain';

const reEscapeRegExp = /[-[/\]{}()*+?.,\\^$|#\s]/g;

const escapeRegExp = (input) => {
	input = string(input) ? input : '';
	reEscapeRegExp.lastIndex = 0;
	return input.replace(reEscapeRegExp, '\\$&');
};

const src = (input) => {
	if (input === undefined) return 'undefined';
	if (input === null) return 'null';
	if (input.source) return src(input.source);
	return input;
};

const val = (input) => {
	input = src(input);
	return number(input) ? input : escapeRegExp(input);
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
	lineBreak: '\\r\\n?|\\n|\\u2028|\\u2029',
	carriageReturn: '\\r',
	whiteSpace: '\\s',
	notWhiteSpace: '\\S',
	nonASCIIwhitespace: '[\\u1680\\u180e\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]',
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
	quote: (self, last, input) => `${self}${val(input)}`,
	value: (self, last, input) => `${self}${src(input)}`,
	plus: (self, last, input) => `${self}${src(input)}`,
	unicode: (self, last, input) => `${self}\\u${input}`,
	control: (self, last, input) => `${self}\\c${input}`,
	notRemember: (self, last, input) => `${self}(?:${src(input)})`,
	then: (self, last, input) => `${self}(?:${src(input)})`,
	find: (self, last, input) => `${self}(?:${src(input)})`,
	maybe: (self, last, input) => `${self}(?:${src(input)})*`,
	maybeOne: (self, last, input) => `${self}(?:${src(input)})?`,
	ifFollowedBy: (self, last, input) => `${self}(?=${src(input)})`,
	ifNotFollowedBy: (self, last, input) => `${self}(?!${src(input)})`,
	anythingBut: (self, last, input) => `${self}(?:[^${src(input)}]*)`,
	somethingBut: (self, last, input) => `${self}(?:[^${src(input)}]+)`,
	notCharset: (self, last, input) => `${self}[^${src(input)}]`,
	charset: (self, last, input) => `${self}[${src(input)}]`,
	any: (self, last, input) => `${self}[${src(input)}]`,
	anyOf: (self, last, input) => `${self}[${src(input)}]`,
	group: (self, last, input) => `${self}(${src(input)})`,
	size: (self, last, input) => `${self}{${0 | input}}`,
	atLeast: (self, last, input) => `${self}{${0 | input},}`,
	atMost: (self, last, input) => `${self}{,${0 | input}}`,
	range: (self, last, min, max) => `${self}{${0 | min},${0 | max}}`,
	repeat: (self, last, times) => `${self}${new Array((0 | times) + 1).join(last)}`,
	replace: (self, last, pattern, replacement) => self.replace(pattern, replacement),
	flags: (self, last, input) => new RegExp(self, input),
	either: (self, last, ...rest) => `${self}${rest.join('|')}`,
};

const { assign } = Object;
const match = objectChain(compositions);
const rules = (custom, override, middleware) => {
	if (custom === undefined || custom === null) return match;
	return objectChain(assign({}, custom, compositions, override), middleware);
};

export { rules, match, src, val };
