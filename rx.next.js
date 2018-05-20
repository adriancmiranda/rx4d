import string from 'describe-type/source/is/string';
import regexp from 'describe-type/source/is/regexp';

const RE_IDENTIFIER = /([a-zA-Z_$][0-9a-zA-Z_$]{0,50})/;
const RE_IDENTIFIER_REPLACE = new RegExp(`\\$\\+{${RE_IDENTIFIER.source}}`, 'g');
const RE_IDENTIFIER_BACKREFERENCE = new RegExp(`^[:?]&${RE_IDENTIFIER.source}`);
const RE_GROUP = new RegExp(`^[?:]<${RE_IDENTIFIER.source}>([^]*)`);
const RE_GROUP_B = /^\?[:!=]/;
const RE_GROUPS = /([\\]?[()])/g;
const RE_EMPTY_GROUPS = /\(\)/g;
const { keys } = Object;

function toObject(value) {
	const object = { source: '', flags: '', groups: [] };
	if (regexp(value)) {
		object.groups = value.source.split(RE_GROUPS);
		object.source = value.source;
		object.flags = value.flags;
	}
	return object;
}

function attachGroup(object, chunk, index, groups) {
}

function detachGroup(object, chunk, index, groups) {
}

function createGroup(object, chunk, index, groups) {
}

function reduceGroups(object, chunk, index, groups) {
	switch(chunk) {
		case '(': attachGroup(object, chunk, index, groups);
		case ')': detachGroup(object, chunk, index, groups);
		default: RE_GROUP_B.lastIndex = 0;
		if (groups[index - 1] === '(' && RE_GROUP_B.test(chunk) === false) {
			createGroup(object, chunk, index, groups);
		}
	}
	return object.source;
}

function getGroupExtension(source, flags) {
	const object = toObject(source, flags);
	object.source = object.groups.reduce(reduceGroups, object);
	return object;
}

export default class Rx extends RegExp {
	constructor(source, flags) {
		const object = getGroupExtension(source, flags);
		super(object.source, object.flags);
		this.groups = object.groups;
	}

	exec(value) {
		const object = super.exec(value);
		if (object) {
			object.groups = {};
			keys(this.groups).forEach((name) => {
				object.groups[name] = object[this.groups[name]];
			}, this);
		}
		return object;
	}

	[Symbol.replace](pattern, replacement) {
		const ctx = this;
		if (string(replacement)) {
			replacement = replacement.replace(RE_IDENTIFIER_REPLACE, (m, name) => (
				`$${ctx.groups[name] || ''}`
			));
		}
		return pattern.replace(ctx, replacement);
	}

	[Symbol.match](value) {
		return this.exec(value);
	}
}
