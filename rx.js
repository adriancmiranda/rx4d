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
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Rx = factory());
}(this, (function () { 'use strict';

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
	function regexp(value) {
		if (value == null) { return false; }
		return value.constructor === RegExp;
	}

	var RE_IDENTIFIER = /([a-zA-Z_$][0-9a-zA-Z_$]{0,50})/;
	var RE_IDENTIFIER_REPLACE = new RegExp(("\\$\\+{" + (RE_IDENTIFIER.source) + "}"), 'g');
	var RE_GROUP_B = /^\?[:!=]/;
	var RE_GROUPS = /([\\]?[()])/g;
	var keys = Object.keys;

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
				keys(this.groups).forEach(function (name) {
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

	return Rx;

})));
