# rx4d
> RegExp 4 dummies

## Usage:
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

console.log(rxNamedExpression());
// ==> (import|export)
// ... ?
// ... (\s+)
// ... ?
// ... (\{)
// ... (\s*)
// ... ([$0-9A-Za-z_\s]*[^\s])
// ... (\s*)
// ... (\})
// ... (\s+)
// ... (from)
// ... (\s+)
// ... (['"`])
// ... ([@$0-9a-zA-Z_\s-.\/]+)
// ... (['"`])
// ... ?

const reNamedExpression = rxNamedExpression.flags('gm')();
"import { pattern as PATTERN } from './foo/bar';".match(reNamedExpression);
"export { regexp as REGULAR_EXPRESSION } from './foo/bar'".match(reNamedExpression);
```

## Compositions:

```js
beginningOfInput
endOfInput
anySingleCharExceptTheNewline
zeroOrMoreTimes
oneOrMoreTimes
zeroOrOneTime
or
escape
backslash
backspace
nonWordBoundary
digit
nonDigitChar
formFeed
lineFeed
carriageReturn
whiteSpace
tab
verticalTab
alphanumeric
nonWordChar
nil
upercaseVowel
lowercaseVowel
uppercaseConsonant
lowercaseConsonant
lowercase
uppercase
letter
numeric
varchar
eol
repeat()
quote(value)
value(value)
controlChar(value)
notRemember(value)
ifFollowedBy(value)
ifNotFollowedBy(value)
notCharset(value)
charset(value)
size(value)
atLeast(value)
atMost(value)
group(value)
range(min, max)
flags(value)
```
