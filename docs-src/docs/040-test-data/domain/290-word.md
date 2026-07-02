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
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.adjective when optional params are omitted.

```txt
word.adjective()
```

Returns: `inferior`

Shows word.adjective using length.

```txt
word.adjective(length=5)
```

Returns: `major`

Shows word.adjective using strategy.

```txt
word.adjective(strategy="any-length")
```

Returns: `inferior`

### `word.adverb`

Returns a random adverb.

- Canonical: `awd.domain.word.adverb`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.adverb when optional params are omitted.

```txt
word.adverb()
```

Returns: `knavishly`

Shows word.adverb using length.

```txt
word.adverb(length=5)
```

Returns: `never`

Shows word.adverb using strategy.

```txt
word.adverb(strategy="any-length")
```

Returns: `knavishly`

### `word.conjunction`

Returns a random conjunction.

- Canonical: `awd.domain.word.conjunction`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.conjunction when optional params are omitted.

```txt
word.conjunction()
```

Returns: `likewise`

Shows word.conjunction using length.

```txt
word.conjunction(length=5)
```

Returns: `until`

Shows word.conjunction using strategy.

```txt
word.conjunction(strategy="any-length")
```

Returns: `likewise`

### `word.interjection`

Returns a random interjection.

- Canonical: `awd.domain.word.interjection`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.interjection when optional params are omitted.

```txt
word.interjection()
```

Returns: `woot`

Shows word.interjection using length.

```txt
word.interjection(length=5)
```

Returns: `fooey`

Shows word.interjection using strategy.

```txt
word.interjection(strategy="any-length")
```

Returns: `woot`

### `word.noun`

Returns a random noun.

- Canonical: `awd.domain.word.noun`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.noun when optional params are omitted.

```txt
word.noun()
```

Returns: `heating`

Shows word.noun using length.

```txt
word.noun(length=5)
```

Returns: `humor`

Shows word.noun using strategy.

```txt
word.noun(strategy="any-length")
```

Returns: `heating`

### `word.preposition`

Returns a random preposition.

- Canonical: `awd.domain.word.preposition`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.preposition when optional params are omitted.

```txt
word.preposition()
```

Returns: `except`

Shows word.preposition using length.

```txt
word.preposition(length=5)
```

Returns: `aside`

Shows word.preposition using strategy.

```txt
word.preposition(strategy="any-length")
```

Returns: `except`

### `word.sample`

Returns a random word, that can be an adjective, adverb, conjunction, interjection, noun, preposition, or verb.

- Canonical: `awd.domain.word.sample`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.sample when optional params are omitted.

```txt
word.sample()
```

Returns: `boohoo`

Shows word.sample using length.

```txt
word.sample(length=5)
```

Returns: `yowza`

Shows word.sample using strategy.

```txt
word.sample(strategy="any-length")
```

Returns: `boohoo`

### `word.verb`

Returns a random verb.

- Canonical: `awd.domain.word.verb`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows word.verb when optional params are omitted.

```txt
word.verb()
```

Returns: `hunger`

Shows word.verb using length.

```txt
word.verb(length=5)
```

Returns: `mould`

Shows word.verb using strategy.

```txt
word.verb(strategy="any-length")
```

Returns: `hunger`

### `word.words`

Returns a random string containing some words separated by spaces.

- Canonical: `awd.domain.word.words`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `number` | no | Number of items to generate. |

Examples:

Shows word.words when optional params are omitted.

```txt
word.words()
```

Returns: `fog aboard`

Shows word.words using count.

```txt
word.words(count=5)
```

Returns: `boohoo pish tenderly above pop`
