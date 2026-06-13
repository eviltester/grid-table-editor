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
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.adjective()
```

```txt
word.adjective(length=1, max=1, strategy="any-length")
```

Example return values:
- `heavenly`

### `word.adverb`

Returns a random adverb.

- Canonical: `awd.domain.word.adverb`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.adverb()
```

```txt
word.adverb(length=1, max=1, strategy="any-length")
```

Example return values:
- `selfishly`

### `word.conjunction`

Returns a random conjunction.

- Canonical: `awd.domain.word.conjunction`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.conjunction()
```

```txt
word.conjunction(length=1, max=1, strategy="any-length")
```

Example return values:
- `indeed`

### `word.interjection`

Returns a random interjection.

- Canonical: `awd.domain.word.interjection`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.interjection()
```

```txt
word.interjection(length=1, max=1, strategy="any-length")
```

Example return values:
- `er`

### `word.noun`

Returns a random noun.

- Canonical: `awd.domain.word.noun`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.noun()
```

```txt
word.noun(length=1, max=1, strategy="any-length")
```

Example return values:
- `cook`

### `word.preposition`

Returns a random preposition.

- Canonical: `awd.domain.word.preposition`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.preposition()
```

```txt
word.preposition(length=1, max=1, strategy="any-length")
```

Example return values:
- `beside`

### `word.sample`

Returns a random word, that can be an adjective, adverb, conjunction, interjection, noun, preposition, or verb.

- Canonical: `awd.domain.word.sample`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.sample()
```

```txt
word.sample(length=1, max=1, strategy="any-length")
```

Example return values:
- `snoopy`

### `word.verb`

Returns a random verb.

- Canonical: `awd.domain.word.verb`
- Faker docs: [https://fakerjs.dev/api/word](https://fakerjs.dev/api/word)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Desired length of the generated value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
word.verb()
```

```txt
word.verb(length=1, max=1, strategy="any-length")
```

Example return values:
- `embalm`

### `word.words`

Returns a random string containing some words separated by spaces.

- Canonical: `awd.domain.word.words`
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
word.words(count=1, max=1)
```

Example return values:
- `geez`
