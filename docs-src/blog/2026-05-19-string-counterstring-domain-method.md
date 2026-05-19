---
slug: string-counterstring-domain-method
title: "Added string.counterString to Domain Test Data"
authors: [eviltester]
tags: [release, test-data, domain]
---

`string.counterString` is now available in the domain model.

This is the first `string.*` domain addition that is not backed directly by Faker, and is implemented as a custom domain delegate.

<!-- truncate -->

## Why add it?

Counterstrings are useful for field-length and truncation testing because each marker shows its position in the generated text.

Example pattern:

`*3*5*7*9*12*15*`

## Usage

`string.counterString(min, max, delimiter="*")`

- If only one integer is supplied, it is used as both min and max.
- If two integers are supplied, the lower value is used as min and the higher as max.
- Lowest allowed min is `1`.
- Delimiter defaults to `*`.
- If a delimiter longer than one character is passed, only the first character is used.

Examples:

```txt
Fixed15
string.counterString(15)
```

```txt
Range5to12
string.counterString(min=5, max=12)
```

```txt
HashDelimited
string.counterString(12, 12, "#")
```

