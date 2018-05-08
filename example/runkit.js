const rx4d = require('rx4d');

const reNamedExpression = rx4d
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
  ()
;
[
reNamedExpression.match("import { pattern as PATTERN } from './foo/bar';"),
reNamedExpression.match("export { regexp as REGULAR_EXPRESSION } from './foo/bar'"),
];
