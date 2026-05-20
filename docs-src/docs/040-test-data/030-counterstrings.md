---
sidebar_position: 30
title: "Counterstrings"
description: "Use counterstrings to test length limits, truncation, and boundary handling."
---

A counterstring is a specially structured string where marker numbers show exact character positions.

Example of a 15 character counterstring:

```txt
*3*5*7*9*12*15*
```

Each `*` is preceded by the numeric position in the string. So the final `*` is at position 15.

This makes it easy to see where text is cut off, wrapped, or rejected.

## Why Use Counterstrings

Counterstrings are useful for:

- field length boundary testing
- truncation behavior checks
- UI clipping and overflow diagnostics
- API validation and error-message checks

## AnyWayData Support

AnyWayData supports counterstrings through:

```txt
string.counterString(min, max, delimiter="*")
```

Behavior:

- one integer: fixed length (`min == max`)
- two integers: range (smaller becomes min, larger becomes max)
- minimum effective length is `1`
- delimiter defaults to `*`
- multi-character delimiter uses first character

Examples:

```txt
string.counterString(15)
```

```txt
string.counterString(5, 12)
```

```txt
string.counterString(12, 12, "#")
```

## Related Links

- [string domain reference](/docs/test-data/domain/string)
- [Domain Test Data overview](/docs/test-data/domain/domain-test-data)
- [Counterstring reference implementation](https://github.com/eviltester/counterstringjs/blob/master/extension/js/counterstring.js)
- [James Bach on counterstrings](https://www.satisfice.com/blog/archives/22)
- [CounterString Chrome Extension](https://www.eviltester.com/page/tools/counterstringjs/)
- [Alan Richardon on counterstrings](https://www.eviltester.com/categories/counterstrings/)


