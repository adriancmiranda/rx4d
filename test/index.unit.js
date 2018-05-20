import test from 'ava';
import { match } from '../index.next';

test('rx4d#quote', t => {
	t.pass();
});

test('rx4d#value', t => {
	t.pass();
});

test('rx4d#plus', t => {
	t.pass();
});

test('rx4d#u', t => {
	t.pass();
});

test('rx4d#x', t => {
	t.pass();
});

test('rx4d#unicode', t => {
	t.pass();
});

test('rx4d#control', t => {
	t.pass();
});

test('rx4d#notRemember', t => {
	t.pass();
});

test('rx4d#then', t => {
	t.pass();
});

test('rx4d#find', t => {
	t.pass();
});

test('rx4d#maybe', t => {
	t.pass();
});

test('rx4d#maybeOne', t => {
	t.pass();
});

test('rx4d#ifFollowedBy', t => {
	t.pass();
});

test('rx4d#ifNotFollowedBy', t => {
	t.pass();
});

test('rx4d#anythingBut', t => {
	t.pass();
});

test('rx4d#somethingBut', t => {
	t.pass();
});

test('rx4d#notCharset', t => {
	t.pass();
});

test('rx4d#charset', t => {
	t.pass();
});

test('rx4d#any', t => {
	t.pass();
});

test('rx4d#anyOf', t => {
	t.pass();
});

test('rx4d#group', t => {
	t.pass();
});

test('rx4d#size', t => {
	t.pass();
});

test('rx4d#atLeast', t => {
	t.pass();
});

test('rx4d#atMost', t => {
	t.pass();
});

test('rx4d#range', t => {
	t.pass();
});

test('rx4d#replace', t => {
	t.pass();
});

test('rx4d#repeat', t => {
	t.pass();
});

test('rx4d#flags', t => {
	t.pass();
});

test('rx4d#either', t => {
	const reservedWords = match.value('enum');
	const reservedWordsStrict = match.value(reservedWords).or.either(
		'implements',
		'interface',
		'let',
		'package',
		'private',
		'protected',
		'public',
		'static',
		'yield'
	);
	const reservedWordsStrictBind = match.value(reservedWordsStrict).or.either(
		'eval',
		'arguments'
	);
	const keywords = match.either(
		'break',
		'case',
		'catch',
		'class',
		'const',
		'continue',
		'debugger',
		'default',
		'delete',
		'do',
		'else',
		'export',
		'extends',
		'false',
		'finally',
		'for',
		'function',
		'if',
		'import',
		'in',
		'instanceof',
		'new',
		'null',
		'return',
		'super',
		'switch',
		'this',
		'throw',
		'true',
		'try',
		'typeof',
		'var',
		'void',
		'while',
		'with'
	);
	t.is('', reservedWords(), '"reservedWords" should be ');
	t.is('', reservedWordsStrict(), '"reservedWordsStrict" should be ');
	t.is('', reservedWordsStrictBind(), '"reservedWordsStrictBind" should be ');
	t.is('', keywords(), '"keywords" should be ');
});

test('rx4d#simple', t => {
	const rxPath = match.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes;
	const reVariableChain = match.beginningOfInput.charset('$\\w\\s').group(rxPath).group(match.whiteSpace).range(10, 12);
	const reVariable = reVariableChain.flags('gim')();
	t.true(reVariable instanceof RegExp, '"chain.flags" should return a Regular Expression');
	t.is(reVariableChain(), '^[$\\w\\s]([@$0-9a-zA-Z_\\s-.\\/]+)(\\s){10,12}', 'chain should be ^[$\\w]([@$0-9a-zA-Z_\\s-.\\/]+)(\\s){10,12}');
});

test('rx4d#complex', t => {
	const rxPath = match.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes;
	const rxNamedExpression = match
		.group(match.value('import').or.value('export')).zeroOrOneTime
		.group(match.whiteSpace.oneOrMoreTimes).zeroOrOneTime
		.group(match.escape.value('{'))
		.group(match.whiteSpace.zeroOrMoreTimes)
		.group(match.charset('$\\w\\s').zeroOrMoreTimes.notCharset(match.whiteSpace))
		.group(match.whiteSpace.zeroOrMoreTimes)
		.group(match.escape.value('}'))
		.group(match.whiteSpace.oneOrMoreTimes)
		.group('from')
		.group(match.whiteSpace.oneOrMoreTimes)
		.group(match.charset('\'"`'))
		.group(rxPath)
		.group(match.charset('\'"`')).zeroOrOneTime
	;
	const reNamedExpression = rxNamedExpression.flags('gm')();
	const raw = /(import|export)?(\s+)?(\{)(\s*)([$\w\s]*[^\s])(\s*)(\})(\s+)(from)(\s+)(['"`])([@$0-9a-zA-Z_\s-.\/]+)(['"`])?/gm;
	t.true(reNamedExpression instanceof RegExp, 'should be a instance of RegExp');
	t.is(reNamedExpression.source, raw.source, `should be equal to ${raw.source}`);
	t.is(reNamedExpression.flags, raw.flags, 'should be "gm"');
});
