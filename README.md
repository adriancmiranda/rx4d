# rx4d
> RegExp 4 dummies

## usage:
> [_playground_](https://npm.runkit.com/rx4d)

```js
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

console.log(rxNamedExpression()); // => (import|export)?(\s+)?(\{)(\s*)([$0-9A-Za-z_\s]*[^\s])(\s*)(\})(\s+)(from)(\s+)(['"`])([@$0-9a-zA-Z_\s-.\/]+)(['"`])?

const reNamedExpression = rxNamedExpression.flags('gm')();
"import { pattern as PATTERN } from './foo/bar';".match(reNamedExpression);
"export { regexp as REGULAR_EXPRESSION } from './foo/bar'".match(reNamedExpression);
```

## compositions:

```js
beginningOfInput: Getter
endOfInput: Getter
anySingleCharExceptTheNewline: Getter
zeroOrMoreTimes: Getter
oneOrMoreTimes: Getter
zeroOrOneTime: Getter
or: Getter
escape: Getter
backslash: Getter
backspace: Getter
nonWordBoundary: Getter
digit: Getter
nonDigitChar: Getter
formFeed: Getter
lineFeed: Getter
carriageReturn: Getter
whiteSpace: Getter
tab: Getter
verticalTab: Getter
alphanumeric: Getter
nonWordChar: Getter
nil: Getter
upercaseVowel: Getter
lowercaseVowel: Getter
uppercaseConsonant: Getter
lowercaseConsonant: Getter
lowercase: Getter
uppercase: Getter
letter: Getter
numeric: Getter
varchar: Getter
eol: Getter
quote: Function
value: Function
controlChar: Function
notRemember: Function
ifFollowedBy: Function
ifNotFollowedBy: Function
notCharset: Function
charset: Function
size: Function
atLeast: Function
atMost: Function
group: Function
range: Function
flags: Function
```
