---
sidebar_position: 2
title: "Regex Based Data"
description: "Generate data from Regex"
---

# Regex Data Generation

Regex Strings are normally used for 'matching' data e.g. searching for data that matches a particular format.

Regex can be used in reverse to generate data. Care has to be taken that limits are added to lengths of character sequences, otherwise 'in theory' strings could be of infinite length.

e.g. `[\d]*` could 'in theory' generate an infinite string of digits.

Under the covers we are using [RandExp](https://www.npmjs.com/package/randexp) as the library to generate strings from regular expressions and uses a limit of 100 as a default upper bound if no upper bound is provided in the regex value.

Limits can be supplied for length using the `{min,max}` syntax e.g. `[\d]{2,11}` generate between 2 and 11 length strings of digits.


## Useful Regex Tools

Regex Testers, these can be used to see if a particular Regex matches a list of Strings. In general, if the Regex can be used to match the string then it can also be used to generate the string.

- [regexr.com](https://regexr.com/)
- [regex101.com](https://regex101.com/)
- [RegexTester.com](https://www.regextester.com/)

## Useful Regex Cheatsheets

- [rexegg.com/regex-quickstart.html](https://www.rexegg.com/regex-quickstart.html)

## Useful Regex Sites

- [regexone.com](https://regexone.com) Interactive Regex tutorial
- [regular-expressions.info](https://www.regular-expressions.info)
- [rexegg.com](https://www.rexegg.com)


## Examples

### Words of Random Length

e.g. `[A-Z ]{3,12}`

By using a character group `[A-Z ]` which contains the letters A to Z and the space character we can generate a string between 3 and 12 characters long `{3,12}`.

For example, this could be used to generate a table with the multiple columns of random 'word' lengths:


```
col1
[A-Z ]{3,12}
col2
[A-Z ]{5,12}
col3
[A-Z ]{1,12}
```

