import nil from 'describe-type/source/is/nil';
import undef from 'describe-type/source/is/undef';
import number from 'describe-type/source/is/number';
import string from 'describe-type/source/is/string';
import objectChain from 'object-chain';
import Rx from './rx.next';

const RE_ESCAPE_REGEXP = /[-[/\]{}()*+?.,\\^$|#\s]/g;
const RE_UNICODE_PREFIX = /^\\[xu]{1}/;

const escapeRegExp = (input) => {
	input = string(input) ? input : '';
	RE_ESCAPE_REGEXP.lastIndex = 0;
	return input.replace(RE_ESCAPE_REGEXP, '\\$&');
};

const repeat = (input, count) => {
	count = 0 | count;
	return new Array(size < 0 ? 0 : size + 1).join(input);
};

const pad = (input, width) => (
	input.length < width ? repeat(input, width) : input
);

const src = (input) => {
	if (undef(input)) return 'undefined';
	if (nil(input)) return 'null';
	if (input.source) return src(input.source);
	return input;
};

const val = (input) => {
	input = src(input);
	return number(input) ? input : escapeRegExp(input);
};

const code = (input) => {
	input = src(input);
	const isstr = string(input);
	if (isstr && RE_UNICODE_PREFIX.test(input)) {
		return input;
	} else if (isstr || number(input)) {
		const hex = input.toString(16);
		if (hex.length < 3) return `\\x${pad(0, 2)}${hex}`;
		return `\\u${pad(0, 4)}${hex}`;
	}
	return isstr ? input : '';
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
	nonASCIIWhiteSpace: '[\\u1680\\u180e\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]',
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
	u: (self, last, input) => `${self}\\u${input}`,
	x: (self, last, input) => `${self}\\x${input}`,
	unicode: (self, last, input) => `${self}${code(input)}`,
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
	repeat: (self, last, count) => `${self}${repeat(last, count)}`,
	replace: (self, last, pattern, replacement) => self.replace(pattern, replacement),
	flags: (self, last, input) => new Rx(self, input),
	either: (self, last, ...rest) => `${self}${rest.join('|')}`,
};

const { assign } = Object;
const match = objectChain(compositions);
const rules = (custom, override, middleware) => {
	if (undef(custom) || nil(custom)) return match;
	return objectChain(assign({}, custom, compositions, override), middleware);
};

export { rules, match, src, val, code, pad, repeat };
