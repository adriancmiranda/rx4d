import test from 'ava';
import rx4d from '../index.next';

test('rx4d#1', t => {
	const rxPath = rx4d.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes;
	const reVariableChain = rx4d.beginningOfInput.varchar.group(rxPath).group(rx4d.whiteSpace).range(10, 12);
	const reVariable = reVariableChain.flags('gim')();
	t.true(reVariable instanceof RegExp, '"chain.flags" should return a Regular Expression');
	t.is(reVariableChain(), '^[$0-9A-Za-z_\\s]([@$0-9a-zA-Z_\\s-.\\/]+)(\\s){10,12}', 'chain should be ^[$0-9A-Za-z_\\s]([@$0-9a-zA-Z_\\s-.\\/]+)(\\s){10,12}');
});

test('rx4d#2', t => {
	const rxPath = rx4d.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes;
	const rxNamedExpression = rx4d
		.group(rx4d.value('import').or.value('export')).zeroOrOneTime
		.group(rx4d.whiteSpace.oneOrMoreTimes).zeroOrOneTime
		.group(rx4d.escape.value('{'))
		.group(rx4d.whiteSpace.zeroOrMoreTimes)
		.group(rx4d.varchar.zeroOrMoreTimes.notCharset(rx4d.whiteSpace))
		.group(rx4d.whiteSpace.zeroOrMoreTimes)
		.group(rx4d.escape.value('}'))
		.group(rx4d.whiteSpace.oneOrMoreTimes)
		.group('from')
		.group(rx4d.whiteSpace.oneOrMoreTimes)
		.group(rx4d.charset('\'"`'))
		.group(rxPath)
		.group(rx4d.charset('\'"`')).zeroOrOneTime
	;
	const reNamedExpression = rxNamedExpression.flags('gm')();
	const raw = /(import|export)?(\s+)?(\{)(\s*)([$0-9A-Za-z_\s]*[^\s])(\s*)(\})(\s+)(from)(\s+)(['"`])([@$0-9a-zA-Z_\s-.\/]+)(['"`])?/gm;
	t.true(reNamedExpression instanceof RegExp, 'should be a instance of RegExp');
	t.is(reNamedExpression.source, raw.source, `should be equal to ${raw.source}`);
	t.is(reNamedExpression.flags, raw.flags, 'should be "gm"');
});
