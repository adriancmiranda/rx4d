# rx4d
> RegExp 4 dummies

## Usage:
> [_play with runkit_](https://npm.runkit.com/rx4d)

```js
const { match } = require('rx4d');

const rxPath = match

// ([@$0-9a-zA-Z_\s-.\/]+)
.charset('@$0-9a-zA-Z_\\s-.\\/').oneOrMoreTimes

;

const rxNamedExpression = match

// (import|export)?
.group(match.value('import').or.value('export')).zeroOrOneTime

// (\s+)?
.group(match.whiteSpace.oneOrMoreTimes).zeroOrOneTime

// (\{)
.group(match.escape.value('{'))

// (\s*)
.group(match.whiteSpace.zeroOrMoreTimes)

// ([$\\w\\s]*[^\s])
.group(match.charset('$\\w\\s').zeroOrMoreTimes.notCharset(match.whiteSpace))

// (\s*)
.group(match.whiteSpace.zeroOrMoreTimes)

// (\})
.group(match.escape.value('}'))

// (\s+)
.group(match.whiteSpace.oneOrMoreTimes)

// (from)
.group('from')

// (\s+)
.group(match.whiteSpace.oneOrMoreTimes)

// (['"`])
.group(match.charset('\'"`'))

// ([@$0-9a-zA-Z_\s-.\/]+)
.group(rxPath)

// (['"`])?
.group(match.charset('\'"`')).zeroOrOneTime

;

console.log(rxNamedExpression());
// ==> (import|export)?(\s+)?(\{)(\s*)([$\\w\\s]*[^\s])(\s*)(\})(\s+)(from)(\s+)(['"`])([@$0-9a-zA-Z_\s-.\/]+)(['"`])?

const reNamedExpression = rxNamedExpression.flags('gm')();
reNamedExpression.exec("import { pattern as PATTERN } from './foo/bar';");
reNamedExpression.exec("export { regexp as REGULAR_EXPRESSION } from './foo/bar'");
```

## Compositions:

```js
beginningOfInput: '^'
endOfInput: '$'
anySingleCharExceptTheNewline: '.'
anySingleChar: '[\\s\\S]'
somethingExceptTheNewline: '(?:.+)'
something: '(?:[\\s\\S]+)'
anythingExceptTheNewline: '(?:.*)'
anything: '(?:[\\s\\S]*)'
zeroOrMoreTimes: '*'
oneOrMoreTimes: '+'
zeroOrOneTime: '?'
or: '|'
escape: '\\'
backslash: '\\'
backspace: '[\\b]'
wordBoundary: '\\b'
nonWordBoundary: '\\B'
digit: '\\d'
nonDigit: '\\D'
formFeed: '\\f'
lineFeed: '\\n'
carriageReturn: '\\r'
whiteSpace: '\\s'
notWhiteSpace: '\\S'
tab: '\\t'
verticalTab: '\\v'
alphanumeric: '\\w'
alphanumerical: '\\w'
nonWord: '\\W'
nul: '\\0'
nil: '\\0'
lowercase: '[a-z]'
uppercase: '[A-Z]'
letter: '[a-zA-Z]'
numeric: '[0-9]'
varchar: '[a-zA-Z_$][0-9a-zA-Z_$]'
eol: '(?:(?:\\n)|(?:\\r\\n))'
startCapture: '('
endCapture: ')'
startGroup: '('
endGroup: ')'
startCharset: '['
endCharset: ']'
quote(value)
value(value)
unicode(value)
control(value)
notRemember(value)
then(value)
find(value)
maybe(value)
maybeOne(value)
anythingBut(value)
somethingBut(value)
ifFollowedBy(value)
ifNotFollowedBy(value)
notCharset(value)
charset(value)
any(value)
anyOf(value)
size(value)
atLeast(value)
atMost(value)
group(value)
range(min, max)
repeat(times)
replace(pattern, replacement)
either(...rest)
flags(value)
```

## Create your own rules

```js
const { rules } = require('rx4d');

const customRules = {
  upercaseVowel: '[AEIOUY]',
  lowercaseVowel: '[aeiouy]',
  uppercaseConsonant: '[B-DF-HJ-NP-TV-Z]',
  lowercaseConsonant: '[b-df-hj-np-tv-z]',
};

const overrideRules = undefined; // optional object
module.exports = rules(customRules, overrideRules);
```

<!-- helpful links -->
