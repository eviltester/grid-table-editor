---
sidebar_position: 200
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
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `lineCount` | `number` | no | Exact number of lines to generate. |
| `lineCountMax` | `number` | no | The maximum number of lines to generate. |
| `lineCountMin` | `number` | no | The minimum number of lines to generate. |

Examples:

```txt
lorem.lines()
```

```txt
lorem.lines(max=10, min=1)
```

```txt
lorem.lines(max=5)
```

```txt
lorem.lines(lineCount=5)
```

```txt
lorem.lines(lineCountMax=5)
```

```txt
lorem.lines(lineCountMin=5)
```

Example return values:
- `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`
- `Suppellex a cognatus arca aliquam audentia.`
- `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`
- `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`
- `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`
- `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`

### `lorem.paragraph`

Generates a paragraph with the given number of sentences.

- Canonical: `awd.domain.lorem.paragraph`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
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
lorem.paragraph(max=10, min=1)
```

```txt
lorem.paragraph(max=5)
```

```txt
lorem.paragraph(sentenceCount=5)
```

```txt
lorem.paragraph(sentenceCountMax=5)
```

```txt
lorem.paragraph(sentenceCountMin=5)
```

Example return values:
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.`
- `Suppellex a cognatus arca aliquam audentia.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.`

### `lorem.paragraphs`

Generates the given number of paragraphs.

- Canonical: `awd.domain.lorem.paragraphs`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
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
lorem.paragraphs(max=10, min=1)
```

```txt
lorem.paragraphs(max=5)
```

```txt
lorem.paragraphs(paragraphCount=5)
```

```txt
lorem.paragraphs(separator="-")
```

```txt
lorem.paragraphs(paragraphCountMax=5)
```

```txt
lorem.paragraphs(paragraphCountMin=5)
```

Example return values:
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.5Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.5Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`
- `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`

### `lorem.sentence`

Generates a space separated list of words beginning with a capital letter and ending with a period.

- Canonical: `awd.domain.lorem.sentence`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
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
lorem.sentence(max=10, min=1)
```

```txt
lorem.sentence(max=5)
```

```txt
lorem.sentence(wordCount=5)
```

```txt
lorem.sentence(wordCountMax=5)
```

```txt
lorem.sentence(wordCountMin=5)
```

Example return values:
- `Suppellex a cognatus arca aliquam audentia.`
- `Cur.`
- `Suppellex a cognatus arca aliquam audentia.`
- `Suppellex a cognatus arca aliquam audentia.`
- `Suppellex a cognatus arca aliquam audentia.`
- `Suppellex a cognatus arca aliquam audentia.`

### `lorem.sentences`

Generates the given number of sentences.

- Canonical: `awd.domain.lorem.sentences`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
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
lorem.sentences(max=10, min=1)
```

```txt
lorem.sentences(max=5)
```

```txt
lorem.sentences(sentenceCount=5)
```

```txt
lorem.sentences(separator="-")
```

```txt
lorem.sentences(sentenceCountMax=5)
```

```txt
lorem.sentences(sentenceCountMin=5)
```

Example return values:
- `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`
- `Suppellex a cognatus arca aliquam audentia.`
- `A cognatus arca aliquam audentia coniuratio crux fugit.5Stillicidium bardus utrimque acsi spargo cur.5Aqua avaritia thesaurus volo combibo stultus utor.5Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`
- `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`
- `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`
- `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`
- `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`

### `lorem.slug`

Generates a slugified text consisting of the given number of hyphen separated words.

- Canonical: `awd.domain.lorem.slug`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
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
lorem.slug(max=10, min=1)
```

```txt
lorem.slug(max=5)
```

```txt
lorem.slug(wordCount=5)
```

```txt
lorem.slug(wordCountMax=5)
```

```txt
lorem.slug(wordCountMin=5)
```

Example return values:
- `cur-suppellex-a`
- `cur`
- `cur-suppellex-a`
- `cur-suppellex-a`
- `cur-suppellex-a`
- `cur-suppellex-a`

### `lorem.text`

Generates a random text based on a random lorem method.

- Canonical: `awd.domain.lorem.text`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

No parameters.

Examples:

```txt
lorem.text
```

Example return values:
- `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.`

### `lorem.word`

Generates a word of a specified length.

- Canonical: `awd.domain.lorem.word`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum word length when generating a ranged length. |
| `max` | `number` | no | Maximum word length when generating a ranged length. |
| `length` | `number` | no | Exact word length to generate. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

```txt
lorem.word()
```

```txt
lorem.word(max=10, min=1)
```

```txt
lorem.word(max=5)
```

```txt
lorem.word(length=5)
```

```txt
lorem.word(strategy="any-length")
```

Example return values:
- `cur`
- `cur`
- `cur`
- `curvo`
- `cur`

### `lorem.words`

Generates a space separated list of words.

- Canonical: `awd.domain.lorem.words`
- Docs: [https://anywaydata.com/docs/test-data/domain/lorem](https://anywaydata.com/docs/test-data/domain/lorem)
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
lorem.words(max=10, min=1)
```

```txt
lorem.words(max=5)
```

```txt
lorem.words(wordCount=5)
```

```txt
lorem.words(wordCountMax=5)
```

```txt
lorem.words(wordCountMin=5)
```

Example return values:
- `cur suppellex a`
- `cur`
- `cur suppellex a`
- `cur suppellex a`
- `cur suppellex a`
- `cur suppellex a`
