const { match } = require('rx4d');

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
[
	rxNamedExpression(),
	reNamedExpression.exec("import { pattern as PATTERN } from './foo/bar';"),
	reNamedExpression.exec("export { regexp as REGULAR_EXPRESSION } from './foo/bar'"),
];
