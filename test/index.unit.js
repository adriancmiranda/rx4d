import test from 'ava';
import rx4d from '..';

test('rx4d', t => {
	const path = rx4d.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes;
	const namedExpression = rx4d
		.group(rx4d.value('import').or.value('export'))
		.zeroOrOneTime
		.group(rx4d.whiteSpace.oneOrMoreTimes)
		.zeroOrOneTime
		.group(rx4d.escape.value('{'))
		.group(rx4d.whiteSpace.zeroOrMoreTimes)
		.group(rx4d.varchar.zeroOrMoreTimes.notCharset(rx4d.whiteSpace))
		.group(rx4d.whiteSpace.zeroOrMoreTimes)
		.group(rx4d.escape.value('}'))
		.group(rx4d.whiteSpace.oneOrMoreTimes)
		.group('from')
		.group(rx4d.whiteSpace.oneOrMoreTimes)
		.group(rx4d.charset('\'"`'))
		.group(path)
		.group(rx4d.charset('\'"`'))
		.zeroOrOneTime
		.flags('gm')
	;
	t.true(namedExpression() instanceof RegExp, '".flags" should return a Regular Expression');
});
