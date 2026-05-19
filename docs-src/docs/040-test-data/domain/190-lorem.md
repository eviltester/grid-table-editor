---
sidebar_position: 190
title: "lorem Domain"
description: "Domain keyword reference for lorem."
---

# lorem Domain

The `lorem` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

## Methods

### `lorem.lines`

Generates the given number lines of lorem separated by `'\n'`.

- Canonical: `awd.domain.lorem.lines`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `lineCount` | `number` | no | Optional number argument for this command. |
| `lineCountMax` | `number` | no | The maximum number of lines to generate. |
| `lineCountMin` | `number` | no | The minimum number of lines to generate. |

Examples:

```txt
lorem.lines()
```

```txt
lorem.lines(min=1, max=1, lineCount=1, lineCountMax=1, lineCountMin=1)
```

Example return values:
- `Illum qui ocer creptio. Antepono aro vergo voluptatem acervus compono apud.`

### `lorem.paragraph`

Generates a paragraph with the given number of sentences.

- Canonical: `awd.domain.lorem.paragraph`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `sentenceCount` | `number` | no | Number of sentences to generate. |
| `sentenceCountMax` | `number` | no | The maximum number of sentences to generate. |
| `sentenceCountMin` | `number` | no | The minimum number of sentences to generate. |

Examples:

```txt
lorem.paragraph()
```

```txt
lorem.paragraph(min=1, max=1, sentenceCount=1, sentenceCountMax=1, sentenceCountMin=1)
```

### `lorem.paragraphs`

Generates the given number of paragraphs.

- Canonical: `awd.domain.lorem.paragraphs`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `paragraphCount` | `number` | no | Number of paragraphs to generate. |
| `separator` | `string` | no | Separator inserted between generated items. |
| `paragraphCountMax` | `number` | no | The maximum number of paragraphs to generate. |
| `paragraphCountMin` | `number` | no | The minimum number of paragraphs to generate. |

Examples:

```txt
lorem.paragraphs()
```

```txt
lorem.paragraphs(min=1, max=1, paragraphCount=1, separator="-", paragraphCountMax=1, paragraphCountMin=1)
```

### `lorem.sentence`

Generates a space separated list of words beginning with a capital letter and ending with a period.

- Canonical: `awd.domain.lorem.sentence`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `wordCount` | `number` | no | Number of words to generate. |
| `wordCountMax` | `number` | no | The maximum number of words to generate. |
| `wordCountMin` | `number` | no | The minimum number of words to generate. |

Examples:

```txt
lorem.sentence()
```

```txt
lorem.sentence(min=1, max=1, wordCount=1, wordCountMax=1, wordCountMin=1)
```

Example return values:
- `Auctor cum deorsum attero cum tergo aut.`

### `lorem.sentences`

Generates the given number of sentences.

- Canonical: `awd.domain.lorem.sentences`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `sentenceCount` | `number` | no | Number of sentences to generate. |
| `separator` | `string` | no | Separator inserted between generated items. |
| `sentenceCountMax` | `number` | no | The maximum number of sentences to generate. |
| `sentenceCountMin` | `number` | no | The minimum number of sentences to generate. |

Examples:

```txt
lorem.sentences()
```

```txt
lorem.sentences(min=1, max=1, sentenceCount=1, separator="-", sentenceCountMax=1, sentenceCountMin=1)
```

Example return values:
- `Vicissitudo amet candidus. Urbanus magni carbo artificiose tenus at ambulo.`

### `lorem.slug`

Generates a slugified text consisting of the given number of hyphen separated words.

- Canonical: `awd.domain.lorem.slug`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `wordCount` | `number` | no | Number of words to generate. |
| `wordCountMax` | `number` | no | The maximum number of words to generate. |
| `wordCountMin` | `number` | no | The minimum number of words to generate. |

Examples:

```txt
lorem.slug()
```

```txt
lorem.slug(min=1, max=1, wordCount=1, wordCountMax=1, wordCountMin=1)
```

Example return values:
- `dolore-accusator-atqui`

### `lorem.text`

Generates a random text based on a random lorem method.

- Canonical: `awd.domain.lorem.text`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

No parameters.

Examples:

```txt
lorem.text()
```

### `lorem.word`

Generates a word of a specified length.

- Canonical: `awd.domain.lorem.word`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum word length when generating a ranged length. |
| `max` | `number` | no | Maximum word length when generating a ranged length. |
| `length` | `number` | no | Exact word length to generate. |
| `strategy` | `string` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
lorem.word()
```

```txt
lorem.word(min=1, max=1, length=1, strategy="any-length")
```

Example return values:
- `cumque`

### `lorem.words`

Generates a space separated list of words.

- Canonical: `awd.domain.lorem.words`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `wordCount` | `number` | no | Number of words to generate. |
| `wordCountMax` | `number` | no | The maximum number of words to generate. |
| `wordCountMin` | `number` | no | The minimum number of words to generate. |

Examples:

```txt
lorem.words()
```

```txt
lorem.words(min=1, max=1, wordCount=1, wordCountMax=1, wordCountMin=1)
```

Example return values:
- `desidero conforto decimus`
