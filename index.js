/*!
 *    /     '      /  /
 *   /__      ___ (  /
 *   \--`-'-|`---\ |
 *    |' _/   ` __/ /
 *    '._  W    ,--'
 *       |_:_._/
 *
 * ~~~~~~~~~~ rx4d v1.2.4
 *
 * @commit 82ba48a475176ded8a4b6c4bd3df04a1f96a04dd
 * @moment Wednesday, May 16, 2018 12:21 PM
 * @homepage https://github.com/adriancmiranda/rx4d#readme
 * @author Adrian C. Miranda
 * @license (c) 2016-2021 Adrian C. Miranda
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.rx4d = {})));
}(this, (function (exports) { 'use strict';

	/**
	 *
	 * @function
	 * @memberof is
	 * @param {any} value
	 * @returns {Boolean}
	 */
	function number(value) {
		return typeof value === 'number' || value instanceof Number;
	}

	/**
	 *
	 * @function
	 * @memberof is
	 * @param {any} value
	 * @returns {Boolean}
	 */
	function string(value) {
		return typeof value === 'string' || value instanceof String;
	}

	/**
	 *
	 * @function
	 * @memberof is
	 * @param {any} value
	 * @returns {Boolean}
	 */
	function callable(value) {
		return typeof value === 'function';
	}

	/**
	 *
	 * @function
	 * @memberof is
	 * @param {any} value
	 * @returns {Boolean}
	 */
	function array(value) {
		if (value == null) { return false; }
		return value.constructor === Array;
	}

	/**
	 *
	 * @function
	 * @memberof is
	 * @param {any} value
	 * @returns {Boolean}
	 */
	function arraylike(value) {
		return array(value) || string(value) || (
			(!!value && typeof value === 'object' && typeof value.length === 'number') &&
			(value.length === 0 || (value.length > 0 && (value.length - 1) in value))
		);
	}

	/**
	 *
	 * @param {Function} cmd - .
	 * @param {any} context - .
	 * @returns {any}
	 */
	function apply(cmd, context, args, blindly) {
		try {
			var $ = arraylike(args) ? args : [];
			switch ($.length) {
				case 0: return cmd.call(context);
				case 1: return cmd.call(context, $[0]);
				case 2: return cmd.call(context, $[0], $[1]);
				case 3: return cmd.call(context, $[0], $[1], $[2]);
				case 4: return cmd.call(context, $[0], $[1], $[2], $[3]);
				case 5: return cmd.call(context, $[0], $[1], $[2], $[3], $[4]);
				case 6: return cmd.call(context, $[0], $[1], $[2], $[3], $[4], $[5]);
				case 7: return cmd.call(context, $[0], $[1], $[2], $[3], $[4], $[5], $[6]);
				case 8: return cmd.call(context, $[0], $[1], $[2], $[3], $[4], $[5], $[6], $[7]);
				case 9: return cmd.call(context, $[0], $[1], $[2], $[3], $[4], $[5], $[6], $[7], $[8]);
				default: return cmd.apply(context, $);
			}
		} catch (err) {
			if (blindly) { return err; }
			throw err;
		}
	}

	var setPrototypeOf = Object.setPrototypeOf;
	var defineProperties = Object.defineProperties;
	var create = Object.create;
	var keys = Object.keys;
	var arrayFrom = Array.from;

	var processArgs = function (args, initialValue) { return (
		arrayFrom(args).reduce(function (acc, arg) {
			acc[acc.length] = callable(arg) ? arg() : arg;
			return acc;
		}, initialValue)
	); };

	var transform = function (object, middleware) {
		function chain() {
			var ctx = this;
			var last = '';
			var pattern = this.object.reduce(function (acc, item) {
				if (callable(object[item.name])) {
					var args = processArgs(item.args, [acc, last]);
					acc = apply(object[item.name], ctx, args);
					last = acc;
				} else {
					acc += object[item.name];
					last = object[item.name];
				}
				return acc;
			}, last);
			return middleware ? apply(middleware, this, [pattern, arguments], true) : pattern;
		}

		function connect(data) {
			function link() { return apply(chain, link, arguments); }
			link.object = data;
			setPrototypeOf(link, proto);
			return link;
		}

		var descriptors = keys(object).reduce(function (acc, name) {
			var obj;
			var isfn = callable(object[name]);
			acc[name] = (obj = {}, obj[isfn ? 'value' : 'get'] = function connector() {
					return connect(this.object.concat({ name: name, args: arguments }));
				}, obj);
			return acc;
		}, create(null));

		var proto = defineProperties(function ObjectChain() {}, descriptors);
		return defineProperties({ object: object }, keys(descriptors).reduce(function (acc, name) {
			var obj;
			var isfn = callable(object[name]);
			acc[name] = (obj = {}, obj[isfn ? 'value' : 'get'] = function startup() {
					return connect([{ name: name, args: arguments }]);
				}, obj);
			return acc;
		}, create(null)));
	};

	var reEscapeRegExp = /[-[/\]{}()*+?.,\\^$|#\s]/g;

	var escapeRegExp = function (input) {
		input = string(input) ? input : '';
		reEscapeRegExp.lastIndex = 0;
		return input.replace(reEscapeRegExp, '\\$&');
	};

	var src = function (input) {
		if (input === undefined) { return 'undefined'; }
		if (input === null) { return 'null'; }
		if (input.source) { return src(input.source); }
		return input;
	};

	var val = function (input) {
		input = src(input);
		return number(input) ? input : escapeRegExp(input);
	};

	var compositions = {
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
		quote: function (self, last, input) { return ("" + self + (val(input))); },
		value: function (self, last, input) { return ("" + self + (src(input))); },
		plus: function (self, last, input) { return ("" + self + (src(input))); },
		unicode: function (self, last, input) { return (self + "\\u" + input); },
		control: function (self, last, input) { return (self + "\\c" + input); },
		notRemember: function (self, last, input) { return (self + "(?:" + (src(input)) + ")"); },
		then: function (self, last, input) { return (self + "(?:" + (src(input)) + ")"); },
		find: function (self, last, input) { return (self + "(?:" + (src(input)) + ")"); },
		maybe: function (self, last, input) { return (self + "(?:" + (src(input)) + ")*"); },
		maybeOne: function (self, last, input) { return (self + "(?:" + (src(input)) + ")?"); },
		ifFollowedBy: function (self, last, input) { return (self + "(?=" + (src(input)) + ")"); },
		ifNotFollowedBy: function (self, last, input) { return (self + "(?!" + (src(input)) + ")"); },
		anythingBut: function (self, last, input) { return (self + "(?:[^" + (src(input)) + "]*)"); },
		somethingBut: function (self, last, input) { return (self + "(?:[^" + (src(input)) + "]+)"); },
		notCharset: function (self, last, input) { return (self + "[^" + (src(input)) + "]"); },
		charset: function (self, last, input) { return (self + "[" + (src(input)) + "]"); },
		any: function (self, last, input) { return (self + "[" + (src(input)) + "]"); },
		anyOf: function (self, last, input) { return (self + "[" + (src(input)) + "]"); },
		group: function (self, last, input) { return (self + "(" + (src(input)) + ")"); },
		size: function (self, last, input) { return (self + "{" + (0 | input) + "}"); },
		atLeast: function (self, last, input) { return (self + "{" + (0 | input) + ",}"); },
		atMost: function (self, last, input) { return (self + "{," + (0 | input) + "}"); },
		range: function (self, last, min, max) { return (self + "{" + (0 | min) + "," + (0 | max) + "}"); },
		repeat: function (self, last, times) { return ("" + self + (new Array((0 | times) + 1).join(last))); },
		replace: function (self, last, pattern, replacement) { return self.replace(pattern, replacement); },
		flags: function (self, last, input) { return new RegExp(self, input); },
		either: function (self, last) {
			var rest = [], len = arguments.length - 2;
			while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];
			return ("" + self + (rest.join('|')));
		},
	};

	var assign = Object.assign;
	var match = transform(compositions);
	var rules = function (custom, override, middleware) {
		if (custom === undefined || custom === null) { return match; }
		return transform(assign({}, custom, compositions, override), middleware);
	};

	exports.rules = rules;
	exports.match = match;
	exports.src = src;
	exports.val = val;

	Object.defineProperty(exports, '__esModule', { value: true });
})));
