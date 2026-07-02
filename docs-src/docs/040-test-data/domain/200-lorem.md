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
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | Minimum bound used when generating a value. |
| `max` | `number` | no | Maximum bound used when generating a value. |
| `lineCount` | `number` | no | Exact number of lines to generate. |
| `lineCountMax` | `number` | no | The maximum number of lines to generate. |
| `lineCountMin` | `number` | no | The minimum number of lines to generate. |

Examples:

Shows lorem.lines when optional params are omitted.

```txt
lorem.lines()
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`

Shows lorem.lines using min.

```txt
lorem.lines(max=10, min=1)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.\nAgo adflicto assentator utrimque altus curiositas vita expedita stultus comedo.\nTrucido accusamus tandem voveo tamisium cicuta testimonium amet.`

Shows lorem.lines using max.

```txt
lorem.lines(max=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`

Shows lorem.lines using lineCount.

```txt
lorem.lines(lineCount=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia.\nCrux fugit curatio stillicidium bardus.\nAcsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus.\nStipes trucido accusamus tandem voveo.`

Shows lorem.lines using lineCountMax.

```txt
lorem.lines(lineCountMax=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit.\nStillicidium bardus utrimque acsi spargo cur.\nAqua avaritia thesaurus volo combibo stultus utor.`

Shows lorem.lines using lineCountMin.

```txt
lorem.lines(lineCountMin=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia.\nCrux fugit curatio stillicidium bardus.\nAcsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus.\nStipes trucido accusamus tandem voveo.`

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

Shows lorem.paragraph when optional params are omitted.

```txt
lorem.paragraph()
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.`

Shows lorem.paragraph using min.

```txt
lorem.paragraph(max=10, min=1)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet.`

Shows lorem.paragraph using max.

```txt
lorem.paragraph(max=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.`

Shows lorem.paragraph using sentenceCount.

```txt
lorem.paragraph(sentenceCount=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.`

Shows lorem.paragraph using sentenceCountMax.

```txt
lorem.paragraph(sentenceCountMax=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.`

Shows lorem.paragraph using sentenceCountMin.

```txt
lorem.paragraph(sentenceCountMin=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.`

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

Shows lorem.paragraphs when optional params are omitted.

```txt
lorem.paragraphs()
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`

Shows lorem.paragraphs using min.

```txt
lorem.paragraphs(max=10, min=1)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.\nAgo adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet. Ver claudeo civis aperio accusantium spoliatio.\nCena deprimo adnuo natus. Odit subseco ambulo cupio. Cupio admiratio facilis sonitus dolorum vinco occaecati venio.\nApud timor cubicularis asperiores. Conqueror tantillus sursum vacuus quia tantillus conscendo centum vehemens cursus. Somnus quasi amplus vir defaeco nesciunt cumque capillus venio natus.\nProvident compello et. Consuasor ver qui accendo vetus studio vulpes at approbo vicissitudo. Aedificium temeritas tego vesica sum ante accusantium acquiro.`

Shows lorem.paragraphs using max.

```txt
lorem.paragraphs(max=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.\nAgo adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet. Ver claudeo civis aperio accusantium spoliatio.\nCena deprimo adnuo natus. Odit subseco ambulo cupio. Cupio admiratio facilis sonitus dolorum vinco occaecati venio.`

Shows lorem.paragraphs using paragraphCount.

```txt
lorem.paragraphs(paragraphCount=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.\nOccaecati venio apto apud timor cubicularis asperiores vestigium conqueror tantillus. Vacuus quia tantillus conscendo centum vehemens cursus vobis. Quasi amplus vir defaeco nesciunt cumque capillus venio.\nAbbas provident compello et valde consuasor ver. Accendo vetus studio vulpes at approbo vicissitudo. Aedificium temeritas tego vesica sum ante accusantium acquiro.`

Shows lorem.paragraphs using separator.

```txt
lorem.paragraphs(separator="-")
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.-Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.-Spoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.`

Shows lorem.paragraphs using paragraphCountMax.

```txt
lorem.paragraphs(paragraphCountMax=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.\nAgo adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet. Ver claudeo civis aperio accusantium spoliatio.\nCena deprimo adnuo natus. Odit subseco ambulo cupio. Cupio admiratio facilis sonitus dolorum vinco occaecati venio.`

Shows lorem.paragraphs using paragraphCountMin.

```txt
lorem.paragraphs(paragraphCountMin=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus.\nVarius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo. Cicuta testimonium amet dedico ver claudeo civis aperio.\nSpoliatio beneficium cena. Adnuo natus arca odit subseco ambulo. Suasoria cupio admiratio facilis sonitus dolorum.\nOccaecati venio apto apud timor cubicularis asperiores vestigium conqueror tantillus. Vacuus quia tantillus conscendo centum vehemens cursus vobis. Quasi amplus vir defaeco nesciunt cumque capillus venio.\nAbbas provident compello et valde consuasor ver. Accendo vetus studio vulpes at approbo vicissitudo. Aedificium temeritas tego vesica sum ante accusantium acquiro.`

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

Shows lorem.sentence when optional params are omitted.

```txt
lorem.sentence()
```

Returns: `Suppellex a cognatus arca aliquam audentia.`

Shows lorem.sentence using min.

```txt
lorem.sentence(max=10, min=1)
```

Returns: `Suppellex a cognatus arca aliquam.`

Shows lorem.sentence using max.

```txt
lorem.sentence(max=5)
```

Returns: `Suppellex a cognatus.`

Shows lorem.sentence using wordCount.

```txt
lorem.sentence(wordCount=5)
```

Returns: `Cur suppellex a cognatus arca.`

Shows lorem.sentence using wordCountMax.

```txt
lorem.sentence(wordCountMax=5)
```

Returns: `Suppellex a cognatus.`

Shows lorem.sentence using wordCountMin.

```txt
lorem.sentence(wordCountMin=5)
```

Returns: `Cur suppellex a cognatus arca.`

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

Shows lorem.sentences when optional params are omitted.

```txt
lorem.sentences()
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`

Shows lorem.sentences using min.

```txt
lorem.sentences(max=10, min=1)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor. Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo. Trucido accusamus tandem voveo tamisium cicuta testimonium amet.`

Shows lorem.sentences using max.

```txt
lorem.sentences(max=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.`

Shows lorem.sentences using sentenceCount.

```txt
lorem.sentences(sentenceCount=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.`

Shows lorem.sentences using separator.

```txt
lorem.sentences(separator="-")
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit.-Stillicidium bardus utrimque acsi spargo cur.-Aqua avaritia thesaurus volo combibo stultus utor.-Ago adflicto assentator utrimque altus curiositas vita expedita stultus comedo.`

Shows lorem.sentences using sentenceCountMax.

```txt
lorem.sentences(sentenceCountMax=5)
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.`

Shows lorem.sentences using sentenceCountMin.

```txt
lorem.sentences(sentenceCountMin=5)
```

Returns: `Suppellex a cognatus arca aliquam audentia. Crux fugit curatio stillicidium bardus. Acsi spargo cur laboriosam aqua avaritia thesaurus volo combibo stultus. Varius ago adflicto assentator utrimque altus curiositas vita expedita stultus. Stipes trucido accusamus tandem voveo.`

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

Shows lorem.slug when optional params are omitted.

```txt
lorem.slug()
```

Returns: `cur-suppellex-a`

Shows lorem.slug using min.

```txt
lorem.slug(max=10, min=1)
```

Returns: `suppellex-a-cognatus-arca-aliquam`

Shows lorem.slug using max.

```txt
lorem.slug(max=5)
```

Returns: `suppellex-a-cognatus`

Shows lorem.slug using wordCount.

```txt
lorem.slug(wordCount=5)
```

Returns: `cur-suppellex-a-cognatus-arca`

Shows lorem.slug using wordCountMax.

```txt
lorem.slug(wordCountMax=5)
```

Returns: `suppellex-a-cognatus`

Shows lorem.slug using wordCountMin.

```txt
lorem.slug(wordCountMin=5)
```

Returns: `cur-suppellex-a-cognatus-arca`

### `lorem.text`

Generates a random text based on a random lorem method.

- Canonical: `awd.domain.lorem.text`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

No parameters.

Examples:

Shows the default lorem.text call.

```txt
lorem.text
```

Returns: `A cognatus arca aliquam audentia coniuratio crux fugit. Stillicidium bardus utrimque acsi spargo cur. Aqua avaritia thesaurus volo combibo stultus utor.`

### `lorem.word`

Generates a word of a specified length.

- Canonical: `awd.domain.lorem.word`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `length` | `number` | no | Exact word length to generate. |
| `strategy` | `fail\|closest\|shortest\|longest\|any-length` | no | The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length. |

Examples:

Shows lorem.word when optional params are omitted.

```txt
lorem.word()
```

Returns: `cur`

Shows lorem.word using length.

```txt
lorem.word(length=5)
```

Returns: `curvo`

Shows lorem.word using strategy.

```txt
lorem.word(strategy="any-length")
```

Returns: `cur`

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

Shows lorem.words when optional params are omitted.

```txt
lorem.words()
```

Returns: `cur suppellex a`

Shows lorem.words using min.

```txt
lorem.words(max=10, min=1)
```

Returns: `suppellex a cognatus arca aliquam`

Shows lorem.words using max.

```txt
lorem.words(max=5)
```

Returns: `suppellex a cognatus`

Shows lorem.words using wordCount.

```txt
lorem.words(wordCount=5)
```

Returns: `cur suppellex a cognatus arca`

Shows lorem.words using wordCountMax.

```txt
lorem.words(wordCountMax=5)
```

Returns: `suppellex a cognatus`

Shows lorem.words using wordCountMin.

```txt
lorem.words(wordCountMin=5)
```

Returns: `cur suppellex a cognatus arca`
