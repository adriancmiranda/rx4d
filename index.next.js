import string from 'describe-type/source/is/string';
import objectChain from 'object-chain';

const reEscapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;
const escapeRegExp = (self, value) => {
	value = string(value) ? value : '';
	reEscapeRegExp.lastIndex = 0;
	return value.replace(reEscapeRegExp, '\\$&');
};

const { assign } = Object;
const rx4d = (customRules) => (
	objectChain(assign({}, customRules, {
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
	}))
);

export default rx4d();
