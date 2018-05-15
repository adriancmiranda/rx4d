const { match } = require('rx4d');

const rxPath = match.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes;
const rxContent = match.charset('$\\w\\s').zeroOrMoreTimes;
const rxNamedExpression = match
	.group(match.value('import').or.value('export')).zeroOrOneTime
	.group(match.whiteSpace.oneOrMoreTimes).zeroOrOneTime
	.group(match.escape.value('{'))
	.group(match.whiteSpace.zeroOrMoreTimes)
	.group(rxContent.notCharset(match.whiteSpace))
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

function exec(value) {
	reNamedExpression.lastIndex = 0;
	return reNamedExpression.exec(value);
}

[
	rxNamedExpression(),
	exec("import { pattern as PATTERN } from './foo/bar';"),
	exec("export { regexp as REGEXP } from './foo/bar'"),
]
