const rx4d = require('rx4d');

const rxPath = rx4d.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes;
const rxNamedExpression = rx4d
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
  .group(rxPath)
  .group(rx4d.charset('\'"`'))
  .zeroOrOneTime
;
const reNamedExpression = rxNamedExpression.flags('gm')();
[
rxNamedExpression(),
"import { pattern as PATTERN } from './foo/bar';".match(reNamedExpression),
"export { regexp as REGULAR_EXPRESSION } from './foo/bar'".match(reNamedExpression),
];
