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
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `lineCount` | `number` | no | No description provided. |
| `lineCountMax` | `number` | no | The maximum number of lines to generate. |
| `lineCountMin` | `number` | no | The minimum number of lines to generate. |

Examples:

```txt
lorem.lines()
```

```txt
lorem.lines(min=1)
```

Example return values:
- `"Ara rem libero nihil.\nQuaerat corrumpo iste.\nVideo vapulus absorbeo certe.\nMolestiae accommodo astrum sordeo subseco."`
- `"Facilis tam valens abundans cupiditate concedo.\nUnde territo strenuus celebrer totus defleo contra."`

### `lorem.paragraph`

Generates a paragraph with the given number of sentences.

- Canonical: `awd.domain.lorem.paragraph`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `sentenceCount` | `number` | no | No description provided. |
| `sentenceCountMax` | `number` | no | The maximum number of sentences to generate. |
| `sentenceCountMin` | `number` | no | The minimum number of sentences to generate. |

Examples:

```txt
lorem.paragraph()
```

```txt
lorem.paragraph(min=1)
```

Example return values:
- `"Cunae calamitas cuius cena caelum. Degenero cedo tutis appono demoror accusator tutis. Ara compello aduro patrocinor."`
- `"Molestiae numquam delectus vulgo pauci laudantium patruus illo commemoro facilis. Tam beneficium spoliatio conduco tertius vespillo suspendo sursum cunabula. Territo cursus deprimo suggero sophismata corrupti patrocinor ipsum speciosus."`

### `lorem.paragraphs`

Generates the given number of paragraphs.

- Canonical: `awd.domain.lorem.paragraphs`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `paragraphCount` | `number` | no | No description provided. |
| `separator` | `string` | no | No description provided. |
| `paragraphCountMax` | `number` | no | The maximum number of paragraphs to generate. |
| `paragraphCountMin` | `number` | no | The minimum number of paragraphs to generate. |

Examples:

```txt
lorem.paragraphs()
```

```txt
lorem.paragraphs(min=1)
```

Example return values:
- `"Conitor adaugeo beatus. Solutio aliquid animadverto angelus defetiscor modi vitae quisquam deinde. Vicissitudo conventus vallum vesco defendo decumbo laudantium aptus comminor.\nTerror abbas abeo curis. Deficio abscido voluptate cuius communis tubineus ulterius cunae. Vicinus vilis decor deficio praesentium hic arca correptius.\nQuasi assentator sui aveho spero. Est caterva odio quod commemoro defaeco textilis. Aut annus custodia charisma volubilis conscendo collum tersus."`
- `"Commodo vaco coerceo tergum velociter derideo usitas demum comparo. Compello usque suasoria cado pectus contra doloribus aestivus. Aranea cum delinquo calamitas agnosco stabilis dolores alter conqueror.\nClaro decor praesentium colo nostrum tripudio. Antea temptatio cuius tribuo. Vix corroboro compono vulgaris laudantium votum confugo callide.\nIusto casus terreo. Rem denique amor adhaero summopere utilis alioqui. Acerbitas eos comptus aestas casso deputo atque culpo amita thymum."`

### `lorem.sentence`

Generates a space separated list of words beginning with a capital letter and ending with a period.

- Canonical: `awd.domain.lorem.sentence`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `wordCount` | `number` | no | No description provided. |
| `wordCountMax` | `number` | no | The maximum number of words to generate. |
| `wordCountMin` | `number` | no | The minimum number of words to generate. |

Examples:

```txt
lorem.sentence()
```

```txt
lorem.sentence(min=1)
```

Example return values:
- `"Iusto acidus verbum ambitus arbitro torqueo aliqua territo bonus possimus."`
- `"In bestia antiquus soluta tergo amet odit veritas atrocitas."`

### `lorem.sentences`

Generates the given number of sentences.

- Canonical: `awd.domain.lorem.sentences`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `sentenceCount` | `number` | no | No description provided. |
| `separator` | `string` | no | No description provided. |
| `sentenceCountMax` | `number` | no | The maximum number of sentences to generate. |
| `sentenceCountMin` | `number` | no | The minimum number of sentences to generate. |

Examples:

```txt
lorem.sentences()
```

```txt
lorem.sentences(min=1)
```

Example return values:
- `"Accusator audeo delibero. Cum vorax territo decimus conculco conturbo sono sursum arguo crebro."`
- `"Aegre creo ullam. Considero cubitum contra temporibus. Vigor sui tutis absconditus addo spiritus absorbeo attonbitus. Ascit conicio tepidus adflicto vaco sono cultellus libero cursus. Cur victoria vester."`

### `lorem.slug`

Generates a slugified text consisting of the given number of hyphen separated words.

- Canonical: `awd.domain.lorem.slug`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `wordCount` | `number` | no | No description provided. |
| `wordCountMax` | `number` | no | The maximum number of words to generate. |
| `wordCountMin` | `number` | no | The minimum number of words to generate. |

Examples:

```txt
lorem.slug()
```

```txt
lorem.slug(min=1)
```

Example return values:
- `"utrum-consequatur-dolore"`
- `"canto-alius-voluptatem"`

### `lorem.text`

Generates a random text based on a random lorem method.

- Canonical: `awd.domain.lorem.text`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

No parameters.

Examples:

```txt
lorem.text()
```

Example return values:
- `"Usitas vita tristis quos teres vulgaris varius caritas. Denego texo rem usitas accendo soleo spargo undique cohibeo. Color acidus civis concido.\nTenuis laboriosam aperio utique toties mollitia tribuo. Tolero impedit summa sursum aut alveus dolorem tener volo tego. Bis cattus turpis cruciamentum verbera ocer compello.\nId volva vulgo ambitus theologus asperiores corrupti usitas demum cimentarius. Pectus usus textilis valens thymbra confugo aspernatur. Correptius adamo clarus quam clam crebro."`
- `"Contra tabella celer.\nSpiritus vaco quibusdam verto totidem conitor aut."`

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
lorem.word(min=1)
```

Example return values:
- `"amplus"`
- `"angulus"`

### `lorem.words`

Generates a space separated list of words.

- Canonical: `awd.domain.lorem.words`
- Faker docs: [https://fakerjs.dev/api/lorem](https://fakerjs.dev/api/lorem)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `min` | `number` | no | No description provided. |
| `max` | `number` | no | No description provided. |
| `wordCount` | `number` | no | No description provided. |
| `wordCountMax` | `number` | no | The maximum number of words to generate. |
| `wordCountMin` | `number` | no | The minimum number of words to generate. |

Examples:

```txt
lorem.words()
```

```txt
lorem.words(min=1)
```

Example return values:
- `"acquiro bardus demulceo"`
- `"tepesco atavus statua"`
