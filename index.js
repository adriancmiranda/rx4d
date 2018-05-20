/*!
 *    /     '      /  / 
 *   /__      ___ (  /   
 *   \--`-'-|`---\ |  
 *    |' _/   ` __/ /   
 *    '._  W    ,--'   
 *       |_:_._/         
 *                       
 * ~~~~~~~~~~ rx4d v1.3.0
 * 
 * @commit 8869af1335903f41018113534c5fdd2564af91f6
 * @moment Sunday, May 20, 2018 2:39 PM
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
	 * @param {any}
	 * @returns {Boolean}
	 */
	function nil(value) {
		return value === null;
	}

	/**
	 *
	 * @function
	 * @memberof is
	 * @param {any}
	 * @returns {Boolean}
	 */
	function undef(value) {
		return value === undefined;
	}

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
			var this$1 = this;

			var last = '';
			var pattern = this.object.reduce(function (acc, item) {
				if (callable(object[item.name])) {
					var args = processArgs(item.args, [acc, last]);
					acc = apply(object[item.name], this$1, args);
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

	/**
	 *
	 * @function
	 * @memberof is
	 * @param {any} value
	 * @returns {Boolean}
	 */
	function regexp(value) {
		if (value == null) { return false; }
		return value.constructor === RegExp;
	}

	var RE_IDENTIFIER = /([a-zA-Z_$][0-9a-zA-Z_$]{0,50})/;
	var RE_IDENTIFIER_REPLACE = new RegExp(("\\$\\+{" + (RE_IDENTIFIER.source) + "}"), 'g');
	var RE_GROUP_B = /^\?[:!=]/;
	var RE_GROUPS = /([\\]?[()])/g;
	var keys$1 = Object.keys;

	function toObject(value) {
		var object = { source: '', flags: '', groups: [] };
		if (regexp(value)) {
			object.groups = value.source.split(RE_GROUPS);
			object.source = value.source;
			object.flags = value.flags;
		}
		return object;
	}

	function reduceGroups(object, chunk, index, groups) {
		switch(chunk) {
			case '(':
			case ')':
			default: RE_GROUP_B.lastIndex = 0;
			if (groups[index - 1] === '(' && RE_GROUP_B.test(chunk) === false) ;
		}
		return object.source;
	}

	function getGroupExtension(source, flags) {
		var object = toObject(source, flags);
		object.source = object.groups.reduce(reduceGroups, object);
		return object;
	}

	var Rx = (function (RegExp) {
		function Rx(source, flags) {
			var object = getGroupExtension(source, flags);
			RegExp.call(this, object.source, object.flags);
			this.groups = object.groups;
		}

		if ( RegExp ) Rx.__proto__ = RegExp;
		Rx.prototype = Object.create( RegExp && RegExp.prototype );
		Rx.prototype.constructor = Rx;

		Rx.prototype.exec = function exec (value) {
			var this$1 = this;

			var object = RegExp.prototype.exec.call(this, value);
			if (object) {
				object.groups = {};
				keys$1(this.groups).forEach(function (name) {
					object.groups[name] = object[this$1.groups[name]];
				}, this);
			}
			return object;
		};

		Rx.prototype[Symbol.replace] = function (pattern, replacement) {
			var ctx = this;
			if (string(replacement)) {
				replacement = replacement.replace(RE_IDENTIFIER_REPLACE, function (m, name) { return (
					("$" + (ctx.groups[name] || ''))
				); });
			}
			return pattern.replace(ctx, replacement);
		};

		Rx.prototype[Symbol.match] = function (value) {
			return this.exec(value);
		};

		return Rx;
	}(RegExp));

	var RE_ESCAPE_REGEXP = /[-[/\]{}()*+?.,\\^$|#\s]/g;
	var RE_UNICODE_PREFIX = /^\\[xu]{1}/;

	var escapeRegExp = function (input) {
		input = string(input) ? input : '';
		RE_ESCAPE_REGEXP.lastIndex = 0;
		return input.replace(RE_ESCAPE_REGEXP, '\\$&');
	};

	var repeat = function (input, count) {
		count = 0 | count;
		return new Array(size < 0 ? 0 : size + 1).join(input);
	};

	var pad = function (input, width) { return (
		input.length < width ? repeat(input, width) : input
	); };

	var src = function (input) {
		if (undef(input)) { return 'undefined'; }
		if (nil(input)) { return 'null'; }
		if (input.source) { return src(input.source); }
		return input;
	};

	var val = function (input) {
		input = src(input);
		return number(input) ? input : escapeRegExp(input);
	};

	var code = function (input) {
		input = src(input);
		var isstr = string(input);
		if (isstr && RE_UNICODE_PREFIX.test(input)) {
			return input;
		} else if (isstr || number(input)) {
			var hex = input.toString(16);
			if (hex.length < 3) { return ("\\x" + (pad(0, 2)) + hex); }
			return ("\\u" + (pad(0, 4)) + hex);
		}
		return isstr ? input : '';
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
		quote: function (self, last, input) { return ("" + self + (val(input))); },
		value: function (self, last, input) { return ("" + self + (src(input))); },
		plus: function (self, last, input) { return ("" + self + (src(input))); },
		u: function (self, last, input) { return (self + "\\u" + input); },
		x: function (self, last, input) { return (self + "\\x" + input); },
		unicode: function (self, last, input) { return ("" + self + (code(input))); },
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
		repeat: function (self, last, count) { return ("" + self + (repeat(last, count))); },
		replace: function (self, last, pattern, replacement) { return self.replace(pattern, replacement); },
		flags: function (self, last, input) { return new Rx(self, input); },
		either: function (self, last) {
			var rest = [], len = arguments.length - 2;
			while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

			return ("" + self + (rest.join('|')));
	},
	};

	var assign = Object.assign;
	var match = transform(compositions);
	var rules = function (custom, override, middleware) {
		if (undef(custom) || nil(custom)) { return match; }
		return transform(assign({}, custom, compositions, override), middleware);
	};

	exports.rules = rules;
	exports.match = match;
	exports.src = src;
	exports.val = val;
	exports.code = code;
	exports.pad = pad;
	exports.repeat = repeat;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
