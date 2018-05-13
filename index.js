/*!
 *    /     '      /  / 
 *   /__      ___ (  /   
 *   \--`-'-|`---\ |  
 *    |' _/   ` __/ /   
 *    '._  W    ,--'   
 *       |_:_._/         
 *                       
 * ~~~~~~~~~~ rx4d v1.1.1
 * 
 * @commit 12250e326a3def0585e81d9db53f40fd0398355f
 * @moment Saturday, May 12, 2018 10:04 PM
 * @homepage https://github.com/adriancmiranda/rx4d#readme
 * @author Adrian C. Miranda
 * @license (c) 2016-2021 Adrian C. Miranda
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.objectChain = {})));
}(this, (function (exports) { 'use strict';

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
			var this$1 = this;

			var pattern = this.object.reduce(function (acc, item) {
				if (callable(object[item.name])) {
					var args = processArgs(item.args, [acc]);
					acc = apply(object[item.name], this$1, args);
				} else {
					acc += object[item.name];
				}
				return acc;
			}, '');
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
			acc[name] = ( obj = {}, obj[isfn ? 'value' : 'get'] = function connector() {
					return connect(this.object.concat({ name: name, args: arguments }));
				}, obj );
			return acc;
		}, create(null));

		var proto = defineProperties(function ObjectChain() {}, descriptors);
		return defineProperties({ object: object }, keys(descriptors).reduce(function (acc, name) {
			var obj;

			var isfn = callable(object[name]);
			acc[name] = ( obj = {}, obj[isfn ? 'value' : 'get'] = function startup() {
					return connect([{ name: name, args: arguments }]);
				}, obj );
			return acc;
		}, create(null)));
	};

	var reEscapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;
	var escapeRegExp = function (self, value) {
		value = string(value) ? value : '';
		reEscapeRegExp.lastIndex = 0;
		return value.replace(reEscapeRegExp, '\\$&');
	};

	var compositions = {
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
		repeat: function (self) { return ("" + self); },
		value: function (self, value) { return ("" + self + value); },
		unicode: function (self, value) { return (self + "\\u" + value); },
		control: function (self, value) { return (self + "\\c" + value); },
		notRemember: function (self, value) { return (self + "(?:" + value + ")"); },
		ifFollowedBy: function (self, value) { return (self + "(?=" + value + ")"); },
		ifNotFollowedBy: function (self, value) { return (self + "(?!" + value + ")"); },
		notCharset: function (self, value) { return (self + "[^" + value + "]"); },
		charset: function (self, value) { return (self + "[" + value + "]"); },
		size: function (self, value) { return (self + "{" + (0 | value) + "}"); },
		atLeast: function (self, value) { return (self + "{" + (0 | value) + ",}"); },
		atMost: function (self, value) { return (self + "{," + (0 | value) + "}"); },
		group: function (self, value) { return (self + "(" + value + ")"); },
		range: function (self, min, max) { return (self + "{" + (0 | min) + "," + (0 | max) + "}"); },
		replace: function (self, pattern, replacement) { return self.replace(pattern, replacement); },
		flags: function (self, value) { return new RegExp(self, value); },
	};

	var assign = Object.assign;
	var match = transform(compositions);
	var rules = function (custom, override) {
		if (custom === undefined || custom === null) { return match; }
		return transform(assign({}, custom, compositions, override));
	};

	exports.rules = rules;
	exports.match = match;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
