---
sidebar_position: 290
title: "word Domain"
description: "Domain keyword reference for word."
---

# word Domain

The `word` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

## Methods

### `word.adjective`

Returns a random adjective.

- Canonical: `awd.domain.word.adjective`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.adjective()
```

```txt
word.adjective(length=5)
```

```txt
word.adjective(max=5)
```

```txt
word.adjective(strategy="any-length")
```

Example return values:
- `inferior`
- `major`
- `inferior`
- `inferior`

### `word.adverb`

Returns a random adverb.

- Canonical: `awd.domain.word.adverb`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.adverb()
```

```txt
word.adverb(length=5)
```

```txt
word.adverb(max=5)
```

```txt
word.adverb(strategy="any-length")
```

Example return values:
- `knavishly`
- `never`
- `knavishly`
- `knavishly`

### `word.conjunction`

Returns a random conjunction.

- Canonical: `awd.domain.word.conjunction`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.conjunction()
```

```txt
word.conjunction(length=5)
```

```txt
word.conjunction(max=5)
```

```txt
word.conjunction(strategy="any-length")
```

Example return values:
- `likewise`
- `until`
- `likewise`
- `likewise`

### `word.interjection`

Returns a random interjection.

- Canonical: `awd.domain.word.interjection`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.interjection()
```

```txt
word.interjection(length=5)
```

```txt
word.interjection(max=5)
```

```txt
word.interjection(strategy="any-length")
```

Example return values:
- `woot`
- `fooey`
- `woot`
- `woot`

### `word.noun`

Returns a random noun.

- Canonical: `awd.domain.word.noun`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.noun()
```

```txt
word.noun(length=5)
```

```txt
word.noun(max=5)
```

```txt
word.noun(strategy="any-length")
```

Example return values:
- `heating`
- `humor`
- `heating`
- `heating`

### `word.preposition`

Returns a random preposition.

- Canonical: `awd.domain.word.preposition`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.preposition()
```

```txt
word.preposition(length=5)
```

```txt
word.preposition(max=5)
```

```txt
word.preposition(strategy="any-length")
```

Example return values:
- `except`
- `aside`
- `except`
- `except`

### `word.sample`

Returns a random word, that can be an adjective, adverb, conjunction, interjection, noun, preposition, or verb.

- Canonical: `awd.domain.word.sample`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.sample()
```

```txt
word.sample(length=5)
```

```txt
word.sample(max=5)
```

```txt
word.sample(strategy="any-length")
```

Example return values:
- `boohoo`
- `yowza`
- `boohoo`
- `boohoo`

### `word.verb`

Returns a random verb.

- Canonical: `awd.domain.word.verb`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.verb()
```

```txt
word.verb(length=5)
```

```txt
word.verb(max=5)
```

```txt
word.verb(strategy="any-length")
```

Example return values:
- `hunger`
- `mould`
- `hunger`
- `hunger`

### `word.words`

Returns a random string containing some words separated by spaces.

- Canonical: `awd.domain.word.words`
- Docs: [https://anywaydata.com/docs/test-data/domain/word](https://anywaydata.com/docs/test-data/domain/word)
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `number` | no | Number of items to generate. |
| `max` | `number` | no | Maximum bound used when generating a value. |

Examples:

```txt
word.words()
```

```txt
word.words(count=5)
```

```txt
word.words(max=5)
```

Example return values:
- `fog aboard`
- `boohoo pish tenderly above pop`
- `fog aboard`
