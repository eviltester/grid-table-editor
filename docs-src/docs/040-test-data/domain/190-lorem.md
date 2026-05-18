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
lorem.lines(min=1, max=1, lineCount=1, lineCountMax=1, lineCountMin=1)
```

Example return values:
- `"Bibo apud tergiversatio texo.\nSolvo argentum optio.\nCopia crastinus saepe cado careo amor aufero tunc autus valde.\nDefendo officia ceno hic catena apto accusantium."`
- `"Numquam porro quisquam trans assentator corpus.\nItaque alias doloremque creta vorago quod casso.\nTunc suppono eveniet natus delectatio depereo amitto.\nCibo absum cui laborum comes deripio tantillus vester.\nConspergo blanditiis allatus."`

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
lorem.paragraph(min=1, max=1, sentenceCount=1, sentenceCountMax=1, sentenceCountMin=1)
```

Example return values:
- `"Valeo asporto abutor neque summopere tabernus pecco. Verbum complectus bardus teres voveo curiositas. Vere aliquam sopor sub cohaero."`
- `"Culpa terreo acies. Dolore tubineus vulgo aegrus caecus temptatio solus vindico vestigium. Alii stultus delinquo cimentarius comedo delectatio auditor tristis chirographum."`

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
lorem.paragraphs(min=1, max=1, paragraphCount=1, separator="-", paragraphCountMax=1, paragraphCountMin=1)
```

Example return values:
- `"Aeneus cresco soluta tero tremo texo antiquus. Triduana adsuesco vesco sophismata teneo caterva illo sequi. Deleniti celo patior creptio illo vesco amitto cauda carcer.\nCrinis demum ager cimentarius autem tyrannus vomer. Studio vester vulgaris caecus viscus succedo caute vallum summopere. Cubo tolero necessitatibus cervus denuncio curso quidem maiores vaco absens.\nCarus stella validus vicissitudo amiculum ago. Coniuratio tonsor stultus demergo excepturi. Vestrum conspergo deorsum avaritia basium sumo titulus vinum iure."`
- `"Demum usus velum basium. Molestias aspernatur commemoro. Laborum assumenda cribro aetas depulso cernuus aedificium acer.\nVacuus amaritudo capitulus versus deripio. Desino magni alioqui alioqui ventosus cruciamentum vinculum. Cogo condico occaecati degusto nostrum abscido asperiores viduo.\nTres incidunt crustulum tepidus demum termes cupiditate solvo. Aestus tutis arma verecundia explicabo. Vigor solvo tenuis suasoria cubo tametsi calculus nesciunt subiungo."`

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
lorem.sentence(min=1, max=1, wordCount=1, wordCountMax=1, wordCountMin=1)
```

Example return values:
- `"Absque impedit ut pecus vomica valde peccatus vitae careo degusto."`
- `"Tersus arma cerno communis artificiose iste suscipit comis deinde."`

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
lorem.sentences(min=1, max=1, sentenceCount=1, separator="-", sentenceCountMax=1, sentenceCountMin=1)
```

Example return values:
- `"Amet incidunt caries abstergo triduana caute benevolentia anser. Clarus quia volva alioqui dignissimos iure tolero carus paulatim. Tripudio demulceo reiciendis coaegresco clam vorax umquam avaritia bonus. Admoneo trans numquam et usus minus brevis. Cursim complectus charisma ara."`
- `"Communis viduo cultellus angelus sonitus vivo curo. Vulgaris vallum curtus. Conventus strenuus ipsa vobis. Tenuis adimpleo acervus labore una vomer suscipio contabesco comprehendo ascit. Coniecto curiositas cunabula complectus validus tribuo asper validus autem. Molestias campana denique commodi amicitia sollers aetas pariatur adstringo."`

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
lorem.slug(min=1, max=1, wordCount=1, wordCountMax=1, wordCountMin=1)
```

Example return values:
- `"desipio-venustas-talus"`
- `"cognatus-volo-adficio"`

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
- `"Dapifer anser aspernatur umbra attollo aspernatur vulgivagus brevis inventore decumbo. Aro decens sequi magnam. Truculenter conicio crustulum careo."`
- `"Aiunt decerno adopto articulus approbo culpa dolorem."`

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
- `"sollers"`
- `"commodo"`

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
lorem.words(min=1, max=1, wordCount=1, wordCountMax=1, wordCountMin=1)
```

Example return values:
- `"communis cubitum cum"`
- `"utrimque aspicio reiciendis"`
