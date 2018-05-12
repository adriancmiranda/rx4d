# rx4d
> RegExp 4 dummies

## Usage:
> [_runkit_](https://npm.runkit.com/rx4d)

```js
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

console.log(rxNamedExpression());
// ==> (import|export)?
// ... (\s+)?
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
// ... (['"`])?

const reNamedExpression = rxNamedExpression.flags('gm')();
reNamedExpression.exec("import { pattern as PATTERN } from './foo/bar';");
reNamedExpression.exec("export { regexp as REGULAR_EXPRESSION } from './foo/bar'");
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

## Create your own rules

```js
const { rules } = require('rx4d');

const customRules = {
  upercaseVowel: '[AEIOUY]',
  lowercaseVowel: '[aeiouy]',
  uppercaseConsonant: '[B-DF-HJ-NP-TV-Z]',
  lowercaseConsonant: '[b-df-hj-np-tv-z]'
};

module.exports = rules(customRules, overrideRules?: Object);
```
