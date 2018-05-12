import test from 'ava';
import { match } from '../index.next';

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
