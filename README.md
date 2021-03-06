# rx4d
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fadriancmiranda%2Frx4d.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fadriancmiranda%2Frx4d?ref=badge_shield)

> RegExp 4 dummies

## Usage:
> [_play with runkit_](https://npm.runkit.com/rx4d)

```js
const { match } = require('rx4d');

const rxPath = match

// [@$0-9a-zA-Z_\s-.\/]+
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
lineBreak: '\\r\\n?|\\n|\\u2028|\\u2029'
carriageReturn: '\\r'
whiteSpace: '\\s'
notWhiteSpace: '\\S'
nonASCIIWhiteSpace: '[\\u1680\\u180e\\u2000-\\u200a\\u202f\\u205f\\u3000\\ufeff]'
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
plus(value)
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
const { match, rules } = require('rx4d');

const ifNotFollowedByComment = match.ifNotFollowedBy(match.quote('//').or.quote('/*'))();

const customRules = {
  ifNotFollowedByComment,
  upercaseVowel: '[AEIOUY]',
  lowercaseVowel: '[aeiouy]',
  uppercaseConsonant: '[B-DF-HJ-NP-TV-Z]',
  lowercaseConsonant: '[b-df-hj-np-tv-z]',
};

const overrideRules = undefined; // optional object to override compositions
module.exports = rules(customRules, overrideRules);
```

<!-- helpful links -->

[regexp tool]: http://www.gethifi.com/tools/regex
[regexhub]: https://projects.lukehaas.me/regexhub/
[Unicode range RegExp generator]: https://apps.timwhitlock.info/js/regex
[documentation]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/regexp


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fadriancmiranda%2Frx4d.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fadriancmiranda%2Frx4d?ref=badge_large)