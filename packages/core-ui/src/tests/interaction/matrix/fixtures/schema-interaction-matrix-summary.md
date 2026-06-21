# Schema Interaction Matrix Summary

Generated: `2026-06-17T13:02:55.544Z`

This file describes what the interaction matrix covers.

- `coverageScenarios`: full review catalog generated from definitions
- `runtimeScenarios`: executable real-core runtime subset
- `uiScenarios`: executable JSDOM UI subset

## Coverage Scenarios

Scenario count: **642**
Generated preview data count: **631**
Review-only scenario count: **0**
Non-executable scenario count: **11**

### By Source Type

| Key | Count |
| --- | ---: |
| `domain` | 582 |
| `enum` | 2 |
| `faker` | 54 |
| `literal` | 2 |
| `regex` | 2 |

### By Origin

| Key | Count |
| --- | ---: |
| `arg` | 222 |
| `base` | 256 |
| `custom` | 3 |
| `empty` | 2 |
| `example` | 33 |
| `pair` | 125 |
| `pairwise` | 1 |

### Commands By Source Type

#### `domain` (242)

- `airline.aircraftType`
- `airline.flightNumber`
- `airline.iataCode`
- `airline.name`
- `airline.recordLocator`
- `airline.seat`
- `airplane.iataTypeCode`
- `airplane.name`
- `airport.iataCode`
- `airport.name`
- `animal.bear`
- `animal.bird`
- `animal.cat`
- `animal.cetacean`
- `animal.cow`
- `animal.crocodilia`
- `animal.dog`
- `animal.fish`
- `animal.horse`
- `animal.insect`
- `animal.lion`
- `animal.petName`
- `animal.rabbit`
- `animal.rodent`
- `animal.snake`
- `animal.type`
- `autoIncrement.sequence`
- `autoIncrement.timestamp`
- `book.author`
- `book.format`
- `book.genre`
- `book.publisher`
- `book.series`
- `book.title`
- `chemicalElement.atomicNumber`
- `chemicalElement.name`
- `chemicalElement.symbol`
- `color.cssSupportedFunction`
- `color.cssSupportedSpace`
- `color.human`
- `color.rgb`
- `color.space`
- `commerce.department`
- `commerce.isbn`
- `commerce.price`
- `commerce.product`
- `commerce.productAdjective`
- `commerce.productDescription`
- `commerce.productMaterial`
- `commerce.productName`
- `commerce.upc`
- `company.buzzAdjective`
- `company.buzzNoun`
- `company.buzzPhrase`
- `company.buzzVerb`
- `company.catchPhrase`
- `company.catchPhraseAdjective`
- `company.catchPhraseDescriptor`
- `company.catchPhraseNoun`
- `company.name`
- `database.collation`
- `database.column`
- `database.engine`
- `database.mongodbObjectId`
- `database.type`
- `datatype.boolean`
- `datatype.enum`
- `date.anytime`
- `date.between`
- `date.birthdate`
- `date.future`
- `date.month`
- `date.past`
- `date.recent`
- `date.soon`
- `date.timeZone`
- `date.weekday`
- `finance.accountName`
- `finance.accountNumber`
- `finance.amount`
- `finance.bic`
- `finance.bitcoinAddress`
- `finance.creditCardCVV`
- `finance.creditCardIssuer`
- `finance.creditCardNumber`
- `finance.currencyCode`
- `finance.currencyName`
- `finance.currencyNumericCode`
- `finance.currencySymbol`
- `finance.ethereumAddress`
- `finance.iban`
- `finance.litecoinAddress`
- `finance.pin`
- `finance.routingNumber`
- `finance.transactionDescription`
- `finance.transactionType`
- `food.adjective`
- `food.description`
- `food.dish`
- `food.ethnicCategory`
- `food.fruit`
- `food.ingredient`
- `food.meat`
- `food.spice`
- `food.vegetable`
- `git.branch`
- `git.commitDate`
- `git.commitEntry`
- `git.commitMessage`
- `git.commitSha`
- `hacker.abbreviation`
- `hacker.adjective`
- `hacker.ingverb`
- `hacker.noun`
- `hacker.phrase`
- `hacker.verb`
- `image.avatar`
- `image.avatarGitHub`
- `image.dataUri`
- `image.personPortrait`
- `image.url`
- `image.urlPicsumPhotos`
- `internet.displayName`
- `internet.domainName`
- `internet.domainSuffix`
- `internet.domainWord`
- `internet.email`
- `internet.emoji`
- `internet.exampleEmail`
- `internet.httpMethod`
- `internet.httpStatusCode`
- `internet.ip`
- `internet.ipv4`
- `internet.ipv6`
- `internet.jwt`
- `internet.jwtAlgorithm`
- `internet.mac`
- `internet.password`
- `internet.port`
- `internet.protocol`
- `internet.url`
- `internet.userAgent`
- `internet.username`
- `literal.value`
- `location.buildingNumber`
- `location.cardinalDirection`
- `location.city`
- `location.continent`
- `location.country`
- `location.countryCode`
- `location.county`
- `location.direction`
- `location.latitude`
- `location.longitude`
- `location.ordinalDirection`
- `location.secondaryAddress`
- `location.state`
- `location.street`
- `location.streetAddress`
- `location.timeZone`
- `location.zipCode`
- `lorem.lines`
- `lorem.paragraph`
- `lorem.paragraphs`
- `lorem.sentence`
- `lorem.sentences`
- `lorem.slug`
- `lorem.text`
- `lorem.word`
- `lorem.words`
- `music.album`
- `music.artist`
- `music.genre`
- `music.songName`
- `number.bigInt`
- `number.binary`
- `number.float`
- `number.hex`
- `number.int`
- `number.octal`
- `number.romanNumeral`
- `person.bio`
- `person.firstName`
- `person.fullName`
- `person.gender`
- `person.jobArea`
- `person.jobDescriptor`
- `person.jobTitle`
- `person.jobType`
- `person.lastName`
- `person.middleName`
- `person.prefix`
- `person.sex`
- `person.sexType`
- `person.suffix`
- `person.zodiacSign`
- `phone.imei`
- `phone.number`
- `string.alpha`
- `string.alphanumeric`
- `string.binary`
- `string.counterString`
- `string.fromCharacters`
- `string.hexadecimal`
- `string.nanoid`
- `string.numeric`
- `string.octal`
- `string.sample`
- `string.symbol`
- `string.ulid`
- `string.uuid`
- `system.commonFileExt`
- `system.commonFileName`
- `system.commonFileType`
- `system.cron`
- `system.directoryPath`
- `system.fileExt`
- `system.fileName`
- `system.filePath`
- `system.fileType`
- `system.mimeType`
- `system.networkInterface`
- `system.semver`
- `vehicle.bicycle`
- `vehicle.color`
- `vehicle.fuel`
- `vehicle.manufacturer`
- `vehicle.model`
- `vehicle.type`
- `vehicle.vehicle`
- `vehicle.vin`
- `vehicle.vrm`
- `word.adjective`
- `word.adverb`
- `word.conjunction`
- `word.interjection`
- `word.noun`
- `word.preposition`
- `word.sample`
- `word.verb`
- `word.words`

#### `enum` (2)

- `enum`
- `enum pairwise`

#### `faker` (14)

- `helpers.arrayElement`
- `helpers.arrayElements`
- `helpers.fake`
- `helpers.fromRegExp`
- `helpers.maybe`
- `helpers.multiple`
- `helpers.mustache`
- `helpers.rangeToNumber`
- `helpers.replaceCreditCardSymbols`
- `helpers.replaceSymbols`
- `helpers.shuffle`
- `helpers.slugify`
- `helpers.uniqueArray`
- `helpers.weightedArrayElement`

#### `literal` (2)

- `literal`
- `literal empty`

#### `regex` (2)

- `regex`
- `regex empty`

### Scenario Details

#### `custom-enum-base`

- Command(s): `enum(active,inactive,pending)`
- Preview data:
```csv

```

#### `custom-enum-pairwise`

- Command(s): `Status: enum(active,inactive,pending) | Priority: enum(high,medium,low)`
- Schema Rows: `Status: enum(active,inactive,pending)`, `Priority: enum(high,medium,low)`
- Preview data:
```csv

```

#### `custom-literal-base`

- Command(s): `literal("Pending")`
- Preview data:
```csv

```

#### `custom-literal-empty`

- Command(s): `literal("")`
- Preview data:
```csv

```

#### `custom-regex-base`

- Command(s): `regex("[A-Z]{2}[0-9]{2}")`
- Preview data:
```csv

```

#### `custom-regex-empty`

- Command(s): `regex("")`
- Preview data:
```csv

```

#### `faker-helpers-arrayElement-base`

- Command(s): `helpers.arrayElement(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElement-example-1`

- Command(s): `helpers.arrayElement(["A", "B", "C"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElement-arg-array`

- Command(s): `helpers.arrayElement(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-base`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-example-1`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-arg-array`

- Command(s): `helpers.arrayElements(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-arg-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-pair-array-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-fake-base`

- Command(s): `helpers.fake("{{person.firstName}}")`
- Preview data:
```csv

```

#### `faker-helpers-fake-example-1`

- Command(s): `helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")`
- Preview data:
```csv

```

#### `faker-helpers-fake-arg-pattern`

- Command(s): `helpers.fake("[A-Z]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-fromRegExp-base`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-fromRegExp-example-1`

- Command(s): `helpers.fromRegExp("[A-Z]{2}[0-9]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-fromRegExp-arg-pattern`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-maybe-base`

- Command(s): `helpers.maybe("helpers-maybe-callback")`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-maybe-example-1`

- Command(s): `helpers.maybe(() => "enabled")`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-maybe-arg-callback`

- Command(s): `helpers.maybe("helpers-maybe-callback")`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-maybe-arg-options`

- Command(s): `helpers.maybe("helpers-maybe-callback", {})`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-maybe-pair-callback-options`

- Command(s): `helpers.maybe("helpers-maybe-callback", {})`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-multiple-base`

- Command(s): `helpers.multiple("helpers-multiple-method")`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-multiple-example-1`

- Command(s): `helpers.multiple(() => faker.person.firstName(), { count: 3 })`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-multiple-arg-method`

- Command(s): `helpers.multiple("helpers-multiple-method")`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-multiple-arg-options`

- Command(s): `helpers.multiple("helpers-multiple-method", 3)`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-multiple-pair-method-options`

- Command(s): `helpers.multiple("helpers-multiple-method", 3)`
- Preview data: not generated for this non-executable scenario

#### `faker-helpers-mustache-base`

- Command(s): `helpers.mustache("{{name}}", { name: "Ada" })`
- Preview data:
```csv

```

#### `faker-helpers-mustache-example-1`

- Command(s): `helpers.mustache("Hello {{name}}", { name: "Ada" })`
- Preview data:
```csv

```

#### `faker-helpers-mustache-arg-text`

- Command(s): `helpers.mustache("{{name}}")`
- Preview data:
```csv

```

#### `faker-helpers-mustache-arg-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv

```

#### `faker-helpers-mustache-pair-text-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv

```

#### `faker-helpers-rangeToNumber-base`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- Preview data:
```csv

```

#### `faker-helpers-rangeToNumber-example-1`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- Preview data:
```csv

```

#### `faker-helpers-rangeToNumber-arg-numberOrRange`

- Command(s): `helpers.rangeToNumber(2)`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-base`

- Command(s): `helpers.replaceCreditCardSymbols()`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-example-1`

- Command(s): `helpers.replaceCreditCardSymbols("1234-[4-9]-##!!-L")`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-arg-string`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string")`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-arg-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-pair-string-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv

```

#### `faker-helpers-replaceSymbols-base`

- Command(s): `helpers.replaceSymbols()`
- Preview data:
```csv

```

#### `faker-helpers-replaceSymbols-example-1`

- Command(s): `helpers.replaceSymbols("##??-##")`
- Preview data:
```csv

```

#### `faker-helpers-replaceSymbols-arg-string`

- Command(s): `helpers.replaceSymbols("helpers-replaceSymbols-string")`
- Preview data:
```csv

```

#### `faker-helpers-shuffle-base`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- Preview data:
```csv

```

#### `faker-helpers-shuffle-example-1`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- Preview data:
```csv

```

#### `faker-helpers-shuffle-arg-array`

- Command(s): `helpers.shuffle(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-slugify-base`

- Command(s): `helpers.slugify()`
- Preview data:
```csv

```

#### `faker-helpers-slugify-example-1`

- Command(s): `helpers.slugify("Hello World 2026")`
- Preview data:
```csv

```

#### `faker-helpers-slugify-arg-string`

- Command(s): `helpers.slugify("helpers-slugify-string")`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-base`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-example-1`

- Command(s): `helpers.uniqueArray(["red", "green", "blue"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-arg-source`

- Command(s): `helpers.uniqueArray(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-arg-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-pair-source-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv

```

#### `faker-helpers-weightedArrayElement-base`

- Command(s): `helpers.weightedArrayElement([{ "weight": 1, "value": "A" }, { "weight": 2, "value": "B" }])`
- Preview data:
```csv

```

#### `faker-helpers-weightedArrayElement-example-1`

- Command(s): `helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])`
- Preview data:
```csv

```

#### `faker-helpers-weightedArrayElement-arg-array`

- Command(s): `helpers.weightedArrayElement(["A", "B"])`
- Preview data: not generated for this non-executable scenario

#### `domain-airline-aircraftType-base`

- Command(s): `airline.aircraftType()`
- Preview data:
```csv

```

#### `domain-airline-flightNumber-base`

- Command(s): `airline.flightNumber()`
- Preview data:
```csv

```

#### `domain-airline-iataCode-base`

- Command(s): `airline.iataCode()`
- Preview data:
```csv

```

#### `domain-airline-name-base`

- Command(s): `airline.name()`
- Preview data:
```csv

```

#### `domain-airline-recordLocator-base`

- Command(s): `airline.recordLocator()`
- Preview data:
```csv

```

#### `domain-airline-seat-base`

- Command(s): `airline.seat()`
- Preview data:
```csv

```

#### `domain-airline-seat-example-1`

- Command(s): `airline.seat()`
- Preview data:
```csv

```

#### `domain-airline-seat-example-2`

- Command(s): `airline.seat(aircraftType="widebody")`
- Preview data:
```csv

```

#### `domain-airline-seat-arg-aircraftType`

- Command(s): `airline.seat(aircraftType="widebody")`
- Preview data:
```csv

```

#### `domain-airplane-iataTypeCode-base`

- Command(s): `airplane.iataTypeCode()`
- Preview data:
```csv

```

#### `domain-airplane-name-base`

- Command(s): `airplane.name()`
- Preview data:
```csv

```

#### `domain-airport-iataCode-base`

- Command(s): `airport.iataCode()`
- Preview data:
```csv

```

#### `domain-airport-name-base`

- Command(s): `airport.name()`
- Preview data:
```csv

```

#### `domain-animal-bear-base`

- Command(s): `animal.bear()`
- Preview data:
```csv

```

#### `domain-animal-bird-base`

- Command(s): `animal.bird()`
- Preview data:
```csv

```

#### `domain-animal-cat-base`

- Command(s): `animal.cat()`
- Preview data:
```csv

```

#### `domain-animal-cetacean-base`

- Command(s): `animal.cetacean()`
- Preview data:
```csv

```

#### `domain-animal-cow-base`

- Command(s): `animal.cow()`
- Preview data:
```csv

```

#### `domain-animal-crocodilia-base`

- Command(s): `animal.crocodilia()`
- Preview data:
```csv

```

#### `domain-animal-dog-base`

- Command(s): `animal.dog()`
- Preview data:
```csv

```

#### `domain-animal-fish-base`

- Command(s): `animal.fish()`
- Preview data:
```csv

```

#### `domain-animal-horse-base`

- Command(s): `animal.horse()`
- Preview data:
```csv

```

#### `domain-animal-insect-base`

- Command(s): `animal.insect()`
- Preview data:
```csv

```

#### `domain-animal-lion-base`

- Command(s): `animal.lion()`
- Preview data:
```csv

```

#### `domain-animal-petName-base`

- Command(s): `animal.petName()`
- Preview data:
```csv

```

#### `domain-animal-rabbit-base`

- Command(s): `animal.rabbit()`
- Preview data:
```csv

```

#### `domain-animal-rodent-base`

- Command(s): `animal.rodent()`
- Preview data:
```csv

```

#### `domain-animal-snake-base`

- Command(s): `animal.snake()`
- Preview data:
```csv

```

#### `domain-animal-type-base`

- Command(s): `animal.type()`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-base`

- Command(s): `autoIncrement.sequence(1, 5, "filename", ".txt", 3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-example-1`

- Command(s): `autoIncrement.sequence()`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-example-2`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-example-3`

- Command(s): `autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-start`

- Command(s): `autoIncrement.sequence(start=10)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-step`

- Command(s): `autoIncrement.sequence(step=5)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-prefix`

- Command(s): `autoIncrement.sequence(prefix="filename")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-suffix`

- Command(s): `autoIncrement.sequence(suffix=".txt")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-zeropadding`

- Command(s): `autoIncrement.sequence(zeropadding=3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-start-step`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-step-prefix`

- Command(s): `autoIncrement.sequence(step=5, prefix="filename")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-prefix-suffix`

- Command(s): `autoIncrement.sequence(prefix="filename", suffix=".txt")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-suffix-zeropadding`

- Command(s): `autoIncrement.sequence(suffix=".txt", zeropadding=3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-base`

- Command(s): `autoIncrement.timestamp()`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-example-1`

- Command(s): `autoIncrement.timestamp()`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-example-2`

- Command(s): `autoIncrement.timestamp(start="20/03/1969", step=1, type="days")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-example-3`

- Command(s): `autoIncrement.timestamp(start="2026-06-12 12:39:23", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-start`

- Command(s): `autoIncrement.timestamp(start="2026-06-12T12:39:23Z")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-step`

- Command(s): `autoIncrement.timestamp(step=1)`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-type`

- Command(s): `autoIncrement.timestamp(type="seconds")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-outputFormat`

- Command(s): `autoIncrement.timestamp(outputFormat="iso8601")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-inputFormat`

- Command(s): `autoIncrement.timestamp(inputFormat="dd/MM/yyyy")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-start-step`

- Command(s): `autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1)`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-step-type`

- Command(s): `autoIncrement.timestamp(step=1, type="seconds")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-type-outputFormat`

- Command(s): `autoIncrement.timestamp(type="seconds", outputFormat="iso8601")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-outputFormat-inputFormat`

- Command(s): `autoIncrement.timestamp(outputFormat="iso8601", inputFormat="dd/MM/yyyy")`
- Preview data:
```csv

```

#### `domain-book-author-base`

- Command(s): `book.author()`
- Preview data:
```csv

```

#### `domain-book-format-base`

- Command(s): `book.format()`
- Preview data:
```csv

```

#### `domain-book-genre-base`

- Command(s): `book.genre()`
- Preview data:
```csv

```

#### `domain-book-publisher-base`

- Command(s): `book.publisher()`
- Preview data:
```csv

```

#### `domain-book-series-base`

- Command(s): `book.series()`
- Preview data:
```csv

```

#### `domain-book-title-base`

- Command(s): `book.title()`
- Preview data:
```csv

```

#### `domain-chemicalElement-atomicNumber-base`

- Command(s): `chemicalElement.atomicNumber()`
- Preview data:
```csv

```

#### `domain-chemicalElement-name-base`

- Command(s): `chemicalElement.name()`
- Preview data:
```csv

```

#### `domain-chemicalElement-symbol-base`

- Command(s): `chemicalElement.symbol()`
- Preview data:
```csv

```

#### `domain-color-cssSupportedFunction-base`

- Command(s): `color.cssSupportedFunction()`
- Preview data:
```csv

```

#### `domain-color-cssSupportedSpace-base`

- Command(s): `color.cssSupportedSpace()`
- Preview data:
```csv

```

#### `domain-color-human-base`

- Command(s): `color.human()`
- Preview data:
```csv

```

#### `domain-color-rgb-base`

- Command(s): `color.rgb()`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-casing`

- Command(s): `color.rgb(casing="upper")`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-format`

- Command(s): `color.rgb(format="hex")`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-includeAlpha`

- Command(s): `color.rgb(includeAlpha=true)`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-prefix`

- Command(s): `color.rgb(prefix="#")`
- Preview data:
```csv

```

#### `domain-color-rgb-pair-casing-format`

- Command(s): `color.rgb(casing="upper", format="hex")`
- Preview data:
```csv

```

#### `domain-color-rgb-pair-format-includeAlpha`

- Command(s): `color.rgb(format="hex", includeAlpha=true)`
- Preview data:
```csv

```

#### `domain-color-rgb-pair-includeAlpha-prefix`

- Command(s): `color.rgb(includeAlpha=true, prefix="#")`
- Preview data:
```csv

```

#### `domain-color-space-base`

- Command(s): `color.space()`
- Preview data:
```csv

```

#### `domain-commerce-department-base`

- Command(s): `commerce.department()`
- Preview data:
```csv

```

#### `domain-commerce-isbn-base`

- Command(s): `commerce.isbn()`
- Preview data:
```csv

```

#### `domain-commerce-isbn-arg-separator`

- Command(s): `commerce.isbn(separator="-")`
- Preview data:
```csv

```

#### `domain-commerce-isbn-arg-variant`

- Command(s): `commerce.isbn(variant="13")`
- Preview data:
```csv

```

#### `domain-commerce-isbn-pair-separator-variant`

- Command(s): `commerce.isbn(separator="-", variant="13")`
- Preview data:
```csv

```

#### `domain-commerce-price-base`

- Command(s): `commerce.price()`
- Preview data:
```csv

```

#### `domain-commerce-price-example-1`

- Command(s): `commerce.price(dec=2, max=10, min=1, symbol="$")`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-dec`

- Command(s): `commerce.price(dec=2)`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-max`

- Command(s): `commerce.price(max=100)`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-min`

- Command(s): `commerce.price(min=1)`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-symbol`

- Command(s): `commerce.price(symbol="$")`
- Preview data:
```csv

```

#### `domain-commerce-price-pair-dec-max`

- Command(s): `commerce.price(dec=2, max=100)`
- Preview data:
```csv

```

#### `domain-commerce-price-pair-max-min`

- Command(s): `commerce.price(max=100, min=1)`
- Preview data:
```csv

```

#### `domain-commerce-price-pair-min-symbol`

- Command(s): `commerce.price(min=1, symbol="$")`
- Preview data:
```csv

```

#### `domain-commerce-product-base`

- Command(s): `commerce.product()`
- Preview data:
```csv

```

#### `domain-commerce-productAdjective-base`

- Command(s): `commerce.productAdjective()`
- Preview data:
```csv

```

#### `domain-commerce-productDescription-base`

- Command(s): `commerce.productDescription()`
- Preview data:
```csv

```

#### `domain-commerce-productMaterial-base`

- Command(s): `commerce.productMaterial()`
- Preview data:
```csv

```

#### `domain-commerce-productName-base`

- Command(s): `commerce.productName()`
- Preview data:
```csv

```

#### `domain-commerce-upc-base`

- Command(s): `commerce.upc()`
- Preview data:
```csv

```

#### `domain-commerce-upc-arg-prefix`

- Command(s): `commerce.upc(prefix="01234")`
- Preview data:
```csv

```

#### `domain-company-buzzAdjective-base`

- Command(s): `company.buzzAdjective()`
- Preview data:
```csv

```

#### `domain-company-buzzNoun-base`

- Command(s): `company.buzzNoun()`
- Preview data:
```csv

```

#### `domain-company-buzzPhrase-base`

- Command(s): `company.buzzPhrase()`
- Preview data:
```csv

```

#### `domain-company-buzzVerb-base`

- Command(s): `company.buzzVerb()`
- Preview data:
```csv

```

#### `domain-company-catchPhrase-base`

- Command(s): `company.catchPhrase()`
- Preview data:
```csv

```

#### `domain-company-catchPhraseAdjective-base`

- Command(s): `company.catchPhraseAdjective()`
- Preview data:
```csv

```

#### `domain-company-catchPhraseDescriptor-base`

- Command(s): `company.catchPhraseDescriptor()`
- Preview data:
```csv

```

#### `domain-company-catchPhraseNoun-base`

- Command(s): `company.catchPhraseNoun()`
- Preview data:
```csv

```

#### `domain-company-name-base`

- Command(s): `company.name()`
- Preview data:
```csv

```

#### `domain-database-collation-base`

- Command(s): `database.collation()`
- Preview data:
```csv

```

#### `domain-database-column-base`

- Command(s): `database.column()`
- Preview data:
```csv

```

#### `domain-database-engine-base`

- Command(s): `database.engine()`
- Preview data:
```csv

```

#### `domain-database-mongodbObjectId-base`

- Command(s): `database.mongodbObjectId()`
- Preview data:
```csv

```

#### `domain-database-type-base`

- Command(s): `database.type()`
- Preview data:
```csv

```

#### `domain-datatype-boolean-base`

- Command(s): `datatype.boolean()`
- Preview data:
```csv

```

#### `domain-datatype-boolean-arg-probability`

- Command(s): `datatype.boolean(probability=2)`
- Preview data:
```csv

```

#### `domain-datatype-enum-base`

- Command(s): `datatype.enum("active", "inactive", "pending")`
- Preview data:
```csv

```

#### `domain-datatype-enum-arg-values`

- Command(s): `datatype.enum(values="datatype-enum-values")`
- Preview data:
```csv

```

#### `domain-date-anytime-base`

- Command(s): `date.anytime()`
- Preview data:
```csv

```

#### `domain-date-anytime-arg-refDate`

- Command(s): `date.anytime(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-between-base`

- Command(s): `date.between(1577836800000, 1609372800000)`
- Preview data:
```csv

```

#### `domain-date-between-arg-from`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv

```

#### `domain-date-between-arg-to`

- Command(s): `date.between(to=1609372800000, from=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-between-pair-from-to`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv

```

#### `domain-date-birthdate-base`

- Command(s): `date.birthdate()`
- Preview data:
```csv

```

#### `domain-date-birthdate-example-1`

- Command(s): `date.birthdate(refDate=20000, max=69, min=16, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-refDate`

- Command(s): `date.birthdate(refDate=1577836800000, min=18, max=65, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-max`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-min`

- Command(s): `date.birthdate(min=18, max=65, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-mode`

- Command(s): `date.birthdate(mode="age", min=18, max=65)`
- Preview data:
```csv

```

#### `domain-date-birthdate-pair-refDate-max`

- Command(s): `date.birthdate(refDate=1577836800000, max=65, min=18, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-pair-max-min`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-pair-min-mode`

- Command(s): `date.birthdate(min=18, mode="age", max=65)`
- Preview data:
```csv

```

#### `domain-date-future-base`

- Command(s): `date.future()`
- Preview data:
```csv

```

#### `domain-date-future-arg-refDate`

- Command(s): `date.future(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-future-arg-years`

- Command(s): `date.future(years=2)`
- Preview data:
```csv

```

#### `domain-date-future-pair-refDate-years`

- Command(s): `date.future(refDate=1577836800000, years=2)`
- Preview data:
```csv

```

#### `domain-date-month-base`

- Command(s): `date.month()`
- Preview data:
```csv

```

#### `domain-date-month-arg-abbreviated`

- Command(s): `date.month(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-date-month-arg-context`

- Command(s): `date.month(context=true)`
- Preview data:
```csv

```

#### `domain-date-month-pair-abbreviated-context`

- Command(s): `date.month(abbreviated=true, context=true)`
- Preview data:
```csv

```

#### `domain-date-past-base`

- Command(s): `date.past()`
- Preview data:
```csv

```

#### `domain-date-past-arg-refDate`

- Command(s): `date.past(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-past-arg-years`

- Command(s): `date.past(years=2)`
- Preview data:
```csv

```

#### `domain-date-past-pair-refDate-years`

- Command(s): `date.past(refDate=1577836800000, years=2)`
- Preview data:
```csv

```

#### `domain-date-recent-base`

- Command(s): `date.recent()`
- Preview data:
```csv

```

#### `domain-date-recent-arg-days`

- Command(s): `date.recent(days=7)`
- Preview data:
```csv

```

#### `domain-date-recent-arg-refDate`

- Command(s): `date.recent(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-recent-pair-days-refDate`

- Command(s): `date.recent(days=7, refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-soon-base`

- Command(s): `date.soon()`
- Preview data:
```csv

```

#### `domain-date-soon-arg-days`

- Command(s): `date.soon(days=7)`
- Preview data:
```csv

```

#### `domain-date-soon-arg-refDate`

- Command(s): `date.soon(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-soon-pair-days-refDate`

- Command(s): `date.soon(days=7, refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-timeZone-base`

- Command(s): `date.timeZone()`
- Preview data:
```csv

```

#### `domain-date-weekday-base`

- Command(s): `date.weekday()`
- Preview data:
```csv

```

#### `domain-date-weekday-arg-abbreviated`

- Command(s): `date.weekday(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-date-weekday-arg-context`

- Command(s): `date.weekday(context=true)`
- Preview data:
```csv

```

#### `domain-date-weekday-pair-abbreviated-context`

- Command(s): `date.weekday(abbreviated=true, context=true)`
- Preview data:
```csv

```

#### `domain-finance-accountName-base`

- Command(s): `finance.accountName()`
- Preview data:
```csv

```

#### `domain-finance-accountNumber-base`

- Command(s): `finance.accountNumber()`
- Preview data:
```csv

```

#### `domain-finance-accountNumber-arg-length`

- Command(s): `finance.accountNumber(length=4)`
- Preview data:
```csv

```

#### `domain-finance-amount-base`

- Command(s): `finance.amount()`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-autoFormat`

- Command(s): `finance.amount(autoFormat=true)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-dec`

- Command(s): `finance.amount(dec=2)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-max`

- Command(s): `finance.amount(max=100)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-min`

- Command(s): `finance.amount(min=1)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-symbol`

- Command(s): `finance.amount(symbol="$")`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-autoFormat-dec`

- Command(s): `finance.amount(autoFormat=true, dec=2)`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-dec-max`

- Command(s): `finance.amount(dec=2, max=100)`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-max-min`

- Command(s): `finance.amount(max=100, min=1)`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-min-symbol`

- Command(s): `finance.amount(min=1, symbol="$")`
- Preview data:
```csv

```

#### `domain-finance-bic-base`

- Command(s): `finance.bic()`
- Preview data:
```csv

```

#### `domain-finance-bic-arg-includeBranchCode`

- Command(s): `finance.bic(includeBranchCode=true)`
- Preview data:
```csv

```

#### `domain-finance-bitcoinAddress-base`

- Command(s): `finance.bitcoinAddress()`
- Preview data:
```csv

```

#### `domain-finance-creditCardCVV-base`

- Command(s): `finance.creditCardCVV()`
- Preview data:
```csv

```

#### `domain-finance-creditCardIssuer-base`

- Command(s): `finance.creditCardIssuer()`
- Preview data:
```csv

```

#### `domain-finance-creditCardNumber-base`

- Command(s): `finance.creditCardNumber()`
- Preview data:
```csv

```

#### `domain-finance-creditCardNumber-arg-issuer`

- Command(s): `finance.creditCardNumber(issuer="finance-creditCardNumber-issuer")`
- Preview data:
```csv

```

#### `domain-finance-currencyCode-base`

- Command(s): `finance.currencyCode()`
- Preview data:
```csv

```

#### `domain-finance-currencyName-base`

- Command(s): `finance.currencyName()`
- Preview data:
```csv

```

#### `domain-finance-currencyNumericCode-base`

- Command(s): `finance.currencyNumericCode()`
- Preview data:
```csv

```

#### `domain-finance-currencySymbol-base`

- Command(s): `finance.currencySymbol()`
- Preview data:
```csv

```

#### `domain-finance-ethereumAddress-base`

- Command(s): `finance.ethereumAddress()`
- Preview data:
```csv

```

#### `domain-finance-iban-base`

- Command(s): `finance.iban()`
- Preview data:
```csv

```

#### `domain-finance-iban-arg-countryCode`

- Command(s): `finance.iban(countryCode="GB")`
- Preview data:
```csv

```

#### `domain-finance-iban-arg-formatted`

- Command(s): `finance.iban(formatted=true)`
- Preview data:
```csv

```

#### `domain-finance-iban-pair-countryCode-formatted`

- Command(s): `finance.iban(countryCode="GB", formatted=true)`
- Preview data:
```csv

```

#### `domain-finance-litecoinAddress-base`

- Command(s): `finance.litecoinAddress()`
- Preview data:
```csv

```

#### `domain-finance-pin-base`

- Command(s): `finance.pin()`
- Preview data:
```csv

```

#### `domain-finance-pin-arg-length`

- Command(s): `finance.pin(length=4)`
- Preview data:
```csv

```

#### `domain-finance-routingNumber-base`

- Command(s): `finance.routingNumber()`
- Preview data:
```csv

```

#### `domain-finance-transactionDescription-base`

- Command(s): `finance.transactionDescription()`
- Preview data:
```csv

```

#### `domain-finance-transactionType-base`

- Command(s): `finance.transactionType()`
- Preview data:
```csv

```

#### `domain-food-adjective-base`

- Command(s): `food.adjective()`
- Preview data:
```csv

```

#### `domain-food-description-base`

- Command(s): `food.description()`
- Preview data:
```csv

```

#### `domain-food-dish-base`

- Command(s): `food.dish()`
- Preview data:
```csv

```

#### `domain-food-ethnicCategory-base`

- Command(s): `food.ethnicCategory()`
- Preview data:
```csv

```

#### `domain-food-fruit-base`

- Command(s): `food.fruit()`
- Preview data:
```csv

```

#### `domain-food-ingredient-base`

- Command(s): `food.ingredient()`
- Preview data:
```csv

```

#### `domain-food-meat-base`

- Command(s): `food.meat()`
- Preview data:
```csv

```

#### `domain-food-spice-base`

- Command(s): `food.spice()`
- Preview data:
```csv

```

#### `domain-food-vegetable-base`

- Command(s): `food.vegetable()`
- Preview data:
```csv

```

#### `domain-git-branch-base`

- Command(s): `git.branch()`
- Preview data:
```csv

```

#### `domain-git-commitDate-base`

- Command(s): `git.commitDate()`
- Preview data:
```csv

```

#### `domain-git-commitEntry-base`

- Command(s): `git.commitEntry()`
- Preview data:
```csv

```

#### `domain-git-commitMessage-base`

- Command(s): `git.commitMessage()`
- Preview data:
```csv

```

#### `domain-git-commitSha-base`

- Command(s): `git.commitSha()`
- Preview data:
```csv

```

#### `domain-hacker-abbreviation-base`

- Command(s): `hacker.abbreviation()`
- Preview data:
```csv

```

#### `domain-hacker-adjective-base`

- Command(s): `hacker.adjective()`
- Preview data:
```csv

```

#### `domain-hacker-ingverb-base`

- Command(s): `hacker.ingverb()`
- Preview data:
```csv

```

#### `domain-hacker-noun-base`

- Command(s): `hacker.noun()`
- Preview data:
```csv

```

#### `domain-hacker-phrase-base`

- Command(s): `hacker.phrase()`
- Preview data:
```csv

```

#### `domain-hacker-verb-base`

- Command(s): `hacker.verb()`
- Preview data:
```csv

```

#### `domain-image-avatar-base`

- Command(s): `image.avatar()`
- Preview data:
```csv

```

#### `domain-image-avatarGitHub-base`

- Command(s): `image.avatarGitHub()`
- Preview data:
```csv

```

#### `domain-image-dataUri-base`

- Command(s): `image.dataUri()`
- Preview data:
```csv

```

#### `domain-image-personPortrait-base`

- Command(s): `image.personPortrait()`
- Preview data:
```csv

```

#### `domain-image-url-base`

- Command(s): `image.url()`
- Preview data:
```csv

```

#### `domain-image-url-arg-height`

- Command(s): `image.url(height=2)`
- Preview data:
```csv

```

#### `domain-image-url-arg-width`

- Command(s): `image.url(width=3)`
- Preview data:
```csv

```

#### `domain-image-url-pair-height-width`

- Command(s): `image.url(height=2, width=3)`
- Preview data:
```csv

```

- Preview data:
```csv

```

#### `domain-image-urlPicsumPhotos-base`

- Command(s): `image.urlPicsumPhotos()`
- Preview data:
```csv

```

#### `domain-internet-displayName-base`

- Command(s): `internet.displayName()`
- Preview data:
```csv

```

#### `domain-internet-domainName-base`

- Command(s): `internet.domainName()`
- Preview data:
```csv

```

#### `domain-internet-domainSuffix-base`

- Command(s): `internet.domainSuffix()`
- Preview data:
```csv

```

#### `domain-internet-domainWord-base`

- Command(s): `internet.domainWord()`
- Preview data:
```csv

```

#### `domain-internet-email-base`

- Command(s): `internet.email()`
- Preview data:
```csv

```

#### `domain-internet-email-arg-allowSpecialCharacters`

- Command(s): `internet.email(allowSpecialCharacters=true)`
- Preview data:
```csv

```

#### `domain-internet-email-arg-firstName`

- Command(s): `internet.email(firstName="Ada")`
- Preview data:
```csv

```

#### `domain-internet-email-arg-lastName`

- Command(s): `internet.email(lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-internet-email-arg-provider`

- Command(s): `internet.email(provider="example.com")`
- Preview data:
```csv

```

#### `domain-internet-email-pair-allowSpecialCharacters-firstName`

- Command(s): `internet.email(allowSpecialCharacters=true, firstName="Ada")`
- Preview data:
```csv

```

#### `domain-internet-email-pair-firstName-lastName`

- Command(s): `internet.email(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-internet-email-pair-lastName-provider`

- Command(s): `internet.email(lastName="Lovelace", provider="example.com")`
- Preview data:
```csv

```

#### `domain-internet-emoji-base`

- Command(s): `internet.emoji()`
- Preview data:
```csv

```

#### `domain-internet-emoji-arg-types`

- Command(s): `internet.emoji(types=["food"])`
- Preview data:
```csv

```

#### `domain-internet-exampleEmail-base`

- Command(s): `internet.exampleEmail()`
- Preview data:
```csv

```

#### `domain-internet-httpMethod-base`

- Command(s): `internet.httpMethod()`
- Preview data:
```csv

```

#### `domain-internet-httpStatusCode-base`

- Command(s): `internet.httpStatusCode()`
- Preview data:
```csv

```

#### `domain-internet-ip-base`

- Command(s): `internet.ip()`
- Preview data:
```csv

```

#### `domain-internet-ipv4-base`

- Command(s): `internet.ipv4()`
- Preview data:
```csv

```

#### `domain-internet-ipv4-arg-cidrBlock`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24")`
- Preview data:
```csv

```

#### `domain-internet-ipv4-arg-network`

- Command(s): `internet.ipv4(network="private-a")`
- Preview data:
```csv

```

#### `domain-internet-ipv4-pair-cidrBlock-network`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24", network="private-a")`
- Preview data:
```csv

```

#### `domain-internet-ipv6-base`

- Command(s): `internet.ipv6()`
- Preview data:
```csv

```

#### `domain-internet-jwt-base`

- Command(s): `internet.jwt()`
- Preview data:
```csv

```

#### `domain-internet-jwt-arg-header`

- Command(s): `internet.jwt(header={})`
- Preview data:
```csv

```

#### `domain-internet-jwt-arg-payload`

- Command(s): `internet.jwt(payload={})`
- Preview data:
```csv

```

#### `domain-internet-jwt-arg-refDate`

- Command(s): `internet.jwt(refDate=4)`
- Preview data:
```csv

```

#### `domain-internet-jwt-pair-header-payload`

- Command(s): `internet.jwt(header={}, payload={})`
- Preview data:
```csv

```

#### `domain-internet-jwt-pair-payload-refDate`

- Command(s): `internet.jwt(payload={}, refDate=4)`
- Preview data:
```csv

```

#### `domain-internet-jwtAlgorithm-base`

- Command(s): `internet.jwtAlgorithm()`
- Preview data:
```csv

```

#### `domain-internet-mac-base`

- Command(s): `internet.mac()`
- Preview data:
```csv

```

#### `domain-internet-mac-arg-separator`

- Command(s): `internet.mac(separator="-")`
- Preview data:
```csv

```

#### `domain-internet-password-base`

- Command(s): `internet.password()`
- Preview data:
```csv

```

#### `domain-internet-password-example-1`

- Command(s): `internet.password(length=10, memorable=false, pattern="[A-Za-z0-9]", prefix="#")`
- Preview data:
```csv

```

#### `domain-internet-password-arg-length`

- Command(s): `internet.password(length=12)`
- Preview data:
```csv

```

#### `domain-internet-password-arg-memorable`

- Command(s): `internet.password(memorable=true)`
- Preview data:
```csv

```

#### `domain-internet-password-arg-pattern`

- Command(s): `internet.password(pattern="[A-Z]")`
- Preview data:
```csv

```

#### `domain-internet-password-arg-prefix`

- Command(s): `internet.password(prefix="#")`
- Preview data:
```csv

```

#### `domain-internet-password-pair-length-memorable`

- Command(s): `internet.password(length=12, memorable=true)`
- Preview data:
```csv

```

#### `domain-internet-password-pair-memorable-pattern`

- Command(s): `internet.password(memorable=true, pattern="[A-Z]")`
- Preview data:
```csv

```

#### `domain-internet-password-pair-pattern-prefix`

- Command(s): `internet.password(pattern="[A-Z]", prefix="#")`
- Preview data:
```csv

```

#### `domain-internet-port-base`

- Command(s): `internet.port()`
- Preview data:
```csv

```

#### `domain-internet-protocol-base`

- Command(s): `internet.protocol()`
- Preview data:
```csv

```

#### `domain-internet-url-base`

- Command(s): `internet.url()`
- Preview data:
```csv

```

#### `domain-internet-url-arg-appendSlash`

- Command(s): `internet.url(appendSlash=true)`
- Preview data:
```csv

```

#### `domain-internet-url-arg-protocol`

- Command(s): `internet.url(protocol="https")`
- Preview data:
```csv

```

#### `domain-internet-url-pair-appendSlash-protocol`

- Command(s): `internet.url(appendSlash=true, protocol="https")`
- Preview data:
```csv

```

#### `domain-internet-userAgent-base`

- Command(s): `internet.userAgent()`
- Preview data:
```csv

```

#### `domain-internet-username-base`

- Command(s): `internet.username()`
- Preview data:
```csv

```

#### `domain-internet-username-arg-firstName`

- Command(s): `internet.username(firstName="Ada")`
- Preview data:
```csv

```

#### `domain-internet-username-arg-lastName`

- Command(s): `internet.username(lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-internet-username-pair-firstName-lastName`

- Command(s): `internet.username(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-literal-value-base`

- Command(s): `literal.value()`
- Preview data:
```csv

```

#### `domain-literal-value-example-1`

- Command(s): `literal.value("Pending")`
- Preview data:
```csv

```

#### `domain-literal-value-example-2`

- Command(s): `literal.value("")`
- Preview data:
```csv

```

#### `domain-literal-value-arg-value`

- Command(s): `literal.value(value=true)`
- Preview data:
```csv

```

#### `domain-location-buildingNumber-base`

- Command(s): `location.buildingNumber()`
- Preview data:
```csv

```

#### `domain-location-cardinalDirection-base`

- Command(s): `location.cardinalDirection()`
- Preview data:
```csv

```

#### `domain-location-city-base`

- Command(s): `location.city()`
- Preview data:
```csv

```

#### `domain-location-continent-base`

- Command(s): `location.continent()`
- Preview data:
```csv

```

#### `domain-location-country-base`

- Command(s): `location.country()`
- Preview data:
```csv

```

#### `domain-location-countryCode-base`

- Command(s): `location.countryCode()`
- Preview data:
```csv

```

#### `domain-location-county-base`

- Command(s): `location.county()`
- Preview data:
```csv

```

#### `domain-location-direction-base`

- Command(s): `location.direction()`
- Preview data:
```csv

```

#### `domain-location-direction-arg-abbreviated`

- Command(s): `location.direction(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-location-latitude-base`

- Command(s): `location.latitude()`
- Preview data:
```csv

```

#### `domain-location-latitude-arg-min`

- Command(s): `location.latitude(min=1)`
- Preview data:
```csv

```

#### `domain-location-latitude-arg-max`

- Command(s): `location.latitude(max=3)`
- Preview data:
```csv

```

#### `domain-location-latitude-arg-precision`

- Command(s): `location.latitude(precision=4)`
- Preview data:
```csv

```

#### `domain-location-latitude-pair-min-max`

- Command(s): `location.latitude(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-location-latitude-pair-max-precision`

- Command(s): `location.latitude(max=3, precision=4)`
- Preview data:
```csv

```

#### `domain-location-longitude-base`

- Command(s): `location.longitude()`
- Preview data:
```csv

```

#### `domain-location-longitude-arg-min`

- Command(s): `location.longitude(min=1)`
- Preview data:
```csv

```

#### `domain-location-longitude-arg-max`

- Command(s): `location.longitude(max=3)`
- Preview data:
```csv

```

#### `domain-location-longitude-arg-precision`

- Command(s): `location.longitude(precision=4)`
- Preview data:
```csv

```

#### `domain-location-longitude-pair-min-max`

- Command(s): `location.longitude(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-location-longitude-pair-max-precision`

- Command(s): `location.longitude(max=3, precision=4)`
- Preview data:
```csv

```

#### `domain-location-ordinalDirection-base`

- Command(s): `location.ordinalDirection()`
- Preview data:
```csv

```

#### `domain-location-secondaryAddress-base`

- Command(s): `location.secondaryAddress()`
- Preview data:
```csv

```

#### `domain-location-state-base`

- Command(s): `location.state()`
- Preview data:
```csv

```

#### `domain-location-state-arg-abbreviated`

- Command(s): `location.state(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-location-street-base`

- Command(s): `location.street()`
- Preview data:
```csv

```

#### `domain-location-streetAddress-base`

- Command(s): `location.streetAddress()`
- Preview data:
```csv

```

#### `domain-location-streetAddress-arg-useFullAddress`

- Command(s): `location.streetAddress(useFullAddress=true)`
- Preview data:
```csv

```

#### `domain-location-timeZone-base`

- Command(s): `location.timeZone()`
- Preview data:
```csv

```

#### `domain-location-zipCode-base`

- Command(s): `location.zipCode()`
- Preview data:
```csv

```

#### `domain-lorem-lines-base`

- Command(s): `lorem.lines()`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-min`

- Command(s): `lorem.lines(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-max`

- Command(s): `lorem.lines(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-lineCount`

- Command(s): `lorem.lines(lineCount=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-lineCountMax`

- Command(s): `lorem.lines(lineCountMax=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-lineCountMin`

- Command(s): `lorem.lines(lineCountMin=1)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-min-max`

- Command(s): `lorem.lines(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-max-lineCount`

- Command(s): `lorem.lines(max=3, lineCount=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-lineCount-lineCountMax`

- Command(s): `lorem.lines(lineCount=2, lineCountMax=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-lineCountMax-lineCountMin`

- Command(s): `lorem.lines(lineCountMax=2, lineCountMin=1)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-base`

- Command(s): `lorem.paragraph()`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-min`

- Command(s): `lorem.paragraph(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-max`

- Command(s): `lorem.paragraph(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-sentenceCount`

- Command(s): `lorem.paragraph(sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-min-max`

- Command(s): `lorem.paragraph(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-max-sentenceCount`

- Command(s): `lorem.paragraph(max=3, sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-sentenceCount-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCount=4, sentenceCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMax=5, sentenceCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-base`

- Command(s): `lorem.paragraphs()`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-min`

- Command(s): `lorem.paragraphs(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-max`

- Command(s): `lorem.paragraphs(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-paragraphCount`

- Command(s): `lorem.paragraphs(paragraphCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-separator`

- Command(s): `lorem.paragraphs(separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-paragraphCountMax`

- Command(s): `lorem.paragraphs(paragraphCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-min-max`

- Command(s): `lorem.paragraphs(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-max-paragraphCount`

- Command(s): `lorem.paragraphs(max=3, paragraphCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-paragraphCount-separator`

- Command(s): `lorem.paragraphs(paragraphCount=4, separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-separator-paragraphCountMax`

- Command(s): `lorem.paragraphs(separator="-", paragraphCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-paragraphCountMax-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMax=6, paragraphCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-base`

- Command(s): `lorem.sentence()`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-min`

- Command(s): `lorem.sentence(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-max`

- Command(s): `lorem.sentence(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-wordCount`

- Command(s): `lorem.sentence(wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-wordCountMax`

- Command(s): `lorem.sentence(wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-wordCountMin`

- Command(s): `lorem.sentence(wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-min-max`

- Command(s): `lorem.sentence(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-max-wordCount`

- Command(s): `lorem.sentence(max=3, wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-wordCount-wordCountMax`

- Command(s): `lorem.sentence(wordCount=4, wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.sentence(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-base`

- Command(s): `lorem.sentences()`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-min`

- Command(s): `lorem.sentences(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-max`

- Command(s): `lorem.sentences(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-sentenceCount`

- Command(s): `lorem.sentences(sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-separator`

- Command(s): `lorem.sentences(separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-sentenceCountMax`

- Command(s): `lorem.sentences(sentenceCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-min-max`

- Command(s): `lorem.sentences(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-max-sentenceCount`

- Command(s): `lorem.sentences(max=3, sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-sentenceCount-separator`

- Command(s): `lorem.sentences(sentenceCount=4, separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-separator-sentenceCountMax`

- Command(s): `lorem.sentences(separator="-", sentenceCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMax=6, sentenceCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-slug-base`

- Command(s): `lorem.slug()`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-min`

- Command(s): `lorem.slug(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-max`

- Command(s): `lorem.slug(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-wordCount`

- Command(s): `lorem.slug(wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-wordCountMax`

- Command(s): `lorem.slug(wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-wordCountMin`

- Command(s): `lorem.slug(wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-min-max`

- Command(s): `lorem.slug(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-max-wordCount`

- Command(s): `lorem.slug(max=3, wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-wordCount-wordCountMax`

- Command(s): `lorem.slug(wordCount=4, wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.slug(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-text-base`

- Command(s): `lorem.text()`
- Preview data:
```csv

```

#### `domain-lorem-word-base`

- Command(s): `lorem.word()`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-min`

- Command(s): `lorem.word(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-max`

- Command(s): `lorem.word(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-length`

- Command(s): `lorem.word(length=4)`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-strategy`

- Command(s): `lorem.word(strategy="lorem-word-strategy")`
- Preview data:
```csv

```

#### `domain-lorem-word-pair-min-max`

- Command(s): `lorem.word(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-word-pair-max-length`

- Command(s): `lorem.word(max=3, length=4)`
- Preview data:
```csv

```

#### `domain-lorem-word-pair-length-strategy`

- Command(s): `lorem.word(length=4, strategy="lorem-word-strategy")`
- Preview data:
```csv

```

#### `domain-lorem-words-base`

- Command(s): `lorem.words()`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-min`

- Command(s): `lorem.words(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-max`

- Command(s): `lorem.words(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-wordCount`

- Command(s): `lorem.words(wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-wordCountMax`

- Command(s): `lorem.words(wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-wordCountMin`

- Command(s): `lorem.words(wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-min-max`

- Command(s): `lorem.words(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-max-wordCount`

- Command(s): `lorem.words(max=3, wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-wordCount-wordCountMax`

- Command(s): `lorem.words(wordCount=4, wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.words(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-music-album-base`

- Command(s): `music.album()`
- Preview data:
```csv

```

#### `domain-music-artist-base`

- Command(s): `music.artist()`
- Preview data:
```csv

```

#### `domain-music-genre-base`

- Command(s): `music.genre()`
- Preview data:
```csv

```

#### `domain-music-songName-base`

- Command(s): `music.songName()`
- Preview data:
```csv

```

#### `domain-number-bigInt-base`

- Command(s): `number.bigInt()`
- Preview data:
```csv

```

#### `domain-number-bigInt-arg-value`

- Command(s): `number.bigInt(value=true)`
- Preview data:
```csv

```

#### `domain-number-binary-base`

- Command(s): `number.binary()`
- Preview data:
```csv

```

#### `domain-number-binary-arg-max`

- Command(s): `number.binary(max=3)`
- Preview data:
```csv

```

#### `domain-number-binary-arg-min`

- Command(s): `number.binary(min=1)`
- Preview data:
```csv

```

#### `domain-number-binary-pair-max-min`

- Command(s): `number.binary(max=3, min=1)`
- Preview data:
```csv

```

#### `domain-number-float-base`

- Command(s): `number.float()`
- Preview data:
```csv

```

#### `domain-number-float-arg-fractionDigits`

- Command(s): `number.float(fractionDigits=2)`
- Preview data:
```csv

```

#### `domain-number-float-arg-max`

- Command(s): `number.float(max=3)`
- Preview data:
```csv

```

#### `domain-number-float-arg-min`

- Command(s): `number.float(min=1)`
- Preview data:
```csv

```

#### `domain-number-float-arg-multipleOf`

- Command(s): `number.float(multipleOf=0.5)`
- Preview data:
```csv

```

#### `domain-number-float-pair-fractionDigits-max`

- Command(s): `number.float(fractionDigits=2, max=3)`
- Preview data:
```csv

```

#### `domain-number-float-pair-max-min`

- Command(s): `number.float(max=3, min=1)`
- Preview data:
```csv

```

#### `domain-number-float-pair-min-multipleOf`

- Command(s): `number.float(min=1, multipleOf=0.5)`
- Preview data:
```csv

```

#### `domain-number-hex-base`

- Command(s): `number.hex()`
- Preview data:
```csv

```

#### `domain-number-hex-arg-min`

- Command(s): `number.hex(min=1)`
- Preview data:
```csv

```

#### `domain-number-hex-arg-max`

- Command(s): `number.hex(max=3)`
- Preview data:
```csv

```

#### `domain-number-hex-pair-min-max`

- Command(s): `number.hex(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-number-int-base`

- Command(s): `number.int()`
- Preview data:
```csv

```

#### `domain-number-int-arg-min`

- Command(s): `number.int(min=1)`
- Preview data:
```csv

```

#### `domain-number-int-arg-max`

- Command(s): `number.int(max=3)`
- Preview data:
```csv

```

#### `domain-number-int-arg-multipleOf`

- Command(s): `number.int(multipleOf=4)`
- Preview data:
```csv

```

#### `domain-number-int-pair-min-max`

- Command(s): `number.int(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-number-int-pair-max-multipleOf`

- Command(s): `number.int(max=3, multipleOf=4)`
- Preview data:
```csv

```

#### `domain-number-octal-base`

- Command(s): `number.octal()`
- Preview data:
```csv

```

#### `domain-number-octal-arg-max`

- Command(s): `number.octal(max=3)`
- Preview data:
```csv

```

#### `domain-number-octal-arg-min`

- Command(s): `number.octal(min=1)`
- Preview data:
```csv

```

#### `domain-number-octal-pair-max-min`

- Command(s): `number.octal(max=3, min=1)`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-base`

- Command(s): `number.romanNumeral()`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-arg-min`

- Command(s): `number.romanNumeral(min=1)`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-arg-max`

- Command(s): `number.romanNumeral(max=3)`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-pair-min-max`

- Command(s): `number.romanNumeral(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-person-bio-base`

- Command(s): `person.bio()`
- Preview data:
```csv

```

#### `domain-person-firstName-base`

- Command(s): `person.firstName()`
- Preview data:
```csv

```

#### `domain-person-firstName-arg-sex`

- Command(s): `person.firstName(sex="male")`
- Preview data:
```csv

```

#### `domain-person-fullName-base`

- Command(s): `person.fullName()`
- Preview data:
```csv

```

#### `domain-person-gender-base`

- Command(s): `person.gender()`
- Preview data:
```csv

```

#### `domain-person-jobArea-base`

- Command(s): `person.jobArea()`
- Preview data:
```csv

```

#### `domain-person-jobDescriptor-base`

- Command(s): `person.jobDescriptor()`
- Preview data:
```csv

```

#### `domain-person-jobTitle-base`

- Command(s): `person.jobTitle()`
- Preview data:
```csv

```

#### `domain-person-jobType-base`

- Command(s): `person.jobType()`
- Preview data:
```csv

```

#### `domain-person-lastName-base`

- Command(s): `person.lastName()`
- Preview data:
```csv

```

#### `domain-person-lastName-arg-sex`

- Command(s): `person.lastName(sex="male")`
- Preview data:
```csv

```

#### `domain-person-middleName-base`

- Command(s): `person.middleName()`
- Preview data:
```csv

```

#### `domain-person-middleName-arg-sex`

- Command(s): `person.middleName(sex="male")`
- Preview data:
```csv

```

#### `domain-person-prefix-base`

- Command(s): `person.prefix()`
- Preview data:
```csv

```

#### `domain-person-prefix-arg-sex`

- Command(s): `person.prefix(sex="male")`
- Preview data:
```csv

```

#### `domain-person-sex-base`

- Command(s): `person.sex()`
- Preview data:
```csv

```

#### `domain-person-sexType-base`

- Command(s): `person.sexType()`
- Preview data:
```csv

```

#### `domain-person-suffix-base`

- Command(s): `person.suffix()`
- Preview data:
```csv

```

#### `domain-person-zodiacSign-base`

- Command(s): `person.zodiacSign()`
- Preview data:
```csv

```

#### `domain-phone-imei-base`

- Command(s): `phone.imei()`
- Preview data:
```csv

```

#### `domain-phone-number-base`

- Command(s): `phone.number()`
- Preview data:
```csv

```

#### `domain-phone-number-arg-style`

- Command(s): `phone.number(style="international")`
- Preview data:
```csv

```

#### `domain-string-alpha-base`

- Command(s): `string.alpha()`
- Preview data:
```csv

```

#### `domain-string-alpha-arg-length`

- Command(s): `string.alpha(length=4)`
- Preview data:
```csv

```

#### `domain-string-alpha-arg-casing`

- Command(s): `string.alpha(casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alpha-arg-exclude`

- Command(s): `string.alpha(exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-alpha-pair-length-casing`

- Command(s): `string.alpha(length=4, casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alpha-pair-casing-exclude`

- Command(s): `string.alpha(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-base`

- Command(s): `string.alphanumeric()`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-arg-length`

- Command(s): `string.alphanumeric(length=4)`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-arg-casing`

- Command(s): `string.alphanumeric(casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-arg-exclude`

- Command(s): `string.alphanumeric(exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-pair-length-casing`

- Command(s): `string.alphanumeric(length=4, casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-pair-casing-exclude`

- Command(s): `string.alphanumeric(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-binary-base`

- Command(s): `string.binary()`
- Preview data:
```csv

```

#### `domain-string-binary-arg-length`

- Command(s): `string.binary(length=4)`
- Preview data:
```csv

```

#### `domain-string-binary-arg-prefix`

- Command(s): `string.binary(prefix="#")`
- Preview data:
```csv

```

#### `domain-string-binary-pair-length-prefix`

- Command(s): `string.binary(length=4, prefix="#")`
- Preview data:
```csv

```

#### `domain-string-counterString-base`

- Command(s): `string.counterString(1, 25, "*")`
- Preview data:
```csv

```

#### `domain-string-counterString-example-1`

- Command(s): `string.counterString()`
- Preview data:
```csv

```

#### `domain-string-counterString-example-2`

- Command(s): `string.counterString(15)`
- Preview data:
```csv

```

#### `domain-string-counterString-example-3`

- Command(s): `string.counterString(min=5, max=12)`
- Preview data:
```csv

```

#### `domain-string-counterString-example-4`

- Command(s): `string.counterString(min=12, max=12, delimiter="#")`
- Preview data:
```csv

```

#### `domain-string-counterString-arg-min`

- Command(s): `string.counterString(min=5)`
- Preview data:
```csv

```

#### `domain-string-counterString-arg-max`

- Command(s): `string.counterString(max=12)`
- Preview data:
```csv

```

#### `domain-string-counterString-arg-delimiter`

- Command(s): `string.counterString(delimiter="#")`
- Preview data:
```csv

```

#### `domain-string-counterString-pair-min-max`

- Command(s): `string.counterString(min=5, max=12)`
- Preview data:
```csv

```

#### `domain-string-counterString-pair-max-delimiter`

- Command(s): `string.counterString(max=12, delimiter="#")`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-base`

- Command(s): `string.fromCharacters("ABC123", 4)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-example-1`

- Command(s): `string.fromCharacters("ABC123", 6)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-example-2`

- Command(s): `string.fromCharacters(characters=["A", "B", "C"], length=4)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-arg-characters`

- Command(s): `string.fromCharacters(characters="ABC123")`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-arg-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-pair-characters-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-base`

- Command(s): `string.hexadecimal()`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-arg-casing`

- Command(s): `string.hexadecimal(casing="upper")`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-arg-length`

- Command(s): `string.hexadecimal(length=4)`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-arg-prefix`

- Command(s): `string.hexadecimal(prefix="#")`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-pair-casing-length`

- Command(s): `string.hexadecimal(casing="upper", length=4)`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-pair-length-prefix`

- Command(s): `string.hexadecimal(length=4, prefix="#")`
- Preview data:
```csv

```

#### `domain-string-nanoid-base`

- Command(s): `string.nanoid()`
- Preview data:
```csv

```

#### `domain-string-nanoid-arg-length`

- Command(s): `string.nanoid(length=4)`
- Preview data:
```csv

```

#### `domain-string-numeric-base`

- Command(s): `string.numeric()`
- Preview data:
```csv

```

#### `domain-string-numeric-arg-length`

- Command(s): `string.numeric(length=4)`
- Preview data:
```csv

```

#### `domain-string-numeric-arg-allowLeadingZeros`

- Command(s): `string.numeric(allowLeadingZeros=true)`
- Preview data:
```csv

```

#### `domain-string-numeric-arg-exclude`

- Command(s): `string.numeric(exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-numeric-pair-length-allowLeadingZeros`

- Command(s): `string.numeric(length=4, allowLeadingZeros=true)`
- Preview data:
```csv

```

#### `domain-string-numeric-pair-allowLeadingZeros-exclude`

- Command(s): `string.numeric(allowLeadingZeros=true, exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-octal-base`

- Command(s): `string.octal()`
- Preview data:
```csv

```

#### `domain-string-octal-arg-length`

- Command(s): `string.octal(length=4)`
- Preview data:
```csv

```

#### `domain-string-octal-arg-prefix`

- Command(s): `string.octal(prefix="#")`
- Preview data:
```csv

```

#### `domain-string-octal-pair-length-prefix`

- Command(s): `string.octal(length=4, prefix="#")`
- Preview data:
```csv

```

#### `domain-string-sample-base`

- Command(s): `string.sample()`
- Preview data:
```csv

```

#### `domain-string-sample-arg-length`

- Command(s): `string.sample(length=4)`
- Preview data:
```csv

```

#### `domain-string-symbol-base`

- Command(s): `string.symbol()`
- Preview data:
```csv

```

#### `domain-string-symbol-arg-length`

- Command(s): `string.symbol(length=4)`
- Preview data:
```csv

```

#### `domain-string-ulid-base`

- Command(s): `string.ulid()`
- Preview data:
```csv

```

#### `domain-string-ulid-arg-refDate`

- Command(s): `string.ulid(refDate=2)`
- Preview data:
```csv

```

#### `domain-string-uuid-base`

- Command(s): `string.uuid()`
- Preview data:
```csv

```

#### `domain-system-commonFileExt-base`

- Command(s): `system.commonFileExt()`
- Preview data:
```csv

```

#### `domain-system-commonFileName-base`

- Command(s): `system.commonFileName()`
- Preview data:
```csv

```

#### `domain-system-commonFileName-arg-extension`

- Command(s): `system.commonFileName(extension="system-commonFileName-extension")`
- Preview data:
```csv

```

#### `domain-system-commonFileType-base`

- Command(s): `system.commonFileType()`
- Preview data:
```csv

```

#### `domain-system-cron-base`

- Command(s): `system.cron()`
- Preview data:
```csv

```

#### `domain-system-cron-arg-includeNonStandard`

- Command(s): `system.cron(includeNonStandard=true)`
- Preview data:
```csv

```

#### `domain-system-cron-arg-includeYear`

- Command(s): `system.cron(includeYear=true)`
- Preview data:
```csv

```

#### `domain-system-cron-pair-includeNonStandard-includeYear`

- Command(s): `system.cron(includeNonStandard=true, includeYear=true)`
- Preview data:
```csv

```

#### `domain-system-directoryPath-base`

- Command(s): `system.directoryPath()`
- Preview data:
```csv

```

#### `domain-system-fileExt-base`

- Command(s): `system.fileExt()`
- Preview data:
```csv

```

#### `domain-system-fileExt-arg-mimeType`

- Command(s): `system.fileExt(mimeType="system-fileExt-mimeType")`
- Preview data:
```csv

```

#### `domain-system-fileName-base`

- Command(s): `system.fileName()`
- Preview data:
```csv

```

#### `domain-system-filePath-base`

- Command(s): `system.filePath()`
- Preview data:
```csv

```

#### `domain-system-fileType-base`

- Command(s): `system.fileType()`
- Preview data:
```csv

```

#### `domain-system-mimeType-base`

- Command(s): `system.mimeType()`
- Preview data:
```csv

```

#### `domain-system-networkInterface-base`

- Command(s): `system.networkInterface()`
- Preview data:
```csv

```

#### `domain-system-semver-base`

- Command(s): `system.semver()`
- Preview data:
```csv

```

#### `domain-vehicle-bicycle-base`

- Command(s): `vehicle.bicycle()`
- Preview data:
```csv

```

#### `domain-vehicle-color-base`

- Command(s): `vehicle.color()`
- Preview data:
```csv

```

#### `domain-vehicle-fuel-base`

- Command(s): `vehicle.fuel()`
- Preview data:
```csv

```

#### `domain-vehicle-manufacturer-base`

- Command(s): `vehicle.manufacturer()`
- Preview data:
```csv

```

#### `domain-vehicle-model-base`

- Command(s): `vehicle.model()`
- Preview data:
```csv

```

#### `domain-vehicle-type-base`

- Command(s): `vehicle.type()`
- Preview data:
```csv

```

#### `domain-vehicle-vehicle-base`

- Command(s): `vehicle.vehicle()`
- Preview data:
```csv

```

#### `domain-vehicle-vin-base`

- Command(s): `vehicle.vin()`
- Preview data:
```csv

```

#### `domain-vehicle-vrm-base`

- Command(s): `vehicle.vrm()`
- Preview data:
```csv

```

#### `domain-word-adjective-base`

- Command(s): `word.adjective()`
- Preview data:
```csv

```

#### `domain-word-adjective-arg-length`

- Command(s): `word.adjective(length=4)`
- Preview data:
```csv

```

#### `domain-word-adjective-arg-max`

- Command(s): `word.adjective(max=3)`
- Preview data:
```csv

```

#### `domain-word-adjective-arg-strategy`

- Command(s): `word.adjective(strategy="word-adjective-strategy")`
- Preview data:
```csv

```

#### `domain-word-adjective-pair-length-max`

- Command(s): `word.adjective(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-adjective-pair-max-strategy`

- Command(s): `word.adjective(max=3, strategy="word-adjective-strategy")`
- Preview data:
```csv

```

#### `domain-word-adverb-base`

- Command(s): `word.adverb()`
- Preview data:
```csv

```

#### `domain-word-adverb-arg-length`

- Command(s): `word.adverb(length=4)`
- Preview data:
```csv

```

#### `domain-word-adverb-arg-max`

- Command(s): `word.adverb(max=3)`
- Preview data:
```csv

```

#### `domain-word-adverb-arg-strategy`

- Command(s): `word.adverb(strategy="word-adverb-strategy")`
- Preview data:
```csv

```

#### `domain-word-adverb-pair-length-max`

- Command(s): `word.adverb(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-adverb-pair-max-strategy`

- Command(s): `word.adverb(max=3, strategy="word-adverb-strategy")`
- Preview data:
```csv

```

#### `domain-word-conjunction-base`

- Command(s): `word.conjunction()`
- Preview data:
```csv

```

#### `domain-word-conjunction-arg-length`

- Command(s): `word.conjunction(length=4)`
- Preview data:
```csv

```

#### `domain-word-conjunction-arg-max`

- Command(s): `word.conjunction(max=3)`
- Preview data:
```csv

```

#### `domain-word-conjunction-arg-strategy`

- Command(s): `word.conjunction(strategy="word-conjunction-strategy")`
- Preview data:
```csv

```

#### `domain-word-conjunction-pair-length-max`

- Command(s): `word.conjunction(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-conjunction-pair-max-strategy`

- Command(s): `word.conjunction(max=3, strategy="word-conjunction-strategy")`
- Preview data:
```csv

```

#### `domain-word-interjection-base`

- Command(s): `word.interjection()`
- Preview data:
```csv

```

#### `domain-word-interjection-arg-length`

- Command(s): `word.interjection(length=4)`
- Preview data:
```csv

```

#### `domain-word-interjection-arg-max`

- Command(s): `word.interjection(max=3)`
- Preview data:
```csv

```

#### `domain-word-interjection-arg-strategy`

- Command(s): `word.interjection(strategy="word-interjection-strategy")`
- Preview data:
```csv

```

#### `domain-word-interjection-pair-length-max`

- Command(s): `word.interjection(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-interjection-pair-max-strategy`

- Command(s): `word.interjection(max=3, strategy="word-interjection-strategy")`
- Preview data:
```csv

```

#### `domain-word-noun-base`

- Command(s): `word.noun()`
- Preview data:
```csv

```

#### `domain-word-noun-arg-length`

- Command(s): `word.noun(length=4)`
- Preview data:
```csv

```

#### `domain-word-noun-arg-max`

- Command(s): `word.noun(max=3)`
- Preview data:
```csv

```

#### `domain-word-noun-arg-strategy`

- Command(s): `word.noun(strategy="word-noun-strategy")`
- Preview data:
```csv

```

#### `domain-word-noun-pair-length-max`

- Command(s): `word.noun(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-noun-pair-max-strategy`

- Command(s): `word.noun(max=3, strategy="word-noun-strategy")`
- Preview data:
```csv

```

#### `domain-word-preposition-base`

- Command(s): `word.preposition()`
- Preview data:
```csv

```

#### `domain-word-preposition-arg-length`

- Command(s): `word.preposition(length=4)`
- Preview data:
```csv

```

#### `domain-word-preposition-arg-max`

- Command(s): `word.preposition(max=3)`
- Preview data:
```csv

```

#### `domain-word-preposition-arg-strategy`

- Command(s): `word.preposition(strategy="word-preposition-strategy")`
- Preview data:
```csv

```

#### `domain-word-preposition-pair-length-max`

- Command(s): `word.preposition(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-preposition-pair-max-strategy`

- Command(s): `word.preposition(max=3, strategy="word-preposition-strategy")`
- Preview data:
```csv

```

#### `domain-word-sample-base`

- Command(s): `word.sample()`
- Preview data:
```csv

```

#### `domain-word-sample-arg-length`

- Command(s): `word.sample(length=4)`
- Preview data:
```csv

```

#### `domain-word-sample-arg-max`

- Command(s): `word.sample(max=3)`
- Preview data:
```csv

```

#### `domain-word-sample-arg-strategy`

- Command(s): `word.sample(strategy="word-sample-strategy")`
- Preview data:
```csv

```

#### `domain-word-sample-pair-length-max`

- Command(s): `word.sample(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-sample-pair-max-strategy`

- Command(s): `word.sample(max=3, strategy="word-sample-strategy")`
- Preview data:
```csv

```

#### `domain-word-verb-base`

- Command(s): `word.verb()`
- Preview data:
```csv

```

#### `domain-word-verb-arg-length`

- Command(s): `word.verb(length=4)`
- Preview data:
```csv

```

#### `domain-word-verb-arg-max`

- Command(s): `word.verb(max=3)`
- Preview data:
```csv

```

#### `domain-word-verb-arg-strategy`

- Command(s): `word.verb(strategy="word-verb-strategy")`
- Preview data:
```csv

```

#### `domain-word-verb-pair-length-max`

- Command(s): `word.verb(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-verb-pair-max-strategy`

- Command(s): `word.verb(max=3, strategy="word-verb-strategy")`
- Preview data:
```csv

```

#### `domain-word-words-base`

- Command(s): `word.words()`
- Preview data:
```csv

```

#### `domain-word-words-arg-count`

- Command(s): `word.words(count=2)`
- Preview data:
```csv

```

#### `domain-word-words-arg-max`

- Command(s): `word.words(max=3)`
- Preview data:
```csv

```

#### `domain-word-words-pair-count-max`

- Command(s): `word.words(count=2, max=3)`
- Preview data:
```csv

```


## Runtime Scenarios

Scenario count: **631**
Generated preview data count: **631**
Review-only scenario count: **0**
Non-executable scenario count: **0**

### By Source Type

| Key | Count |
| --- | ---: |
| `domain` | 582 |
| `enum` | 2 |
| `faker` | 43 |
| `literal` | 2 |
| `regex` | 2 |

### By Origin

| Key | Count |
| --- | ---: |
| `arg` | 217 |
| `base` | 254 |
| `custom` | 3 |
| `empty` | 2 |
| `example` | 31 |
| `pair` | 123 |
| `pairwise` | 1 |

### Commands By Source Type

#### `domain` (242)

- `airline.aircraftType`
- `airline.flightNumber`
- `airline.iataCode`
- `airline.name`
- `airline.recordLocator`
- `airline.seat`
- `airplane.iataTypeCode`
- `airplane.name`
- `airport.iataCode`
- `airport.name`
- `animal.bear`
- `animal.bird`
- `animal.cat`
- `animal.cetacean`
- `animal.cow`
- `animal.crocodilia`
- `animal.dog`
- `animal.fish`
- `animal.horse`
- `animal.insect`
- `animal.lion`
- `animal.petName`
- `animal.rabbit`
- `animal.rodent`
- `animal.snake`
- `animal.type`
- `autoIncrement.sequence`
- `autoIncrement.timestamp`
- `book.author`
- `book.format`
- `book.genre`
- `book.publisher`
- `book.series`
- `book.title`
- `chemicalElement.atomicNumber`
- `chemicalElement.name`
- `chemicalElement.symbol`
- `color.cssSupportedFunction`
- `color.cssSupportedSpace`
- `color.human`
- `color.rgb`
- `color.space`
- `commerce.department`
- `commerce.isbn`
- `commerce.price`
- `commerce.product`
- `commerce.productAdjective`
- `commerce.productDescription`
- `commerce.productMaterial`
- `commerce.productName`
- `commerce.upc`
- `company.buzzAdjective`
- `company.buzzNoun`
- `company.buzzPhrase`
- `company.buzzVerb`
- `company.catchPhrase`
- `company.catchPhraseAdjective`
- `company.catchPhraseDescriptor`
- `company.catchPhraseNoun`
- `company.name`
- `database.collation`
- `database.column`
- `database.engine`
- `database.mongodbObjectId`
- `database.type`
- `datatype.boolean`
- `datatype.enum`
- `date.anytime`
- `date.between`
- `date.birthdate`
- `date.future`
- `date.month`
- `date.past`
- `date.recent`
- `date.soon`
- `date.timeZone`
- `date.weekday`
- `finance.accountName`
- `finance.accountNumber`
- `finance.amount`
- `finance.bic`
- `finance.bitcoinAddress`
- `finance.creditCardCVV`
- `finance.creditCardIssuer`
- `finance.creditCardNumber`
- `finance.currencyCode`
- `finance.currencyName`
- `finance.currencyNumericCode`
- `finance.currencySymbol`
- `finance.ethereumAddress`
- `finance.iban`
- `finance.litecoinAddress`
- `finance.pin`
- `finance.routingNumber`
- `finance.transactionDescription`
- `finance.transactionType`
- `food.adjective`
- `food.description`
- `food.dish`
- `food.ethnicCategory`
- `food.fruit`
- `food.ingredient`
- `food.meat`
- `food.spice`
- `food.vegetable`
- `git.branch`
- `git.commitDate`
- `git.commitEntry`
- `git.commitMessage`
- `git.commitSha`
- `hacker.abbreviation`
- `hacker.adjective`
- `hacker.ingverb`
- `hacker.noun`
- `hacker.phrase`
- `hacker.verb`
- `image.avatar`
- `image.avatarGitHub`
- `image.dataUri`
- `image.personPortrait`
- `image.url`
- `image.urlPicsumPhotos`
- `internet.displayName`
- `internet.domainName`
- `internet.domainSuffix`
- `internet.domainWord`
- `internet.email`
- `internet.emoji`
- `internet.exampleEmail`
- `internet.httpMethod`
- `internet.httpStatusCode`
- `internet.ip`
- `internet.ipv4`
- `internet.ipv6`
- `internet.jwt`
- `internet.jwtAlgorithm`
- `internet.mac`
- `internet.password`
- `internet.port`
- `internet.protocol`
- `internet.url`
- `internet.userAgent`
- `internet.username`
- `literal.value`
- `location.buildingNumber`
- `location.cardinalDirection`
- `location.city`
- `location.continent`
- `location.country`
- `location.countryCode`
- `location.county`
- `location.direction`
- `location.latitude`
- `location.longitude`
- `location.ordinalDirection`
- `location.secondaryAddress`
- `location.state`
- `location.street`
- `location.streetAddress`
- `location.timeZone`
- `location.zipCode`
- `lorem.lines`
- `lorem.paragraph`
- `lorem.paragraphs`
- `lorem.sentence`
- `lorem.sentences`
- `lorem.slug`
- `lorem.text`
- `lorem.word`
- `lorem.words`
- `music.album`
- `music.artist`
- `music.genre`
- `music.songName`
- `number.bigInt`
- `number.binary`
- `number.float`
- `number.hex`
- `number.int`
- `number.octal`
- `number.romanNumeral`
- `person.bio`
- `person.firstName`
- `person.fullName`
- `person.gender`
- `person.jobArea`
- `person.jobDescriptor`
- `person.jobTitle`
- `person.jobType`
- `person.lastName`
- `person.middleName`
- `person.prefix`
- `person.sex`
- `person.sexType`
- `person.suffix`
- `person.zodiacSign`
- `phone.imei`
- `phone.number`
- `string.alpha`
- `string.alphanumeric`
- `string.binary`
- `string.counterString`
- `string.fromCharacters`
- `string.hexadecimal`
- `string.nanoid`
- `string.numeric`
- `string.octal`
- `string.sample`
- `string.symbol`
- `string.ulid`
- `string.uuid`
- `system.commonFileExt`
- `system.commonFileName`
- `system.commonFileType`
- `system.cron`
- `system.directoryPath`
- `system.fileExt`
- `system.fileName`
- `system.filePath`
- `system.fileType`
- `system.mimeType`
- `system.networkInterface`
- `system.semver`
- `vehicle.bicycle`
- `vehicle.color`
- `vehicle.fuel`
- `vehicle.manufacturer`
- `vehicle.model`
- `vehicle.type`
- `vehicle.vehicle`
- `vehicle.vin`
- `vehicle.vrm`
- `word.adjective`
- `word.adverb`
- `word.conjunction`
- `word.interjection`
- `word.noun`
- `word.preposition`
- `word.sample`
- `word.verb`
- `word.words`

#### `enum` (2)

- `enum`
- `enum pairwise`

#### `faker` (12)

- `helpers.arrayElement`
- `helpers.arrayElements`
- `helpers.fake`
- `helpers.fromRegExp`
- `helpers.mustache`
- `helpers.rangeToNumber`
- `helpers.replaceCreditCardSymbols`
- `helpers.replaceSymbols`
- `helpers.shuffle`
- `helpers.slugify`
- `helpers.uniqueArray`
- `helpers.weightedArrayElement`

#### `literal` (2)

- `literal`
- `literal empty`

#### `regex` (2)

- `regex`
- `regex empty`

### Scenario Details

#### `custom-enum-base`

- Command(s): `enum(active,inactive,pending)`
- Preview data:
```csv

```

#### `custom-enum-pairwise`

- Command(s): `Status: enum(active,inactive,pending) | Priority: enum(high,medium,low)`
- Schema Rows: `Status: enum(active,inactive,pending)`, `Priority: enum(high,medium,low)`
- Preview data:
```csv

```

#### `custom-literal-base`

- Command(s): `literal("Pending")`
- Preview data:
```csv

```

#### `custom-literal-empty`

- Command(s): `literal("")`
- Preview data:
```csv

```

#### `custom-regex-base`

- Command(s): `regex("[A-Z]{2}[0-9]{2}")`
- Preview data:
```csv

```

#### `custom-regex-empty`

- Command(s): `regex("")`
- Preview data:
```csv

```

#### `faker-helpers-arrayElement-base`

- Command(s): `helpers.arrayElement(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElement-example-1`

- Command(s): `helpers.arrayElement(["A", "B", "C"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElement-arg-array`

- Command(s): `helpers.arrayElement(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-base`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-example-1`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-arg-array`

- Command(s): `helpers.arrayElements(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-arg-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-arrayElements-pair-array-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-fake-base`

- Command(s): `helpers.fake("{{person.firstName}}")`
- Preview data:
```csv

```

#### `faker-helpers-fake-example-1`

- Command(s): `helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")`
- Preview data:
```csv

```

#### `faker-helpers-fake-arg-pattern`

- Command(s): `helpers.fake("[A-Z]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-fromRegExp-base`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-fromRegExp-example-1`

- Command(s): `helpers.fromRegExp("[A-Z]{2}[0-9]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-fromRegExp-arg-pattern`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- Preview data:
```csv

```

#### `faker-helpers-mustache-base`

- Command(s): `helpers.mustache("{{name}}", { name: "Ada" })`
- Preview data:
```csv

```

#### `faker-helpers-mustache-example-1`

- Command(s): `helpers.mustache("Hello {{name}}", { name: "Ada" })`
- Preview data:
```csv

```

#### `faker-helpers-mustache-arg-text`

- Command(s): `helpers.mustache("{{name}}")`
- Preview data:
```csv

```

#### `faker-helpers-mustache-arg-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv

```

#### `faker-helpers-mustache-pair-text-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv

```

#### `faker-helpers-rangeToNumber-base`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- Preview data:
```csv

```

#### `faker-helpers-rangeToNumber-example-1`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- Preview data:
```csv

```

#### `faker-helpers-rangeToNumber-arg-numberOrRange`

- Command(s): `helpers.rangeToNumber(2)`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-base`

- Command(s): `helpers.replaceCreditCardSymbols()`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-example-1`

- Command(s): `helpers.replaceCreditCardSymbols("1234-[4-9]-##!!-L")`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-arg-string`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string")`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-arg-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv

```

#### `faker-helpers-replaceCreditCardSymbols-pair-string-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv

```

#### `faker-helpers-replaceSymbols-base`

- Command(s): `helpers.replaceSymbols()`
- Preview data:
```csv

```

#### `faker-helpers-replaceSymbols-example-1`

- Command(s): `helpers.replaceSymbols("##??-##")`
- Preview data:
```csv

```

#### `faker-helpers-replaceSymbols-arg-string`

- Command(s): `helpers.replaceSymbols("helpers-replaceSymbols-string")`
- Preview data:
```csv

```

#### `faker-helpers-shuffle-base`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- Preview data:
```csv

```

#### `faker-helpers-shuffle-example-1`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- Preview data:
```csv

```

#### `faker-helpers-shuffle-arg-array`

- Command(s): `helpers.shuffle(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-slugify-base`

- Command(s): `helpers.slugify()`
- Preview data:
```csv

```

#### `faker-helpers-slugify-example-1`

- Command(s): `helpers.slugify("Hello World 2026")`
- Preview data:
```csv

```

#### `faker-helpers-slugify-arg-string`

- Command(s): `helpers.slugify("helpers-slugify-string")`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-base`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-example-1`

- Command(s): `helpers.uniqueArray(["red", "green", "blue"], 2)`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-arg-source`

- Command(s): `helpers.uniqueArray(["A", "B"])`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-arg-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-pair-source-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv

```

#### `faker-helpers-weightedArrayElement-base`

- Command(s): `helpers.weightedArrayElement([{ "weight": 1, "value": "A" }, { "weight": 2, "value": "B" }])`
- Preview data:
```csv

```

#### `faker-helpers-weightedArrayElement-example-1`

- Command(s): `helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])`
- Preview data:
```csv

```

#### `domain-airline-aircraftType-base`

- Command(s): `airline.aircraftType()`
- Preview data:
```csv

```

#### `domain-airline-flightNumber-base`

- Command(s): `airline.flightNumber()`
- Preview data:
```csv

```

#### `domain-airline-iataCode-base`

- Command(s): `airline.iataCode()`
- Preview data:
```csv

```

#### `domain-airline-name-base`

- Command(s): `airline.name()`
- Preview data:
```csv

```

#### `domain-airline-recordLocator-base`

- Command(s): `airline.recordLocator()`
- Preview data:
```csv

```

#### `domain-airline-seat-base`

- Command(s): `airline.seat()`
- Preview data:
```csv

```

#### `domain-airline-seat-example-1`

- Command(s): `airline.seat()`
- Preview data:
```csv

```

#### `domain-airline-seat-example-2`

- Command(s): `airline.seat(aircraftType="widebody")`
- Preview data:
```csv

```

#### `domain-airline-seat-arg-aircraftType`

- Command(s): `airline.seat(aircraftType="widebody")`
- Preview data:
```csv

```

#### `domain-airplane-iataTypeCode-base`

- Command(s): `airplane.iataTypeCode()`
- Preview data:
```csv

```

#### `domain-airplane-name-base`

- Command(s): `airplane.name()`
- Preview data:
```csv

```

#### `domain-airport-iataCode-base`

- Command(s): `airport.iataCode()`
- Preview data:
```csv

```

#### `domain-airport-name-base`

- Command(s): `airport.name()`
- Preview data:
```csv

```

#### `domain-animal-bear-base`

- Command(s): `animal.bear()`
- Preview data:
```csv

```

#### `domain-animal-bird-base`

- Command(s): `animal.bird()`
- Preview data:
```csv

```

#### `domain-animal-cat-base`

- Command(s): `animal.cat()`
- Preview data:
```csv

```

#### `domain-animal-cetacean-base`

- Command(s): `animal.cetacean()`
- Preview data:
```csv

```

#### `domain-animal-cow-base`

- Command(s): `animal.cow()`
- Preview data:
```csv

```

#### `domain-animal-crocodilia-base`

- Command(s): `animal.crocodilia()`
- Preview data:
```csv

```

#### `domain-animal-dog-base`

- Command(s): `animal.dog()`
- Preview data:
```csv

```

#### `domain-animal-fish-base`

- Command(s): `animal.fish()`
- Preview data:
```csv

```

#### `domain-animal-horse-base`

- Command(s): `animal.horse()`
- Preview data:
```csv

```

#### `domain-animal-insect-base`

- Command(s): `animal.insect()`
- Preview data:
```csv

```

#### `domain-animal-lion-base`

- Command(s): `animal.lion()`
- Preview data:
```csv

```

#### `domain-animal-petName-base`

- Command(s): `animal.petName()`
- Preview data:
```csv

```

#### `domain-animal-rabbit-base`

- Command(s): `animal.rabbit()`
- Preview data:
```csv

```

#### `domain-animal-rodent-base`

- Command(s): `animal.rodent()`
- Preview data:
```csv

```

#### `domain-animal-snake-base`

- Command(s): `animal.snake()`
- Preview data:
```csv

```

#### `domain-animal-type-base`

- Command(s): `animal.type()`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-base`

- Command(s): `autoIncrement.sequence(1, 5, "filename", ".txt", 3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-example-1`

- Command(s): `autoIncrement.sequence()`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-example-2`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-example-3`

- Command(s): `autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-start`

- Command(s): `autoIncrement.sequence(start=10)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-step`

- Command(s): `autoIncrement.sequence(step=5)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-prefix`

- Command(s): `autoIncrement.sequence(prefix="filename")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-suffix`

- Command(s): `autoIncrement.sequence(suffix=".txt")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-arg-zeropadding`

- Command(s): `autoIncrement.sequence(zeropadding=3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-start-step`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-step-prefix`

- Command(s): `autoIncrement.sequence(step=5, prefix="filename")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-prefix-suffix`

- Command(s): `autoIncrement.sequence(prefix="filename", suffix=".txt")`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-pair-suffix-zeropadding`

- Command(s): `autoIncrement.sequence(suffix=".txt", zeropadding=3)`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-base`

- Command(s): `autoIncrement.timestamp()`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-example-1`

- Command(s): `autoIncrement.timestamp()`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-example-2`

- Command(s): `autoIncrement.timestamp(start="20/03/1969", step=1, type="days")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-example-3`

- Command(s): `autoIncrement.timestamp(start="2026-06-12 12:39:23", step=15, type="minutes", outputFormat="yyyy-MM-dd HH:mm:ss")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-start`

- Command(s): `autoIncrement.timestamp(start="2026-06-12T12:39:23Z")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-step`

- Command(s): `autoIncrement.timestamp(step=1)`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-type`

- Command(s): `autoIncrement.timestamp(type="seconds")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-outputFormat`

- Command(s): `autoIncrement.timestamp(outputFormat="iso8601")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-arg-inputFormat`

- Command(s): `autoIncrement.timestamp(inputFormat="dd/MM/yyyy")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-start-step`

- Command(s): `autoIncrement.timestamp(start="2026-06-12T12:39:23Z", step=1)`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-step-type`

- Command(s): `autoIncrement.timestamp(step=1, type="seconds")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-type-outputFormat`

- Command(s): `autoIncrement.timestamp(type="seconds", outputFormat="iso8601")`
- Preview data:
```csv

```

#### `domain-autoIncrement-timestamp-pair-outputFormat-inputFormat`

- Command(s): `autoIncrement.timestamp(outputFormat="iso8601", inputFormat="dd/MM/yyyy")`
- Preview data:
```csv

```

#### `domain-book-author-base`

- Command(s): `book.author()`
- Preview data:
```csv

```

#### `domain-book-format-base`

- Command(s): `book.format()`
- Preview data:
```csv

```

#### `domain-book-genre-base`

- Command(s): `book.genre()`
- Preview data:
```csv

```

#### `domain-book-publisher-base`

- Command(s): `book.publisher()`
- Preview data:
```csv

```

#### `domain-book-series-base`

- Command(s): `book.series()`
- Preview data:
```csv

```

#### `domain-book-title-base`

- Command(s): `book.title()`
- Preview data:
```csv

```

#### `domain-chemicalElement-atomicNumber-base`

- Command(s): `chemicalElement.atomicNumber()`
- Preview data:
```csv

```

#### `domain-chemicalElement-name-base`

- Command(s): `chemicalElement.name()`
- Preview data:
```csv

```

#### `domain-chemicalElement-symbol-base`

- Command(s): `chemicalElement.symbol()`
- Preview data:
```csv

```

#### `domain-color-cssSupportedFunction-base`

- Command(s): `color.cssSupportedFunction()`
- Preview data:
```csv

```

#### `domain-color-cssSupportedSpace-base`

- Command(s): `color.cssSupportedSpace()`
- Preview data:
```csv

```

#### `domain-color-human-base`

- Command(s): `color.human()`
- Preview data:
```csv

```

#### `domain-color-rgb-base`

- Command(s): `color.rgb()`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-casing`

- Command(s): `color.rgb(casing="upper")`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-format`

- Command(s): `color.rgb(format="hex")`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-includeAlpha`

- Command(s): `color.rgb(includeAlpha=true)`
- Preview data:
```csv

```

#### `domain-color-rgb-arg-prefix`

- Command(s): `color.rgb(prefix="#")`
- Preview data:
```csv

```

#### `domain-color-rgb-pair-casing-format`

- Command(s): `color.rgb(casing="upper", format="hex")`
- Preview data:
```csv

```

#### `domain-color-rgb-pair-format-includeAlpha`

- Command(s): `color.rgb(format="hex", includeAlpha=true)`
- Preview data:
```csv

```

#### `domain-color-rgb-pair-includeAlpha-prefix`

- Command(s): `color.rgb(includeAlpha=true, prefix="#")`
- Preview data:
```csv

```

#### `domain-color-space-base`

- Command(s): `color.space()`
- Preview data:
```csv

```

#### `domain-commerce-department-base`

- Command(s): `commerce.department()`
- Preview data:
```csv

```

#### `domain-commerce-isbn-base`

- Command(s): `commerce.isbn()`
- Preview data:
```csv

```

#### `domain-commerce-isbn-arg-separator`

- Command(s): `commerce.isbn(separator="-")`
- Preview data:
```csv

```

#### `domain-commerce-isbn-arg-variant`

- Command(s): `commerce.isbn(variant="13")`
- Preview data:
```csv

```

#### `domain-commerce-isbn-pair-separator-variant`

- Command(s): `commerce.isbn(separator="-", variant="13")`
- Preview data:
```csv

```

#### `domain-commerce-price-base`

- Command(s): `commerce.price()`
- Preview data:
```csv

```

#### `domain-commerce-price-example-1`

- Command(s): `commerce.price(dec=2, max=10, min=1, symbol="$")`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-dec`

- Command(s): `commerce.price(dec=2)`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-max`

- Command(s): `commerce.price(max=100)`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-min`

- Command(s): `commerce.price(min=1)`
- Preview data:
```csv

```

#### `domain-commerce-price-arg-symbol`

- Command(s): `commerce.price(symbol="$")`
- Preview data:
```csv

```

#### `domain-commerce-price-pair-dec-max`

- Command(s): `commerce.price(dec=2, max=100)`
- Preview data:
```csv

```

#### `domain-commerce-price-pair-max-min`

- Command(s): `commerce.price(max=100, min=1)`
- Preview data:
```csv

```

#### `domain-commerce-price-pair-min-symbol`

- Command(s): `commerce.price(min=1, symbol="$")`
- Preview data:
```csv

```

#### `domain-commerce-product-base`

- Command(s): `commerce.product()`
- Preview data:
```csv

```

#### `domain-commerce-productAdjective-base`

- Command(s): `commerce.productAdjective()`
- Preview data:
```csv

```

#### `domain-commerce-productDescription-base`

- Command(s): `commerce.productDescription()`
- Preview data:
```csv

```

#### `domain-commerce-productMaterial-base`

- Command(s): `commerce.productMaterial()`
- Preview data:
```csv

```

#### `domain-commerce-productName-base`

- Command(s): `commerce.productName()`
- Preview data:
```csv

```

#### `domain-commerce-upc-base`

- Command(s): `commerce.upc()`
- Preview data:
```csv

```

#### `domain-commerce-upc-arg-prefix`

- Command(s): `commerce.upc(prefix="01234")`
- Preview data:
```csv

```

#### `domain-company-buzzAdjective-base`

- Command(s): `company.buzzAdjective()`
- Preview data:
```csv

```

#### `domain-company-buzzNoun-base`

- Command(s): `company.buzzNoun()`
- Preview data:
```csv

```

#### `domain-company-buzzPhrase-base`

- Command(s): `company.buzzPhrase()`
- Preview data:
```csv

```

#### `domain-company-buzzVerb-base`

- Command(s): `company.buzzVerb()`
- Preview data:
```csv

```

#### `domain-company-catchPhrase-base`

- Command(s): `company.catchPhrase()`
- Preview data:
```csv

```

#### `domain-company-catchPhraseAdjective-base`

- Command(s): `company.catchPhraseAdjective()`
- Preview data:
```csv

```

#### `domain-company-catchPhraseDescriptor-base`

- Command(s): `company.catchPhraseDescriptor()`
- Preview data:
```csv

```

#### `domain-company-catchPhraseNoun-base`

- Command(s): `company.catchPhraseNoun()`
- Preview data:
```csv

```

#### `domain-company-name-base`

- Command(s): `company.name()`
- Preview data:
```csv

```

#### `domain-database-collation-base`

- Command(s): `database.collation()`
- Preview data:
```csv

```

#### `domain-database-column-base`

- Command(s): `database.column()`
- Preview data:
```csv

```

#### `domain-database-engine-base`

- Command(s): `database.engine()`
- Preview data:
```csv

```

#### `domain-database-mongodbObjectId-base`

- Command(s): `database.mongodbObjectId()`
- Preview data:
```csv

```

#### `domain-database-type-base`

- Command(s): `database.type()`
- Preview data:
```csv

```

#### `domain-datatype-boolean-base`

- Command(s): `datatype.boolean()`
- Preview data:
```csv

```

#### `domain-datatype-boolean-arg-probability`

- Command(s): `datatype.boolean(probability=2)`
- Preview data:
```csv

```

#### `domain-datatype-enum-base`

- Command(s): `datatype.enum("active", "inactive", "pending")`
- Preview data:
```csv

```

#### `domain-datatype-enum-arg-values`

- Command(s): `datatype.enum(values="datatype-enum-values")`
- Preview data:
```csv

```

#### `domain-date-anytime-base`

- Command(s): `date.anytime()`
- Preview data:
```csv

```

#### `domain-date-anytime-arg-refDate`

- Command(s): `date.anytime(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-between-base`

- Command(s): `date.between(1577836800000, 1609372800000)`
- Preview data:
```csv

```

#### `domain-date-between-arg-from`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv

```

#### `domain-date-between-arg-to`

- Command(s): `date.between(to=1609372800000, from=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-between-pair-from-to`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv

```

#### `domain-date-birthdate-base`

- Command(s): `date.birthdate()`
- Preview data:
```csv

```

#### `domain-date-birthdate-example-1`

- Command(s): `date.birthdate(refDate=20000, max=69, min=16, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-refDate`

- Command(s): `date.birthdate(refDate=1577836800000, min=18, max=65, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-max`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-min`

- Command(s): `date.birthdate(min=18, max=65, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-arg-mode`

- Command(s): `date.birthdate(mode="age", min=18, max=65)`
- Preview data:
```csv

```

#### `domain-date-birthdate-pair-refDate-max`

- Command(s): `date.birthdate(refDate=1577836800000, max=65, min=18, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-pair-max-min`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv

```

#### `domain-date-birthdate-pair-min-mode`

- Command(s): `date.birthdate(min=18, mode="age", max=65)`
- Preview data:
```csv

```

#### `domain-date-future-base`

- Command(s): `date.future()`
- Preview data:
```csv

```

#### `domain-date-future-arg-refDate`

- Command(s): `date.future(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-future-arg-years`

- Command(s): `date.future(years=2)`
- Preview data:
```csv

```

#### `domain-date-future-pair-refDate-years`

- Command(s): `date.future(refDate=1577836800000, years=2)`
- Preview data:
```csv

```

#### `domain-date-month-base`

- Command(s): `date.month()`
- Preview data:
```csv

```

#### `domain-date-month-arg-abbreviated`

- Command(s): `date.month(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-date-month-arg-context`

- Command(s): `date.month(context=true)`
- Preview data:
```csv

```

#### `domain-date-month-pair-abbreviated-context`

- Command(s): `date.month(abbreviated=true, context=true)`
- Preview data:
```csv

```

#### `domain-date-past-base`

- Command(s): `date.past()`
- Preview data:
```csv

```

#### `domain-date-past-arg-refDate`

- Command(s): `date.past(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-past-arg-years`

- Command(s): `date.past(years=2)`
- Preview data:
```csv

```

#### `domain-date-past-pair-refDate-years`

- Command(s): `date.past(refDate=1577836800000, years=2)`
- Preview data:
```csv

```

#### `domain-date-recent-base`

- Command(s): `date.recent()`
- Preview data:
```csv

```

#### `domain-date-recent-arg-days`

- Command(s): `date.recent(days=7)`
- Preview data:
```csv

```

#### `domain-date-recent-arg-refDate`

- Command(s): `date.recent(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-recent-pair-days-refDate`

- Command(s): `date.recent(days=7, refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-soon-base`

- Command(s): `date.soon()`
- Preview data:
```csv

```

#### `domain-date-soon-arg-days`

- Command(s): `date.soon(days=7)`
- Preview data:
```csv

```

#### `domain-date-soon-arg-refDate`

- Command(s): `date.soon(refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-soon-pair-days-refDate`

- Command(s): `date.soon(days=7, refDate=1577836800000)`
- Preview data:
```csv

```

#### `domain-date-timeZone-base`

- Command(s): `date.timeZone()`
- Preview data:
```csv

```

#### `domain-date-weekday-base`

- Command(s): `date.weekday()`
- Preview data:
```csv

```

#### `domain-date-weekday-arg-abbreviated`

- Command(s): `date.weekday(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-date-weekday-arg-context`

- Command(s): `date.weekday(context=true)`
- Preview data:
```csv

```

#### `domain-date-weekday-pair-abbreviated-context`

- Command(s): `date.weekday(abbreviated=true, context=true)`
- Preview data:
```csv

```

#### `domain-finance-accountName-base`

- Command(s): `finance.accountName()`
- Preview data:
```csv

```

#### `domain-finance-accountNumber-base`

- Command(s): `finance.accountNumber()`
- Preview data:
```csv

```

#### `domain-finance-accountNumber-arg-length`

- Command(s): `finance.accountNumber(length=4)`
- Preview data:
```csv

```

#### `domain-finance-amount-base`

- Command(s): `finance.amount()`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-autoFormat`

- Command(s): `finance.amount(autoFormat=true)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-dec`

- Command(s): `finance.amount(dec=2)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-max`

- Command(s): `finance.amount(max=100)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-min`

- Command(s): `finance.amount(min=1)`
- Preview data:
```csv

```

#### `domain-finance-amount-arg-symbol`

- Command(s): `finance.amount(symbol="$")`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-autoFormat-dec`

- Command(s): `finance.amount(autoFormat=true, dec=2)`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-dec-max`

- Command(s): `finance.amount(dec=2, max=100)`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-max-min`

- Command(s): `finance.amount(max=100, min=1)`
- Preview data:
```csv

```

#### `domain-finance-amount-pair-min-symbol`

- Command(s): `finance.amount(min=1, symbol="$")`
- Preview data:
```csv

```

#### `domain-finance-bic-base`

- Command(s): `finance.bic()`
- Preview data:
```csv

```

#### `domain-finance-bic-arg-includeBranchCode`

- Command(s): `finance.bic(includeBranchCode=true)`
- Preview data:
```csv

```

#### `domain-finance-bitcoinAddress-base`

- Command(s): `finance.bitcoinAddress()`
- Preview data:
```csv

```

#### `domain-finance-creditCardCVV-base`

- Command(s): `finance.creditCardCVV()`
- Preview data:
```csv

```

#### `domain-finance-creditCardIssuer-base`

- Command(s): `finance.creditCardIssuer()`
- Preview data:
```csv

```

#### `domain-finance-creditCardNumber-base`

- Command(s): `finance.creditCardNumber()`
- Preview data:
```csv

```

#### `domain-finance-creditCardNumber-arg-issuer`

- Command(s): `finance.creditCardNumber(issuer="finance-creditCardNumber-issuer")`
- Preview data:
```csv

```

#### `domain-finance-currencyCode-base`

- Command(s): `finance.currencyCode()`
- Preview data:
```csv

```

#### `domain-finance-currencyName-base`

- Command(s): `finance.currencyName()`
- Preview data:
```csv

```

#### `domain-finance-currencyNumericCode-base`

- Command(s): `finance.currencyNumericCode()`
- Preview data:
```csv

```

#### `domain-finance-currencySymbol-base`

- Command(s): `finance.currencySymbol()`
- Preview data:
```csv

```

#### `domain-finance-ethereumAddress-base`

- Command(s): `finance.ethereumAddress()`
- Preview data:
```csv

```

#### `domain-finance-iban-base`

- Command(s): `finance.iban()`
- Preview data:
```csv

```

#### `domain-finance-iban-arg-countryCode`

- Command(s): `finance.iban(countryCode="GB")`
- Preview data:
```csv

```

#### `domain-finance-iban-arg-formatted`

- Command(s): `finance.iban(formatted=true)`
- Preview data:
```csv

```

#### `domain-finance-iban-pair-countryCode-formatted`

- Command(s): `finance.iban(countryCode="GB", formatted=true)`
- Preview data:
```csv

```

#### `domain-finance-litecoinAddress-base`

- Command(s): `finance.litecoinAddress()`
- Preview data:
```csv

```

#### `domain-finance-pin-base`

- Command(s): `finance.pin()`
- Preview data:
```csv

```

#### `domain-finance-pin-arg-length`

- Command(s): `finance.pin(length=4)`
- Preview data:
```csv

```

#### `domain-finance-routingNumber-base`

- Command(s): `finance.routingNumber()`
- Preview data:
```csv

```

#### `domain-finance-transactionDescription-base`

- Command(s): `finance.transactionDescription()`
- Preview data:
```csv

```

#### `domain-finance-transactionType-base`

- Command(s): `finance.transactionType()`
- Preview data:
```csv

```

#### `domain-food-adjective-base`

- Command(s): `food.adjective()`
- Preview data:
```csv

```

#### `domain-food-description-base`

- Command(s): `food.description()`
- Preview data:
```csv

```

#### `domain-food-dish-base`

- Command(s): `food.dish()`
- Preview data:
```csv

```

#### `domain-food-ethnicCategory-base`

- Command(s): `food.ethnicCategory()`
- Preview data:
```csv

```

#### `domain-food-fruit-base`

- Command(s): `food.fruit()`
- Preview data:
```csv

```

#### `domain-food-ingredient-base`

- Command(s): `food.ingredient()`
- Preview data:
```csv

```

#### `domain-food-meat-base`

- Command(s): `food.meat()`
- Preview data:
```csv

```

#### `domain-food-spice-base`

- Command(s): `food.spice()`
- Preview data:
```csv

```

#### `domain-food-vegetable-base`

- Command(s): `food.vegetable()`
- Preview data:
```csv

```

#### `domain-git-branch-base`

- Command(s): `git.branch()`
- Preview data:
```csv

```

#### `domain-git-commitDate-base`

- Command(s): `git.commitDate()`
- Preview data:
```csv

```

#### `domain-git-commitEntry-base`

- Command(s): `git.commitEntry()`
- Preview data:
```csv

```

#### `domain-git-commitMessage-base`

- Command(s): `git.commitMessage()`
- Preview data:
```csv

```

#### `domain-git-commitSha-base`

- Command(s): `git.commitSha()`
- Preview data:
```csv

```

#### `domain-hacker-abbreviation-base`

- Command(s): `hacker.abbreviation()`
- Preview data:
```csv

```

#### `domain-hacker-adjective-base`

- Command(s): `hacker.adjective()`
- Preview data:
```csv

```

#### `domain-hacker-ingverb-base`

- Command(s): `hacker.ingverb()`
- Preview data:
```csv

```

#### `domain-hacker-noun-base`

- Command(s): `hacker.noun()`
- Preview data:
```csv

```

#### `domain-hacker-phrase-base`

- Command(s): `hacker.phrase()`
- Preview data:
```csv

```

#### `domain-hacker-verb-base`

- Command(s): `hacker.verb()`
- Preview data:
```csv

```

#### `domain-image-avatar-base`

- Command(s): `image.avatar()`
- Preview data:
```csv

```

#### `domain-image-avatarGitHub-base`

- Command(s): `image.avatarGitHub()`
- Preview data:
```csv

```

#### `domain-image-dataUri-base`

- Command(s): `image.dataUri()`
- Preview data:
```csv

```

#### `domain-image-personPortrait-base`

- Command(s): `image.personPortrait()`
- Preview data:
```csv

```

#### `domain-image-url-base`

- Command(s): `image.url()`
- Preview data:
```csv

```

#### `domain-image-url-arg-height`

- Command(s): `image.url(height=2)`
- Preview data:
```csv

```

#### `domain-image-url-arg-width`

- Command(s): `image.url(width=3)`
- Preview data:
```csv

```

#### `domain-image-url-pair-height-width`

- Command(s): `image.url(height=2, width=3)`
- Preview data:
```csv

```

- Preview data:
```csv

```

#### `domain-image-urlPicsumPhotos-base`

- Command(s): `image.urlPicsumPhotos()`
- Preview data:
```csv

```

#### `domain-internet-displayName-base`

- Command(s): `internet.displayName()`
- Preview data:
```csv

```

#### `domain-internet-domainName-base`

- Command(s): `internet.domainName()`
- Preview data:
```csv

```

#### `domain-internet-domainSuffix-base`

- Command(s): `internet.domainSuffix()`
- Preview data:
```csv

```

#### `domain-internet-domainWord-base`

- Command(s): `internet.domainWord()`
- Preview data:
```csv

```

#### `domain-internet-email-base`

- Command(s): `internet.email()`
- Preview data:
```csv

```

#### `domain-internet-email-arg-allowSpecialCharacters`

- Command(s): `internet.email(allowSpecialCharacters=true)`
- Preview data:
```csv

```

#### `domain-internet-email-arg-firstName`

- Command(s): `internet.email(firstName="Ada")`
- Preview data:
```csv

```

#### `domain-internet-email-arg-lastName`

- Command(s): `internet.email(lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-internet-email-arg-provider`

- Command(s): `internet.email(provider="example.com")`
- Preview data:
```csv

```

#### `domain-internet-email-pair-allowSpecialCharacters-firstName`

- Command(s): `internet.email(allowSpecialCharacters=true, firstName="Ada")`
- Preview data:
```csv

```

#### `domain-internet-email-pair-firstName-lastName`

- Command(s): `internet.email(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-internet-email-pair-lastName-provider`

- Command(s): `internet.email(lastName="Lovelace", provider="example.com")`
- Preview data:
```csv

```

#### `domain-internet-emoji-base`

- Command(s): `internet.emoji()`
- Preview data:
```csv

```

#### `domain-internet-emoji-arg-types`

- Command(s): `internet.emoji(types=["food"])`
- Preview data:
```csv

```

#### `domain-internet-exampleEmail-base`

- Command(s): `internet.exampleEmail()`
- Preview data:
```csv

```

#### `domain-internet-httpMethod-base`

- Command(s): `internet.httpMethod()`
- Preview data:
```csv

```

#### `domain-internet-httpStatusCode-base`

- Command(s): `internet.httpStatusCode()`
- Preview data:
```csv

```

#### `domain-internet-ip-base`

- Command(s): `internet.ip()`
- Preview data:
```csv

```

#### `domain-internet-ipv4-base`

- Command(s): `internet.ipv4()`
- Preview data:
```csv

```

#### `domain-internet-ipv4-arg-cidrBlock`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24")`
- Preview data:
```csv

```

#### `domain-internet-ipv4-arg-network`

- Command(s): `internet.ipv4(network="private-a")`
- Preview data:
```csv

```

#### `domain-internet-ipv4-pair-cidrBlock-network`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24", network="private-a")`
- Preview data:
```csv

```

#### `domain-internet-ipv6-base`

- Command(s): `internet.ipv6()`
- Preview data:
```csv

```

#### `domain-internet-jwt-base`

- Command(s): `internet.jwt()`
- Preview data:
```csv

```

#### `domain-internet-jwt-arg-header`

- Command(s): `internet.jwt(header={})`
- Preview data:
```csv

```

#### `domain-internet-jwt-arg-payload`

- Command(s): `internet.jwt(payload={})`
- Preview data:
```csv

```

#### `domain-internet-jwt-arg-refDate`

- Command(s): `internet.jwt(refDate=4)`
- Preview data:
```csv

```

#### `domain-internet-jwt-pair-header-payload`

- Command(s): `internet.jwt(header={}, payload={})`
- Preview data:
```csv

```

#### `domain-internet-jwt-pair-payload-refDate`

- Command(s): `internet.jwt(payload={}, refDate=4)`
- Preview data:
```csv

```

#### `domain-internet-jwtAlgorithm-base`

- Command(s): `internet.jwtAlgorithm()`
- Preview data:
```csv

```

#### `domain-internet-mac-base`

- Command(s): `internet.mac()`
- Preview data:
```csv

```

#### `domain-internet-mac-arg-separator`

- Command(s): `internet.mac(separator="-")`
- Preview data:
```csv

```

#### `domain-internet-password-base`

- Command(s): `internet.password()`
- Preview data:
```csv

```

#### `domain-internet-password-example-1`

- Command(s): `internet.password(length=10, memorable=false, pattern="[A-Za-z0-9]", prefix="#")`
- Preview data:
```csv

```

#### `domain-internet-password-arg-length`

- Command(s): `internet.password(length=12)`
- Preview data:
```csv

```

#### `domain-internet-password-arg-memorable`

- Command(s): `internet.password(memorable=true)`
- Preview data:
```csv

```

#### `domain-internet-password-arg-pattern`

- Command(s): `internet.password(pattern="[A-Z]")`
- Preview data:
```csv

```

#### `domain-internet-password-arg-prefix`

- Command(s): `internet.password(prefix="#")`
- Preview data:
```csv

```

#### `domain-internet-password-pair-length-memorable`

- Command(s): `internet.password(length=12, memorable=true)`
- Preview data:
```csv

```

#### `domain-internet-password-pair-memorable-pattern`

- Command(s): `internet.password(memorable=true, pattern="[A-Z]")`
- Preview data:
```csv

```

#### `domain-internet-password-pair-pattern-prefix`

- Command(s): `internet.password(pattern="[A-Z]", prefix="#")`
- Preview data:
```csv

```

#### `domain-internet-port-base`

- Command(s): `internet.port()`
- Preview data:
```csv

```

#### `domain-internet-protocol-base`

- Command(s): `internet.protocol()`
- Preview data:
```csv

```

#### `domain-internet-url-base`

- Command(s): `internet.url()`
- Preview data:
```csv

```

#### `domain-internet-url-arg-appendSlash`

- Command(s): `internet.url(appendSlash=true)`
- Preview data:
```csv

```

#### `domain-internet-url-arg-protocol`

- Command(s): `internet.url(protocol="https")`
- Preview data:
```csv

```

#### `domain-internet-url-pair-appendSlash-protocol`

- Command(s): `internet.url(appendSlash=true, protocol="https")`
- Preview data:
```csv

```

#### `domain-internet-userAgent-base`

- Command(s): `internet.userAgent()`
- Preview data:
```csv

```

#### `domain-internet-username-base`

- Command(s): `internet.username()`
- Preview data:
```csv

```

#### `domain-internet-username-arg-firstName`

- Command(s): `internet.username(firstName="Ada")`
- Preview data:
```csv

```

#### `domain-internet-username-arg-lastName`

- Command(s): `internet.username(lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-internet-username-pair-firstName-lastName`

- Command(s): `internet.username(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv

```

#### `domain-literal-value-base`

- Command(s): `literal.value()`
- Preview data:
```csv

```

#### `domain-literal-value-example-1`

- Command(s): `literal.value("Pending")`
- Preview data:
```csv

```

#### `domain-literal-value-example-2`

- Command(s): `literal.value("")`
- Preview data:
```csv

```

#### `domain-literal-value-arg-value`

- Command(s): `literal.value(value=true)`
- Preview data:
```csv

```

#### `domain-location-buildingNumber-base`

- Command(s): `location.buildingNumber()`
- Preview data:
```csv

```

#### `domain-location-cardinalDirection-base`

- Command(s): `location.cardinalDirection()`
- Preview data:
```csv

```

#### `domain-location-city-base`

- Command(s): `location.city()`
- Preview data:
```csv

```

#### `domain-location-continent-base`

- Command(s): `location.continent()`
- Preview data:
```csv

```

#### `domain-location-country-base`

- Command(s): `location.country()`
- Preview data:
```csv

```

#### `domain-location-countryCode-base`

- Command(s): `location.countryCode()`
- Preview data:
```csv

```

#### `domain-location-county-base`

- Command(s): `location.county()`
- Preview data:
```csv

```

#### `domain-location-direction-base`

- Command(s): `location.direction()`
- Preview data:
```csv

```

#### `domain-location-direction-arg-abbreviated`

- Command(s): `location.direction(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-location-latitude-base`

- Command(s): `location.latitude()`
- Preview data:
```csv

```

#### `domain-location-latitude-arg-min`

- Command(s): `location.latitude(min=1)`
- Preview data:
```csv

```

#### `domain-location-latitude-arg-max`

- Command(s): `location.latitude(max=3)`
- Preview data:
```csv

```

#### `domain-location-latitude-arg-precision`

- Command(s): `location.latitude(precision=4)`
- Preview data:
```csv

```

#### `domain-location-latitude-pair-min-max`

- Command(s): `location.latitude(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-location-latitude-pair-max-precision`

- Command(s): `location.latitude(max=3, precision=4)`
- Preview data:
```csv

```

#### `domain-location-longitude-base`

- Command(s): `location.longitude()`
- Preview data:
```csv

```

#### `domain-location-longitude-arg-min`

- Command(s): `location.longitude(min=1)`
- Preview data:
```csv

```

#### `domain-location-longitude-arg-max`

- Command(s): `location.longitude(max=3)`
- Preview data:
```csv

```

#### `domain-location-longitude-arg-precision`

- Command(s): `location.longitude(precision=4)`
- Preview data:
```csv

```

#### `domain-location-longitude-pair-min-max`

- Command(s): `location.longitude(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-location-longitude-pair-max-precision`

- Command(s): `location.longitude(max=3, precision=4)`
- Preview data:
```csv

```

#### `domain-location-ordinalDirection-base`

- Command(s): `location.ordinalDirection()`
- Preview data:
```csv

```

#### `domain-location-secondaryAddress-base`

- Command(s): `location.secondaryAddress()`
- Preview data:
```csv

```

#### `domain-location-state-base`

- Command(s): `location.state()`
- Preview data:
```csv

```

#### `domain-location-state-arg-abbreviated`

- Command(s): `location.state(abbreviated=true)`
- Preview data:
```csv

```

#### `domain-location-street-base`

- Command(s): `location.street()`
- Preview data:
```csv

```

#### `domain-location-streetAddress-base`

- Command(s): `location.streetAddress()`
- Preview data:
```csv

```

#### `domain-location-streetAddress-arg-useFullAddress`

- Command(s): `location.streetAddress(useFullAddress=true)`
- Preview data:
```csv

```

#### `domain-location-timeZone-base`

- Command(s): `location.timeZone()`
- Preview data:
```csv

```

#### `domain-location-zipCode-base`

- Command(s): `location.zipCode()`
- Preview data:
```csv

```

#### `domain-lorem-lines-base`

- Command(s): `lorem.lines()`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-min`

- Command(s): `lorem.lines(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-max`

- Command(s): `lorem.lines(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-lineCount`

- Command(s): `lorem.lines(lineCount=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-lineCountMax`

- Command(s): `lorem.lines(lineCountMax=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-arg-lineCountMin`

- Command(s): `lorem.lines(lineCountMin=1)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-min-max`

- Command(s): `lorem.lines(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-max-lineCount`

- Command(s): `lorem.lines(max=3, lineCount=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-lineCount-lineCountMax`

- Command(s): `lorem.lines(lineCount=2, lineCountMax=2)`
- Preview data:
```csv

```

#### `domain-lorem-lines-pair-lineCountMax-lineCountMin`

- Command(s): `lorem.lines(lineCountMax=2, lineCountMin=1)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-base`

- Command(s): `lorem.paragraph()`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-min`

- Command(s): `lorem.paragraph(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-max`

- Command(s): `lorem.paragraph(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-sentenceCount`

- Command(s): `lorem.paragraph(sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-arg-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-min-max`

- Command(s): `lorem.paragraph(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-max-sentenceCount`

- Command(s): `lorem.paragraph(max=3, sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-sentenceCount-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCount=4, sentenceCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-paragraph-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMax=5, sentenceCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-base`

- Command(s): `lorem.paragraphs()`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-min`

- Command(s): `lorem.paragraphs(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-max`

- Command(s): `lorem.paragraphs(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-paragraphCount`

- Command(s): `lorem.paragraphs(paragraphCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-separator`

- Command(s): `lorem.paragraphs(separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-paragraphCountMax`

- Command(s): `lorem.paragraphs(paragraphCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-arg-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-min-max`

- Command(s): `lorem.paragraphs(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-max-paragraphCount`

- Command(s): `lorem.paragraphs(max=3, paragraphCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-paragraphCount-separator`

- Command(s): `lorem.paragraphs(paragraphCount=4, separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-separator-paragraphCountMax`

- Command(s): `lorem.paragraphs(separator="-", paragraphCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-paragraphs-pair-paragraphCountMax-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMax=6, paragraphCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-base`

- Command(s): `lorem.sentence()`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-min`

- Command(s): `lorem.sentence(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-max`

- Command(s): `lorem.sentence(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-wordCount`

- Command(s): `lorem.sentence(wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-wordCountMax`

- Command(s): `lorem.sentence(wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-arg-wordCountMin`

- Command(s): `lorem.sentence(wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-min-max`

- Command(s): `lorem.sentence(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-max-wordCount`

- Command(s): `lorem.sentence(max=3, wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-wordCount-wordCountMax`

- Command(s): `lorem.sentence(wordCount=4, wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-sentence-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.sentence(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-base`

- Command(s): `lorem.sentences()`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-min`

- Command(s): `lorem.sentences(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-max`

- Command(s): `lorem.sentences(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-sentenceCount`

- Command(s): `lorem.sentences(sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-separator`

- Command(s): `lorem.sentences(separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-sentenceCountMax`

- Command(s): `lorem.sentences(sentenceCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-arg-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-min-max`

- Command(s): `lorem.sentences(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-max-sentenceCount`

- Command(s): `lorem.sentences(max=3, sentenceCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-sentenceCount-separator`

- Command(s): `lorem.sentences(sentenceCount=4, separator="-")`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-separator-sentenceCountMax`

- Command(s): `lorem.sentences(separator="-", sentenceCountMax=6)`
- Preview data:
```csv

```

#### `domain-lorem-sentences-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMax=6, sentenceCountMin=7)`
- Preview data:
```csv

```

#### `domain-lorem-slug-base`

- Command(s): `lorem.slug()`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-min`

- Command(s): `lorem.slug(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-max`

- Command(s): `lorem.slug(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-wordCount`

- Command(s): `lorem.slug(wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-wordCountMax`

- Command(s): `lorem.slug(wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-slug-arg-wordCountMin`

- Command(s): `lorem.slug(wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-min-max`

- Command(s): `lorem.slug(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-max-wordCount`

- Command(s): `lorem.slug(max=3, wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-wordCount-wordCountMax`

- Command(s): `lorem.slug(wordCount=4, wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-slug-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.slug(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-text-base`

- Command(s): `lorem.text()`
- Preview data:
```csv

```

#### `domain-lorem-word-base`

- Command(s): `lorem.word()`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-min`

- Command(s): `lorem.word(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-max`

- Command(s): `lorem.word(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-length`

- Command(s): `lorem.word(length=4)`
- Preview data:
```csv

```

#### `domain-lorem-word-arg-strategy`

- Command(s): `lorem.word(strategy="lorem-word-strategy")`
- Preview data:
```csv

```

#### `domain-lorem-word-pair-min-max`

- Command(s): `lorem.word(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-word-pair-max-length`

- Command(s): `lorem.word(max=3, length=4)`
- Preview data:
```csv

```

#### `domain-lorem-word-pair-length-strategy`

- Command(s): `lorem.word(length=4, strategy="lorem-word-strategy")`
- Preview data:
```csv

```

#### `domain-lorem-words-base`

- Command(s): `lorem.words()`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-min`

- Command(s): `lorem.words(min=1)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-max`

- Command(s): `lorem.words(max=3)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-wordCount`

- Command(s): `lorem.words(wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-wordCountMax`

- Command(s): `lorem.words(wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-words-arg-wordCountMin`

- Command(s): `lorem.words(wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-min-max`

- Command(s): `lorem.words(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-max-wordCount`

- Command(s): `lorem.words(max=3, wordCount=4)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-wordCount-wordCountMax`

- Command(s): `lorem.words(wordCount=4, wordCountMax=5)`
- Preview data:
```csv

```

#### `domain-lorem-words-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.words(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv

```

#### `domain-music-album-base`

- Command(s): `music.album()`
- Preview data:
```csv

```

#### `domain-music-artist-base`

- Command(s): `music.artist()`
- Preview data:
```csv

```

#### `domain-music-genre-base`

- Command(s): `music.genre()`
- Preview data:
```csv

```

#### `domain-music-songName-base`

- Command(s): `music.songName()`
- Preview data:
```csv

```

#### `domain-number-bigInt-base`

- Command(s): `number.bigInt()`
- Preview data:
```csv

```

#### `domain-number-bigInt-arg-value`

- Command(s): `number.bigInt(value=true)`
- Preview data:
```csv

```

#### `domain-number-binary-base`

- Command(s): `number.binary()`
- Preview data:
```csv

```

#### `domain-number-binary-arg-max`

- Command(s): `number.binary(max=3)`
- Preview data:
```csv

```

#### `domain-number-binary-arg-min`

- Command(s): `number.binary(min=1)`
- Preview data:
```csv

```

#### `domain-number-binary-pair-max-min`

- Command(s): `number.binary(max=3, min=1)`
- Preview data:
```csv

```

#### `domain-number-float-base`

- Command(s): `number.float()`
- Preview data:
```csv

```

#### `domain-number-float-arg-fractionDigits`

- Command(s): `number.float(fractionDigits=2)`
- Preview data:
```csv

```

#### `domain-number-float-arg-max`

- Command(s): `number.float(max=3)`
- Preview data:
```csv

```

#### `domain-number-float-arg-min`

- Command(s): `number.float(min=1)`
- Preview data:
```csv

```

#### `domain-number-float-arg-multipleOf`

- Command(s): `number.float(multipleOf=0.5)`
- Preview data:
```csv

```

#### `domain-number-float-pair-fractionDigits-max`

- Command(s): `number.float(fractionDigits=2, max=3)`
- Preview data:
```csv

```

#### `domain-number-float-pair-max-min`

- Command(s): `number.float(max=3, min=1)`
- Preview data:
```csv

```

#### `domain-number-float-pair-min-multipleOf`

- Command(s): `number.float(min=1, multipleOf=0.5)`
- Preview data:
```csv

```

#### `domain-number-hex-base`

- Command(s): `number.hex()`
- Preview data:
```csv

```

#### `domain-number-hex-arg-min`

- Command(s): `number.hex(min=1)`
- Preview data:
```csv

```

#### `domain-number-hex-arg-max`

- Command(s): `number.hex(max=3)`
- Preview data:
```csv

```

#### `domain-number-hex-pair-min-max`

- Command(s): `number.hex(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-number-int-base`

- Command(s): `number.int()`
- Preview data:
```csv

```

#### `domain-number-int-arg-min`

- Command(s): `number.int(min=1)`
- Preview data:
```csv

```

#### `domain-number-int-arg-max`

- Command(s): `number.int(max=3)`
- Preview data:
```csv

```

#### `domain-number-int-arg-multipleOf`

- Command(s): `number.int(multipleOf=4)`
- Preview data:
```csv

```

#### `domain-number-int-pair-min-max`

- Command(s): `number.int(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-number-int-pair-max-multipleOf`

- Command(s): `number.int(max=3, multipleOf=4)`
- Preview data:
```csv

```

#### `domain-number-octal-base`

- Command(s): `number.octal()`
- Preview data:
```csv

```

#### `domain-number-octal-arg-max`

- Command(s): `number.octal(max=3)`
- Preview data:
```csv

```

#### `domain-number-octal-arg-min`

- Command(s): `number.octal(min=1)`
- Preview data:
```csv

```

#### `domain-number-octal-pair-max-min`

- Command(s): `number.octal(max=3, min=1)`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-base`

- Command(s): `number.romanNumeral()`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-arg-min`

- Command(s): `number.romanNumeral(min=1)`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-arg-max`

- Command(s): `number.romanNumeral(max=3)`
- Preview data:
```csv

```

#### `domain-number-romanNumeral-pair-min-max`

- Command(s): `number.romanNumeral(min=1, max=3)`
- Preview data:
```csv

```

#### `domain-person-bio-base`

- Command(s): `person.bio()`
- Preview data:
```csv

```

#### `domain-person-firstName-base`

- Command(s): `person.firstName()`
- Preview data:
```csv

```

#### `domain-person-firstName-arg-sex`

- Command(s): `person.firstName(sex="male")`
- Preview data:
```csv

```

#### `domain-person-fullName-base`

- Command(s): `person.fullName()`
- Preview data:
```csv

```

#### `domain-person-gender-base`

- Command(s): `person.gender()`
- Preview data:
```csv

```

#### `domain-person-jobArea-base`

- Command(s): `person.jobArea()`
- Preview data:
```csv

```

#### `domain-person-jobDescriptor-base`

- Command(s): `person.jobDescriptor()`
- Preview data:
```csv

```

#### `domain-person-jobTitle-base`

- Command(s): `person.jobTitle()`
- Preview data:
```csv

```

#### `domain-person-jobType-base`

- Command(s): `person.jobType()`
- Preview data:
```csv

```

#### `domain-person-lastName-base`

- Command(s): `person.lastName()`
- Preview data:
```csv

```

#### `domain-person-lastName-arg-sex`

- Command(s): `person.lastName(sex="male")`
- Preview data:
```csv

```

#### `domain-person-middleName-base`

- Command(s): `person.middleName()`
- Preview data:
```csv

```

#### `domain-person-middleName-arg-sex`

- Command(s): `person.middleName(sex="male")`
- Preview data:
```csv

```

#### `domain-person-prefix-base`

- Command(s): `person.prefix()`
- Preview data:
```csv

```

#### `domain-person-prefix-arg-sex`

- Command(s): `person.prefix(sex="male")`
- Preview data:
```csv

```

#### `domain-person-sex-base`

- Command(s): `person.sex()`
- Preview data:
```csv

```

#### `domain-person-sexType-base`

- Command(s): `person.sexType()`
- Preview data:
```csv

```

#### `domain-person-suffix-base`

- Command(s): `person.suffix()`
- Preview data:
```csv

```

#### `domain-person-zodiacSign-base`

- Command(s): `person.zodiacSign()`
- Preview data:
```csv

```

#### `domain-phone-imei-base`

- Command(s): `phone.imei()`
- Preview data:
```csv

```

#### `domain-phone-number-base`

- Command(s): `phone.number()`
- Preview data:
```csv

```

#### `domain-phone-number-arg-style`

- Command(s): `phone.number(style="international")`
- Preview data:
```csv

```

#### `domain-string-alpha-base`

- Command(s): `string.alpha()`
- Preview data:
```csv

```

#### `domain-string-alpha-arg-length`

- Command(s): `string.alpha(length=4)`
- Preview data:
```csv

```

#### `domain-string-alpha-arg-casing`

- Command(s): `string.alpha(casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alpha-arg-exclude`

- Command(s): `string.alpha(exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-alpha-pair-length-casing`

- Command(s): `string.alpha(length=4, casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alpha-pair-casing-exclude`

- Command(s): `string.alpha(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-base`

- Command(s): `string.alphanumeric()`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-arg-length`

- Command(s): `string.alphanumeric(length=4)`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-arg-casing`

- Command(s): `string.alphanumeric(casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-arg-exclude`

- Command(s): `string.alphanumeric(exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-pair-length-casing`

- Command(s): `string.alphanumeric(length=4, casing="upper")`
- Preview data:
```csv

```

#### `domain-string-alphanumeric-pair-casing-exclude`

- Command(s): `string.alphanumeric(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-binary-base`

- Command(s): `string.binary()`
- Preview data:
```csv

```

#### `domain-string-binary-arg-length`

- Command(s): `string.binary(length=4)`
- Preview data:
```csv

```

#### `domain-string-binary-arg-prefix`

- Command(s): `string.binary(prefix="#")`
- Preview data:
```csv

```

#### `domain-string-binary-pair-length-prefix`

- Command(s): `string.binary(length=4, prefix="#")`
- Preview data:
```csv

```

#### `domain-string-counterString-base`

- Command(s): `string.counterString(1, 25, "*")`
- Preview data:
```csv

```

#### `domain-string-counterString-example-1`

- Command(s): `string.counterString()`
- Preview data:
```csv

```

#### `domain-string-counterString-example-2`

- Command(s): `string.counterString(15)`
- Preview data:
```csv

```

#### `domain-string-counterString-example-3`

- Command(s): `string.counterString(min=5, max=12)`
- Preview data:
```csv

```

#### `domain-string-counterString-example-4`

- Command(s): `string.counterString(min=12, max=12, delimiter="#")`
- Preview data:
```csv

```

#### `domain-string-counterString-arg-min`

- Command(s): `string.counterString(min=5)`
- Preview data:
```csv

```

#### `domain-string-counterString-arg-max`

- Command(s): `string.counterString(max=12)`
- Preview data:
```csv

```

#### `domain-string-counterString-arg-delimiter`

- Command(s): `string.counterString(delimiter="#")`
- Preview data:
```csv

```

#### `domain-string-counterString-pair-min-max`

- Command(s): `string.counterString(min=5, max=12)`
- Preview data:
```csv

```

#### `domain-string-counterString-pair-max-delimiter`

- Command(s): `string.counterString(max=12, delimiter="#")`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-base`

- Command(s): `string.fromCharacters("ABC123", 4)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-example-1`

- Command(s): `string.fromCharacters("ABC123", 6)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-example-2`

- Command(s): `string.fromCharacters(characters=["A", "B", "C"], length=4)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-arg-characters`

- Command(s): `string.fromCharacters(characters="ABC123")`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-arg-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-pair-characters-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-base`

- Command(s): `string.hexadecimal()`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-arg-casing`

- Command(s): `string.hexadecimal(casing="upper")`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-arg-length`

- Command(s): `string.hexadecimal(length=4)`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-arg-prefix`

- Command(s): `string.hexadecimal(prefix="#")`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-pair-casing-length`

- Command(s): `string.hexadecimal(casing="upper", length=4)`
- Preview data:
```csv

```

#### `domain-string-hexadecimal-pair-length-prefix`

- Command(s): `string.hexadecimal(length=4, prefix="#")`
- Preview data:
```csv

```

#### `domain-string-nanoid-base`

- Command(s): `string.nanoid()`
- Preview data:
```csv

```

#### `domain-string-nanoid-arg-length`

- Command(s): `string.nanoid(length=4)`
- Preview data:
```csv

```

#### `domain-string-numeric-base`

- Command(s): `string.numeric()`
- Preview data:
```csv

```

#### `domain-string-numeric-arg-length`

- Command(s): `string.numeric(length=4)`
- Preview data:
```csv

```

#### `domain-string-numeric-arg-allowLeadingZeros`

- Command(s): `string.numeric(allowLeadingZeros=true)`
- Preview data:
```csv

```

#### `domain-string-numeric-arg-exclude`

- Command(s): `string.numeric(exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-numeric-pair-length-allowLeadingZeros`

- Command(s): `string.numeric(length=4, allowLeadingZeros=true)`
- Preview data:
```csv

```

#### `domain-string-numeric-pair-allowLeadingZeros-exclude`

- Command(s): `string.numeric(allowLeadingZeros=true, exclude=["A", "B"])`
- Preview data:
```csv

```

#### `domain-string-octal-base`

- Command(s): `string.octal()`
- Preview data:
```csv

```

#### `domain-string-octal-arg-length`

- Command(s): `string.octal(length=4)`
- Preview data:
```csv

```

#### `domain-string-octal-arg-prefix`

- Command(s): `string.octal(prefix="#")`
- Preview data:
```csv

```

#### `domain-string-octal-pair-length-prefix`

- Command(s): `string.octal(length=4, prefix="#")`
- Preview data:
```csv

```

#### `domain-string-sample-base`

- Command(s): `string.sample()`
- Preview data:
```csv

```

#### `domain-string-sample-arg-length`

- Command(s): `string.sample(length=4)`
- Preview data:
```csv

```

#### `domain-string-symbol-base`

- Command(s): `string.symbol()`
- Preview data:
```csv

```

#### `domain-string-symbol-arg-length`

- Command(s): `string.symbol(length=4)`
- Preview data:
```csv

```

#### `domain-string-ulid-base`

- Command(s): `string.ulid()`
- Preview data:
```csv

```

#### `domain-string-ulid-arg-refDate`

- Command(s): `string.ulid(refDate=2)`
- Preview data:
```csv

```

#### `domain-string-uuid-base`

- Command(s): `string.uuid()`
- Preview data:
```csv

```

#### `domain-system-commonFileExt-base`

- Command(s): `system.commonFileExt()`
- Preview data:
```csv

```

#### `domain-system-commonFileName-base`

- Command(s): `system.commonFileName()`
- Preview data:
```csv

```

#### `domain-system-commonFileName-arg-extension`

- Command(s): `system.commonFileName(extension="system-commonFileName-extension")`
- Preview data:
```csv

```

#### `domain-system-commonFileType-base`

- Command(s): `system.commonFileType()`
- Preview data:
```csv

```

#### `domain-system-cron-base`

- Command(s): `system.cron()`
- Preview data:
```csv

```

#### `domain-system-cron-arg-includeNonStandard`

- Command(s): `system.cron(includeNonStandard=true)`
- Preview data:
```csv

```

#### `domain-system-cron-arg-includeYear`

- Command(s): `system.cron(includeYear=true)`
- Preview data:
```csv

```

#### `domain-system-cron-pair-includeNonStandard-includeYear`

- Command(s): `system.cron(includeNonStandard=true, includeYear=true)`
- Preview data:
```csv

```

#### `domain-system-directoryPath-base`

- Command(s): `system.directoryPath()`
- Preview data:
```csv

```

#### `domain-system-fileExt-base`

- Command(s): `system.fileExt()`
- Preview data:
```csv

```

#### `domain-system-fileExt-arg-mimeType`

- Command(s): `system.fileExt(mimeType="system-fileExt-mimeType")`
- Preview data:
```csv

```

#### `domain-system-fileName-base`

- Command(s): `system.fileName()`
- Preview data:
```csv

```

#### `domain-system-filePath-base`

- Command(s): `system.filePath()`
- Preview data:
```csv

```

#### `domain-system-fileType-base`

- Command(s): `system.fileType()`
- Preview data:
```csv

```

#### `domain-system-mimeType-base`

- Command(s): `system.mimeType()`
- Preview data:
```csv

```

#### `domain-system-networkInterface-base`

- Command(s): `system.networkInterface()`
- Preview data:
```csv

```

#### `domain-system-semver-base`

- Command(s): `system.semver()`
- Preview data:
```csv

```

#### `domain-vehicle-bicycle-base`

- Command(s): `vehicle.bicycle()`
- Preview data:
```csv

```

#### `domain-vehicle-color-base`

- Command(s): `vehicle.color()`
- Preview data:
```csv

```

#### `domain-vehicle-fuel-base`

- Command(s): `vehicle.fuel()`
- Preview data:
```csv

```

#### `domain-vehicle-manufacturer-base`

- Command(s): `vehicle.manufacturer()`
- Preview data:
```csv

```

#### `domain-vehicle-model-base`

- Command(s): `vehicle.model()`
- Preview data:
```csv

```

#### `domain-vehicle-type-base`

- Command(s): `vehicle.type()`
- Preview data:
```csv

```

#### `domain-vehicle-vehicle-base`

- Command(s): `vehicle.vehicle()`
- Preview data:
```csv

```

#### `domain-vehicle-vin-base`

- Command(s): `vehicle.vin()`
- Preview data:
```csv

```

#### `domain-vehicle-vrm-base`

- Command(s): `vehicle.vrm()`
- Preview data:
```csv

```

#### `domain-word-adjective-base`

- Command(s): `word.adjective()`
- Preview data:
```csv

```

#### `domain-word-adjective-arg-length`

- Command(s): `word.adjective(length=4)`
- Preview data:
```csv

```

#### `domain-word-adjective-arg-max`

- Command(s): `word.adjective(max=3)`
- Preview data:
```csv

```

#### `domain-word-adjective-arg-strategy`

- Command(s): `word.adjective(strategy="word-adjective-strategy")`
- Preview data:
```csv

```

#### `domain-word-adjective-pair-length-max`

- Command(s): `word.adjective(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-adjective-pair-max-strategy`

- Command(s): `word.adjective(max=3, strategy="word-adjective-strategy")`
- Preview data:
```csv

```

#### `domain-word-adverb-base`

- Command(s): `word.adverb()`
- Preview data:
```csv

```

#### `domain-word-adverb-arg-length`

- Command(s): `word.adverb(length=4)`
- Preview data:
```csv

```

#### `domain-word-adverb-arg-max`

- Command(s): `word.adverb(max=3)`
- Preview data:
```csv

```

#### `domain-word-adverb-arg-strategy`

- Command(s): `word.adverb(strategy="word-adverb-strategy")`
- Preview data:
```csv

```

#### `domain-word-adverb-pair-length-max`

- Command(s): `word.adverb(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-adverb-pair-max-strategy`

- Command(s): `word.adverb(max=3, strategy="word-adverb-strategy")`
- Preview data:
```csv

```

#### `domain-word-conjunction-base`

- Command(s): `word.conjunction()`
- Preview data:
```csv

```

#### `domain-word-conjunction-arg-length`

- Command(s): `word.conjunction(length=4)`
- Preview data:
```csv

```

#### `domain-word-conjunction-arg-max`

- Command(s): `word.conjunction(max=3)`
- Preview data:
```csv

```

#### `domain-word-conjunction-arg-strategy`

- Command(s): `word.conjunction(strategy="word-conjunction-strategy")`
- Preview data:
```csv

```

#### `domain-word-conjunction-pair-length-max`

- Command(s): `word.conjunction(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-conjunction-pair-max-strategy`

- Command(s): `word.conjunction(max=3, strategy="word-conjunction-strategy")`
- Preview data:
```csv

```

#### `domain-word-interjection-base`

- Command(s): `word.interjection()`
- Preview data:
```csv

```

#### `domain-word-interjection-arg-length`

- Command(s): `word.interjection(length=4)`
- Preview data:
```csv

```

#### `domain-word-interjection-arg-max`

- Command(s): `word.interjection(max=3)`
- Preview data:
```csv

```

#### `domain-word-interjection-arg-strategy`

- Command(s): `word.interjection(strategy="word-interjection-strategy")`
- Preview data:
```csv

```

#### `domain-word-interjection-pair-length-max`

- Command(s): `word.interjection(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-interjection-pair-max-strategy`

- Command(s): `word.interjection(max=3, strategy="word-interjection-strategy")`
- Preview data:
```csv

```

#### `domain-word-noun-base`

- Command(s): `word.noun()`
- Preview data:
```csv

```

#### `domain-word-noun-arg-length`

- Command(s): `word.noun(length=4)`
- Preview data:
```csv

```

#### `domain-word-noun-arg-max`

- Command(s): `word.noun(max=3)`
- Preview data:
```csv

```

#### `domain-word-noun-arg-strategy`

- Command(s): `word.noun(strategy="word-noun-strategy")`
- Preview data:
```csv

```

#### `domain-word-noun-pair-length-max`

- Command(s): `word.noun(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-noun-pair-max-strategy`

- Command(s): `word.noun(max=3, strategy="word-noun-strategy")`
- Preview data:
```csv

```

#### `domain-word-preposition-base`

- Command(s): `word.preposition()`
- Preview data:
```csv

```

#### `domain-word-preposition-arg-length`

- Command(s): `word.preposition(length=4)`
- Preview data:
```csv

```

#### `domain-word-preposition-arg-max`

- Command(s): `word.preposition(max=3)`
- Preview data:
```csv

```

#### `domain-word-preposition-arg-strategy`

- Command(s): `word.preposition(strategy="word-preposition-strategy")`
- Preview data:
```csv

```

#### `domain-word-preposition-pair-length-max`

- Command(s): `word.preposition(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-preposition-pair-max-strategy`

- Command(s): `word.preposition(max=3, strategy="word-preposition-strategy")`
- Preview data:
```csv

```

#### `domain-word-sample-base`

- Command(s): `word.sample()`
- Preview data:
```csv

```

#### `domain-word-sample-arg-length`

- Command(s): `word.sample(length=4)`
- Preview data:
```csv

```

#### `domain-word-sample-arg-max`

- Command(s): `word.sample(max=3)`
- Preview data:
```csv

```

#### `domain-word-sample-arg-strategy`

- Command(s): `word.sample(strategy="word-sample-strategy")`
- Preview data:
```csv

```

#### `domain-word-sample-pair-length-max`

- Command(s): `word.sample(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-sample-pair-max-strategy`

- Command(s): `word.sample(max=3, strategy="word-sample-strategy")`
- Preview data:
```csv

```

#### `domain-word-verb-base`

- Command(s): `word.verb()`
- Preview data:
```csv

```

#### `domain-word-verb-arg-length`

- Command(s): `word.verb(length=4)`
- Preview data:
```csv

```

#### `domain-word-verb-arg-max`

- Command(s): `word.verb(max=3)`
- Preview data:
```csv

```

#### `domain-word-verb-arg-strategy`

- Command(s): `word.verb(strategy="word-verb-strategy")`
- Preview data:
```csv

```

#### `domain-word-verb-pair-length-max`

- Command(s): `word.verb(length=4, max=3)`
- Preview data:
```csv

```

#### `domain-word-verb-pair-max-strategy`

- Command(s): `word.verb(max=3, strategy="word-verb-strategy")`
- Preview data:
```csv

```

#### `domain-word-words-base`

- Command(s): `word.words()`
- Preview data:
```csv

```

#### `domain-word-words-arg-count`

- Command(s): `word.words(count=2)`
- Preview data:
```csv

```

#### `domain-word-words-arg-max`

- Command(s): `word.words(max=3)`
- Preview data:
```csv

```

#### `domain-word-words-pair-count-max`

- Command(s): `word.words(count=2, max=3)`
- Preview data:
```csv

```


## UI Scenarios

Scenario count: **20**
Generated preview data count: **20**
Review-only scenario count: **0**
Non-executable scenario count: **0**
Exact preview parity scenario count: **15**
Structural-only preview parity scenario count: **5**

### By Source Type

| Key | Count |
| --- | ---: |
| `domain` | 8 |
| `enum` | 2 |
| `faker` | 6 |
| `literal` | 2 |
| `regex` | 2 |

### By Origin

| Key | Count |
| --- | ---: |
| `base` | 4 |
| `custom` | 3 |
| `empty` | 2 |
| `example` | 10 |
| `pairwise` | 1 |

### UI Parity Modes

| Mode | Count |
| --- | ---: |
| `exact` | 15 |
| `structural` | 5 |

### Structural-Only UI Scenarios

- `custom-regex-base` - `regex("[A-Z]{2}[0-9]{2}")`
- `faker-helpers-fake-base` - `helpers.fake("{{person.firstName}}")`
- `faker-helpers-fromRegExp-example-1` - `helpers.fromRegExp("[A-Z]{2}[0-9]{2}")`
- `faker-helpers-uniqueArray-example-1` - `helpers.uniqueArray(["red", "green", "blue"], 2)`
- `domain-autoIncrement-sequence-example-1` - `autoIncrement.sequence()`

### Commands By Source Type

#### `domain` (8)

- `airline.seat`
- `autoIncrement.sequence`
- `commerce.price`
- `date.birthdate`
- `internet.password`
- `literal.value`
- `string.counterString`
- `string.fromCharacters`

#### `enum` (2)

- `enum`
- `enum pairwise`

#### `faker` (6)

- `helpers.arrayElement`
- `helpers.fake`
- `helpers.fromRegExp`
- `helpers.mustache`
- `helpers.uniqueArray`
- `helpers.weightedArrayElement`

#### `literal` (2)

- `literal`
- `literal empty`

#### `regex` (2)

- `regex`
- `regex empty`

### Scenario Details

#### `custom-enum-base`

- Command(s): `enum(active,inactive,pending)`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `custom-enum-pairwise`

- Command(s): `Status: enum(active,inactive,pending) | Priority: enum(high,medium,low)`
- UI preview parity: `exact`
- Schema Rows: `Status: enum(active,inactive,pending)`, `Priority: enum(high,medium,low)`
- Preview data:
```csv

```

#### `custom-literal-base`

- Command(s): `literal("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `custom-literal-empty`

- Command(s): `literal("")`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `custom-regex-base`

- Command(s): `regex("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv

```

#### `custom-regex-empty`

- Command(s): `regex("")`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `faker-helpers-arrayElement-base`

- Command(s): `helpers.arrayElement(["A", "B"])`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `faker-helpers-fake-base`

- Command(s): `helpers.fake("{{person.firstName}}")`
- UI preview parity: `structural`
- Preview data:
```csv

```

#### `faker-helpers-fromRegExp-example-1`

- Command(s): `helpers.fromRegExp("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv

```

#### `faker-helpers-mustache-base`

- Command(s): `helpers.mustache("{{name}}", { name: "Ada" })`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `faker-helpers-uniqueArray-example-1`

- Command(s): `helpers.uniqueArray(["red", "green", "blue"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv

```

#### `faker-helpers-weightedArrayElement-example-1`

- Command(s): `helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `domain-airline-seat-example-1`

- Command(s): `airline.seat()`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `domain-autoIncrement-sequence-example-1`

- Command(s): `autoIncrement.sequence()`
- UI preview parity: `structural`
- Preview data:
```csv

```

#### `domain-commerce-price-example-1`

- Command(s): `commerce.price(dec=2, max=10, min=1, symbol="$")`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `domain-date-birthdate-example-1`

- Command(s): `date.birthdate(refDate=20000, max=69, min=16, mode="age")`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `domain-internet-password-example-1`

- Command(s): `internet.password(length=10, memorable=false, pattern="[A-Za-z0-9]", prefix="#")`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `domain-literal-value-example-1`

- Command(s): `literal.value("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `domain-string-counterString-example-1`

- Command(s): `string.counterString()`
- UI preview parity: `exact`
- Preview data:
```csv

```

#### `domain-string-fromCharacters-base`

- Command(s): `string.fromCharacters("ABC123", 4)`
- UI preview parity: `exact`
- Preview data:
```csv

```

