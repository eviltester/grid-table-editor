# Schema Interaction Matrix Summary

Generated: `2026-06-13T08:32:04.209Z`

This file describes what the interaction matrix covers.

- `coverageScenarios`: full review catalog generated from definitions
- `runtimeScenarios`: executable real-core runtime subset
- `uiScenarios`: executable JSDOM UI subset

## Coverage Scenarios

Scenario count: **632**
Generated preview data count: **621**
Review-only scenario count: **0**
Non-executable scenario count: **11**

### By Source Type

| Key | Count |
| --- | ---: |
| `domain` | 572 |
| `enum` | 2 |
| `faker` | 54 |
| `literal` | 2 |
| `regex` | 2 |

### By Origin

| Key | Count |
| --- | ---: |
| `arg` | 216 |
| `base` | 259 |
| `custom` | 6 |
| `empty` | 2 |
| `example` | 30 |
| `pair` | 121 |
| `pairwise` | 1 |

### Commands By Source Type

#### `domain` (245)

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
- `finance.maskedNumber`
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
- `image.avatarLegacy`
- `image.dataUri`
- `image.personPortrait`
- `image.url`
- `image.urlLoremFlickr`
- `image.urlPicsumPhotos`
- `image.urlPlaceholder`
- `internet.color`
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
- `internet.userName`
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
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
"pending"
```

#### `custom-enum-pairwise`

- Command(s): `Status: enum(active,inactive,pending) | Priority: enum(high,medium,low)`
- UI preview parity: `exact`
- Schema Rows: `Status: enum(active,inactive,pending)`, `Priority: enum(high,medium,low)`
- Preview data:
```csv
"Status","Priority"
"inactive","medium"
"inactive","low"
```
- Pairwise preview data:
```csv
"Status","Priority"
"active","high"
"active","medium"
"active","low"
"inactive","high"
"inactive","medium"
"inactive","low"
"pending","high"
"pending","medium"
"pending","low"
```

#### `custom-literal-base`

- Command(s): `literal("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
"Pending"
```

#### `custom-literal-empty`

- Command(s): `literal("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
""
```

#### `custom-regex-base`

- Command(s): `regex("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Code"
"VC23"
```

#### `custom-regex-empty`

- Command(s): `regex("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Code"
""
```

#### `faker-helpers-arrayElement-base`

- Command(s): `helpers.arrayElement(["A", "B"])`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"B"
```

#### `faker-helpers-arrayElement-example-1`

- Command(s): `helpers.arrayElement(["A", "B", "C"])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"A"
```

#### `faker-helpers-arrayElement-arg-array`

- Command(s): `helpers.arrayElement(["A", "B"])`
- Preview data:
```csv
"Value"
"B"
```

#### `faker-helpers-arrayElements-base`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""B"",""A""]"
```

#### `faker-helpers-arrayElements-example-1`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-arrayElements-arg-array`

- Command(s): `helpers.arrayElements(["A", "B"])`
- Preview data:
```csv
"Value"
"[""B""]"
```

#### `faker-helpers-arrayElements-arg-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-arrayElements-pair-array-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv
"Value"
"[""B"",""A""]"
```

#### `faker-helpers-fake-base`

- Command(s): `helpers.fake("{{person.firstName}}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"Melvin"
```

#### `faker-helpers-fake-example-1`

- Command(s): `helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"Hi, my name is Ardith Weber!"
```

#### `faker-helpers-fake-arg-pattern`

- Command(s): `helpers.fake("[A-Z]{2}")`
- Preview data:
```csv
"Value"
"[A-Z]{2}"
```

#### `faker-helpers-fromRegExp-base`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"BJ"
```

#### `faker-helpers-fromRegExp-example-1`

- Command(s): `helpers.fromRegExp("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"PU71"
```

#### `faker-helpers-fromRegExp-arg-pattern`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- Preview data:
```csv
"Value"
"XA"
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
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Ada"
```

#### `faker-helpers-mustache-example-1`

- Command(s): `helpers.mustache("Hello {{name}}", { name: "Ada" })`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Hello Ada"
```

#### `faker-helpers-mustache-arg-text`

- Command(s): `helpers.mustache("{{name}}")`
- Preview data:
```csv
"Value"
"{{name}}"
```

#### `faker-helpers-mustache-arg-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv
"Value"
"{{name}}"
```

#### `faker-helpers-mustache-pair-text-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv
"Value"
"{{name}}"
```

#### `faker-helpers-rangeToNumber-base`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"1"
```

#### `faker-helpers-rangeToNumber-example-1`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"2"
```

#### `faker-helpers-rangeToNumber-arg-numberOrRange`

- Command(s): `helpers.rangeToNumber(2)`
- Preview data:
```csv
"Value"
"2"
```

#### `faker-helpers-replaceCreditCardSymbols-base`

- Command(s): `helpers.replaceCreditCardSymbols()`
- Preview data:
```csv
"Value"
"6453-3460-3761-5138-2959"
```

#### `faker-helpers-replaceCreditCardSymbols-example-1`

- Command(s): `helpers.replaceCreditCardSymbols("1234-[4-9]-##!!-L")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"1234-5-4775-8"
```

#### `faker-helpers-replaceCreditCardSymbols-arg-string`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string")`
- Preview data:
```csv
"Value"
"helpers-replaceCreditCardSymbols-string"
```

#### `faker-helpers-replaceCreditCardSymbols-arg-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv
"Value"
"helpers-replaceCreditCardSymbols-string"
```

#### `faker-helpers-replaceCreditCardSymbols-pair-string-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv
"Value"
"helpers-replaceCreditCardSymbols-string"
```

#### `faker-helpers-replaceSymbols-base`

- Command(s): `helpers.replaceSymbols()`
- Preview data:
```csv
"Value"
""
```

#### `faker-helpers-replaceSymbols-example-1`

- Command(s): `helpers.replaceSymbols("##??-##")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"47UI-39"
```

#### `faker-helpers-replaceSymbols-arg-string`

- Command(s): `helpers.replaceSymbols("helpers-replaceSymbols-string")`
- Preview data:
```csv
"Value"
"helpers-replaceSymbols-string"
```

#### `faker-helpers-shuffle-base`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""B"",""A"",""C""]"
```

#### `faker-helpers-shuffle-example-1`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""B"",""A"",""C""]"
```

#### `faker-helpers-shuffle-arg-array`

- Command(s): `helpers.shuffle(["A", "B"])`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-slugify-base`

- Command(s): `helpers.slugify()`
- Preview data:
```csv
"Value"
""
```

#### `faker-helpers-slugify-example-1`

- Command(s): `helpers.slugify("Hello World 2026")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Hello-World-2026"
```

#### `faker-helpers-slugify-arg-string`

- Command(s): `helpers.slugify("helpers-slugify-string")`
- Preview data:
```csv
"Value"
"helpers-slugify-string"
```

#### `faker-helpers-uniqueArray-base`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-uniqueArray-example-1`

- Command(s): `helpers.uniqueArray(["red", "green", "blue"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""blue"",""green""]"
```

#### `faker-helpers-uniqueArray-arg-source`

- Command(s): `helpers.uniqueArray(["A", "B"])`
- Preview data:
```csv
"Value"
"[]"
```

#### `faker-helpers-uniqueArray-arg-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv
"Value"
"[""B"",""A""]"
```

#### `faker-helpers-uniqueArray-pair-source-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-weightedArrayElement-base`

- Command(s): `helpers.weightedArrayElement([{ "weight": 1, "value": "A" }, { "weight": 2, "value": "B" }])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"A"
```

#### `faker-helpers-weightedArrayElement-example-1`

- Command(s): `helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"sunny"
```

#### `faker-helpers-weightedArrayElement-arg-array`

- Command(s): `helpers.weightedArrayElement(["A", "B"])`
- Preview data: not generated for this non-executable scenario

#### `domain-airline-aircraftType-base`

- Command(s): `airline.aircraftType()`
- Preview data:
```csv
"Value"
"widebody"
```

#### `domain-airline-flightNumber-base`

- Command(s): `airline.flightNumber()`
- Preview data:
```csv
"Value"
"54"
```

#### `domain-airline-iataCode-base`

- Command(s): `airline.iataCode()`
- Preview data:
```csv
"Value"
"VS"
```

#### `domain-airline-name-base`

- Command(s): `airline.name()`
- Preview data:
```csv
"Value"
"Juneyao Airlines"
```

#### `domain-airline-recordLocator-base`

- Command(s): `airline.recordLocator()`
- Preview data:
```csv
"Value"
"QYNEDR"
```

#### `domain-airline-seat-base`

- Command(s): `airline.seat()`
- Preview data:
```csv
"Value"
"29B"
```

#### `domain-airline-seat-example-1`

- Command(s): `airline.seat()`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"32C"
```

#### `domain-airline-seat-example-2`

- Command(s): `airline.seat(aircraftType="widebody")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"55J"
```

#### `domain-airline-seat-arg-aircraftType`

- Command(s): `airline.seat(aircraftType="widebody")`
- Preview data:
```csv
"Value"
"3A"
```

#### `domain-airplane-iataTypeCode-base`

- Command(s): `airplane.iataTypeCode()`
- Preview data:
```csv
"Value"
"345"
```

#### `domain-airplane-name-base`

- Command(s): `airplane.name()`
- Preview data:
```csv
"Value"
"Boeing 747-400"
```

#### `domain-airport-iataCode-base`

- Command(s): `airport.iataCode()`
- Preview data:
```csv
"Value"
"MEX"
```

#### `domain-airport-name-base`

- Command(s): `airport.name()`
- Preview data:
```csv
"Value"
"Hobart International Airport"
```

#### `domain-animal-bear-base`

- Command(s): `animal.bear()`
- Preview data:
```csv
"Value"
"American black bear"
```

#### `domain-animal-bird-base`

- Command(s): `animal.bird()`
- Preview data:
```csv
"Value"
"Red-footed Booby"
```

#### `domain-animal-cat-base`

- Command(s): `animal.cat()`
- Preview data:
```csv
"Value"
"Ojos Azules"
```

#### `domain-animal-cetacean-base`

- Command(s): `animal.cetacean()`
- Preview data:
```csv
"Value"
"Blue Whale"
```

#### `domain-animal-cow-base`

- Command(s): `animal.cow()`
- Preview data:
```csv
"Value"
"Mandalong Special"
```

#### `domain-animal-crocodilia-base`

- Command(s): `animal.crocodilia()`
- Preview data:
```csv
"Value"
"Cuban Crocodile"
```

#### `domain-animal-dog-base`

- Command(s): `animal.dog()`
- Preview data:
```csv
"Value"
"Yakutian Laika"
```

#### `domain-animal-fish-base`

- Command(s): `animal.fish()`
- Preview data:
```csv
"Value"
"Jumbo flying squid"
```

#### `domain-animal-horse-base`

- Command(s): `animal.horse()`
- Preview data:
```csv
"Value"
"Trait Du Nord"
```

#### `domain-animal-insect-base`

- Command(s): `animal.insect()`
- Preview data:
```csv
"Value"
"False honey ant"
```

#### `domain-animal-lion-base`

- Command(s): `animal.lion()`
- Preview data:
```csv
"Value"
"Cape lion"
```

#### `domain-animal-petName-base`

- Command(s): `animal.petName()`
- Preview data:
```csv
"Value"
"Bandit"
```

#### `domain-animal-rabbit-base`

- Command(s): `animal.rabbit()`
- Preview data:
```csv
"Value"
"Silver"
```

#### `domain-animal-rodent-base`

- Command(s): `animal.rodent()`
- Preview data:
```csv
"Value"
"Bonetto's tuco-tuco"
```

#### `domain-animal-snake-base`

- Command(s): `animal.snake()`
- Preview data:
```csv
"Value"
"White-lipped keelback"
```

#### `domain-animal-type-base`

- Command(s): `animal.type()`
- Preview data:
```csv
"Value"
"elephant"
```

#### `domain-autoIncrement-sequence-base`

- Command(s): `autoIncrement.sequence(1, 5, "filename", ".txt", 3)`
- Preview data:
```csv
"Value"
"filename0001.txt"
```

#### `domain-autoIncrement-sequence-example-1`

- Command(s): `autoIncrement.sequence()`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-autoIncrement-sequence-example-2`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv
"Value"
"10"
```

#### `domain-autoIncrement-sequence-example-3`

- Command(s): `autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)`
- Preview data:
```csv
"Value"
"filename0001.txt"
```

#### `domain-autoIncrement-sequence-arg-start`

- Command(s): `autoIncrement.sequence(start=10)`
- Preview data:
```csv
"Value"
"10"
```

#### `domain-autoIncrement-sequence-arg-step`

- Command(s): `autoIncrement.sequence(step=5)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-autoIncrement-sequence-arg-prefix`

- Command(s): `autoIncrement.sequence(prefix="filename")`
- Preview data:
```csv
"Value"
"filename1"
```

#### `domain-autoIncrement-sequence-arg-suffix`

- Command(s): `autoIncrement.sequence(suffix=".txt")`
- Preview data:
```csv
"Value"
"1.txt"
```

#### `domain-autoIncrement-sequence-arg-zeropadding`

- Command(s): `autoIncrement.sequence(zeropadding=3)`
- Preview data:
```csv
"Value"
"0001"
```

#### `domain-autoIncrement-sequence-pair-start-step`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv
"Value"
"10"
```

#### `domain-autoIncrement-sequence-pair-step-prefix`

- Command(s): `autoIncrement.sequence(step=5, prefix="filename")`
- Preview data:
```csv
"Value"
"filename1"
```

#### `domain-autoIncrement-sequence-pair-prefix-suffix`

- Command(s): `autoIncrement.sequence(prefix="filename", suffix=".txt")`
- Preview data:
```csv
"Value"
"filename1.txt"
```

#### `domain-autoIncrement-sequence-pair-suffix-zeropadding`

- Command(s): `autoIncrement.sequence(suffix=".txt", zeropadding=3)`
- Preview data:
```csv
"Value"
"0001.txt"
```

#### `domain-book-author-base`

- Command(s): `book.author()`
- Preview data:
```csv
"Value"
"Hermann Broch"
```

#### `domain-book-format-base`

- Command(s): `book.format()`
- Preview data:
```csv
"Value"
"Ebook"
```

#### `domain-book-genre-base`

- Command(s): `book.genre()`
- Preview data:
```csv
"Value"
"Philosophy"
```

#### `domain-book-publisher-base`

- Command(s): `book.publisher()`
- Preview data:
```csv
"Value"
"Hodder & Stoughton"
```

#### `domain-book-series-base`

- Command(s): `book.series()`
- Preview data:
```csv
"Value"
"Colonel Race"
```

#### `domain-book-title-base`

- Command(s): `book.title()`
- Preview data:
```csv
"Value"
"The Sound and the Fury"
```

#### `domain-chemicalElement-atomicNumber-base`

- Command(s): `chemicalElement.atomicNumber()`
- Preview data:
```csv
"Value"
"9"
```

#### `domain-chemicalElement-name-base`

- Command(s): `chemicalElement.name()`
- Preview data:
```csv
"Value"
"Meitnerium"
```

#### `domain-chemicalElement-symbol-base`

- Command(s): `chemicalElement.symbol()`
- Preview data:
```csv
"Value"
"Lv"
```

#### `domain-color-cssSupportedFunction-base`

- Command(s): `color.cssSupportedFunction()`
- Preview data:
```csv
"Value"
"hwb"
```

#### `domain-color-cssSupportedSpace-base`

- Command(s): `color.cssSupportedSpace()`
- Preview data:
```csv
"Value"
"sRGB"
```

#### `domain-color-human-base`

- Command(s): `color.human()`
- Preview data:
```csv
"Value"
"turquoise"
```

#### `domain-color-rgb-base`

- Command(s): `color.rgb()`
- Preview data:
```csv
"Value"
"#bce97e"
```

#### `domain-color-rgb-arg-casing`

- Command(s): `color.rgb(casing="upper")`
- Preview data:
```csv
"Value"
"#BCBFC4"
```

#### `domain-color-rgb-arg-format`

- Command(s): `color.rgb(format="hex")`
- Preview data:
```csv
"Value"
"#9be19f"
```

#### `domain-color-rgb-arg-includeAlpha`

- Command(s): `color.rgb(includeAlpha=true)`
- Preview data:
```csv
"Value"
"#71d66e8f"
```

#### `domain-color-rgb-arg-prefix`

- Command(s): `color.rgb(prefix="#")`
- Preview data:
```csv
"Value"
"#dceba6"
```

#### `domain-color-rgb-pair-casing-format`

- Command(s): `color.rgb(casing="upper", format="hex")`
- Preview data:
```csv
"Value"
"#F948CC"
```

#### `domain-color-rgb-pair-format-includeAlpha`

- Command(s): `color.rgb(format="hex", includeAlpha=true)`
- Preview data:
```csv
"Value"
"#bd037ce9"
```

#### `domain-color-rgb-pair-includeAlpha-prefix`

- Command(s): `color.rgb(includeAlpha=true, prefix="#")`
- Preview data:
```csv
"Value"
"#d95bfefc"
```

#### `domain-color-space-base`

- Command(s): `color.space()`
- Preview data:
```csv
"Value"
"CIEUVW"
```

#### `domain-commerce-department-base`

- Command(s): `commerce.department()`
- Preview data:
```csv
"Value"
"Home"
```

#### `domain-commerce-isbn-base`

- Command(s): `commerce.isbn()`
- Preview data:
```csv
"Value"
"978-0-276-38715-9"
```

#### `domain-commerce-isbn-arg-separator`

- Command(s): `commerce.isbn(separator="-")`
- Preview data:
```csv
"Value"
"978-1-01-952776-4"
```

#### `domain-commerce-isbn-arg-variant`

- Command(s): `commerce.isbn(variant="13")`
- Preview data:
```csv
"Value"
"978-0-9939513-5-0"
```

#### `domain-commerce-isbn-pair-separator-variant`

- Command(s): `commerce.isbn(separator="-", variant="13")`
- Preview data:
```csv
"Value"
"978-1-63392-157-3"
```

#### `domain-commerce-price-base`

- Command(s): `commerce.price()`
- Preview data:
```csv
"Value"
"557.85"
```

#### `domain-commerce-price-example-1`

- Command(s): `commerce.price(dec=2, max=10, min=1, symbol="$")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"$3.69"
```

#### `domain-commerce-price-arg-dec`

- Command(s): `commerce.price(dec=2)`
- Preview data:
```csv
"Value"
"489.39"
```

#### `domain-commerce-price-arg-max`

- Command(s): `commerce.price(max=100)`
- Preview data:
```csv
"Value"
"11.69"
```

#### `domain-commerce-price-arg-min`

- Command(s): `commerce.price(min=1)`
- Preview data:
```csv
"Value"
"624.89"
```

#### `domain-commerce-price-arg-symbol`

- Command(s): `commerce.price(symbol="$")`
- Preview data:
```csv
"Value"
"$408.79"
```

#### `domain-commerce-price-pair-dec-max`

- Command(s): `commerce.price(dec=2, max=100)`
- Preview data:
```csv
"Value"
"80.09"
```

#### `domain-commerce-price-pair-max-min`

- Command(s): `commerce.price(max=100, min=1)`
- Preview data:
```csv
"Value"
"65.60"
```

#### `domain-commerce-price-pair-min-symbol`

- Command(s): `commerce.price(min=1, symbol="$")`
- Preview data:
```csv
"Value"
"$80.15"
```

#### `domain-commerce-product-base`

- Command(s): `commerce.product()`
- Preview data:
```csv
"Value"
"Salad"
```

#### `domain-commerce-productAdjective-base`

- Command(s): `commerce.productAdjective()`
- Preview data:
```csv
"Value"
"Rustic"
```

#### `domain-commerce-productDescription-base`

- Command(s): `commerce.productDescription()`
- Preview data:
```csv
"Value"
"Discover the inconsequential new Gloves with an exciting mix of Cotton ingredients"
```

#### `domain-commerce-productMaterial-base`

- Command(s): `commerce.productMaterial()`
- Preview data:
```csv
"Value"
"Silk"
```

#### `domain-commerce-productName-base`

- Command(s): `commerce.productName()`
- Preview data:
```csv
"Value"
"Practical Aluminum Shirt"
```

#### `domain-company-buzzAdjective-base`

- Command(s): `company.buzzAdjective()`
- Preview data:
```csv
"Value"
"B2B"
```

#### `domain-company-buzzNoun-base`

- Command(s): `company.buzzNoun()`
- Preview data:
```csv
"Value"
"schemas"
```

#### `domain-company-buzzPhrase-base`

- Command(s): `company.buzzPhrase()`
- Preview data:
```csv
"Value"
"engineer scalable smart contracts"
```

#### `domain-company-buzzVerb-base`

- Command(s): `company.buzzVerb()`
- Preview data:
```csv
"Value"
"expedite"
```

#### `domain-company-catchPhrase-base`

- Command(s): `company.catchPhrase()`
- Preview data:
```csv
"Value"
"Synchronised fault-tolerant service-desk"
```

#### `domain-company-catchPhraseAdjective-base`

- Command(s): `company.catchPhraseAdjective()`
- Preview data:
```csv
"Value"
"Diverse"
```

#### `domain-company-catchPhraseDescriptor-base`

- Command(s): `company.catchPhraseDescriptor()`
- Preview data:
```csv
"Value"
"zero trust"
```

#### `domain-company-catchPhraseNoun-base`

- Command(s): `company.catchPhraseNoun()`
- Preview data:
```csv
"Value"
"hardware"
```

#### `domain-company-name-base`

- Command(s): `company.name()`
- Preview data:
```csv
"Value"
"Yundt, Boehm and Roob"
```

#### `domain-database-collation-base`

- Command(s): `database.collation()`
- Preview data:
```csv
"Value"
"utf8_bin"
```

#### `domain-database-column-base`

- Command(s): `database.column()`
- Preview data:
```csv
"Value"
"updatedAt"
```

#### `domain-database-engine-base`

- Command(s): `database.engine()`
- Preview data:
```csv
"Value"
"MyISAM"
```

#### `domain-database-mongodbObjectId-base`

- Command(s): `database.mongodbObjectId()`
- Preview data:
```csv
"Value"
"d62d29cffe9912ddfddddb58"
```

#### `domain-database-type-base`

- Command(s): `database.type()`
- Preview data:
```csv
"Value"
"point"
```

#### `domain-datatype-boolean-base`

- Command(s): `datatype.boolean()`
- Preview data:
```csv
"Value"
"false"
```

#### `domain-datatype-boolean-arg-probability`

- Command(s): `datatype.boolean(probability=2)`
- Preview data:
```csv
"Value"
"true"
```

#### `domain-datatype-enum-base`

- Command(s): `datatype.enum("active", "inactive", "pending")`
- Preview data:
```csv
"Value"
"active"
```

#### `domain-date-anytime-base`

- Command(s): `date.anytime()`
- Preview data:
```csv
"Value"
"2026-06-22T17:30:12.369Z"
```

#### `domain-date-anytime-arg-refDate`

- Command(s): `date.anytime(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-09-21T21:46:38.236Z"
```

#### `domain-date-between-base`

- Command(s): `date.between(1577836800000, 1609372800000)`
- Preview data:
```csv
"Value"
"2020-07-25T19:48:55.233Z"
```

#### `domain-date-between-arg-from`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv
"Value"
"2020-08-02T19:17:11.407Z"
```

#### `domain-date-between-arg-to`

- Command(s): `date.between(to=1609372800000, from=1577836800000)`
- Preview data:
```csv
"Value"
"2020-07-28T01:45:25.825Z"
```

#### `domain-date-between-pair-from-to`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv
"Value"
"2020-04-01T08:35:52.015Z"
```

#### `domain-date-birthdate-base`

- Command(s): `date.birthdate()`
- Preview data:
```csv
"Value"
"1957-08-17T17:25:24.372Z"
```

#### `domain-date-birthdate-example-1`

- Command(s): `date.birthdate(refDate=20000, max=69, min=16, mode="age")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"1920-10-04T17:22:24.125Z"
```

#### `domain-date-birthdate-arg-refDate`

- Command(s): `date.birthdate(refDate=1577836800000, min=18, max=65, mode="age")`
- Preview data:
```csv
"Value"
"1986-12-14T21:23:27.338Z"
```

#### `domain-date-birthdate-arg-max`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv
"Value"
"1979-07-05T21:32:12.817Z"
```

#### `domain-date-birthdate-arg-min`

- Command(s): `date.birthdate(min=18, max=65, mode="age")`
- Preview data:
```csv
"Value"
"1970-08-31T12:55:40.310Z"
```

#### `domain-date-birthdate-arg-mode`

- Command(s): `date.birthdate(mode="age", min=18, max=65)`
- Preview data:
```csv
"Value"
"1989-12-13T00:22:51.731Z"
```

#### `domain-date-birthdate-pair-refDate-max`

- Command(s): `date.birthdate(refDate=1577836800000, max=65, min=18, mode="age")`
- Preview data:
```csv
"Value"
"1973-08-07T06:26:36.179Z"
```

#### `domain-date-birthdate-pair-max-min`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv
"Value"
"1979-10-24T15:54:42.562Z"
```

#### `domain-date-birthdate-pair-min-mode`

- Command(s): `date.birthdate(min=18, mode="age", max=65)`
- Preview data:
```csv
"Value"
"1970-04-18T18:38:14.313Z"
```

#### `domain-date-future-base`

- Command(s): `date.future()`
- Preview data:
```csv
"Value"
"2026-09-28T03:54:21.115Z"
```

#### `domain-date-future-arg-refDate`

- Command(s): `date.future(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-01-10T14:38:46.292Z"
```

#### `domain-date-future-arg-years`

- Command(s): `date.future(years=2)`
- Preview data:
```csv
"Value"
"2027-12-10T22:37:31.420Z"
```

#### `domain-date-future-pair-refDate-years`

- Command(s): `date.future(refDate=1577836800000, years=2)`
- Preview data:
```csv
"Value"
"2021-08-02T04:49:51.903Z"
```

#### `domain-date-month-base`

- Command(s): `date.month()`
- Preview data:
```csv
"Value"
"August"
```

#### `domain-date-month-arg-abbreviated`

- Command(s): `date.month(abbreviated=true)`
- Preview data:
```csv
"Value"
"Jun"
```

#### `domain-date-month-arg-context`

- Command(s): `date.month(context=true)`
- Preview data:
```csv
"Value"
"August"
```

#### `domain-date-month-pair-abbreviated-context`

- Command(s): `date.month(abbreviated=true, context=true)`
- Preview data:
```csv
"Value"
"Jul"
```

#### `domain-date-past-base`

- Command(s): `date.past()`
- Preview data:
```csv
"Value"
"2026-01-11T01:33:19.288Z"
```

#### `domain-date-past-arg-refDate`

- Command(s): `date.past(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2019-08-27T00:03:49.125Z"
```

#### `domain-date-past-arg-years`

- Command(s): `date.past(years=2)`
- Preview data:
```csv
"Value"
"2025-06-15T14:33:12.683Z"
```

#### `domain-date-past-pair-refDate-years`

- Command(s): `date.past(refDate=1577836800000, years=2)`
- Preview data:
```csv
"Value"
"2019-05-16T08:15:04.782Z"
```

#### `domain-date-recent-base`

- Command(s): `date.recent()`
- Preview data:
```csv
"Value"
"2026-06-13T08:22:34.177Z"
```

#### `domain-date-recent-arg-days`

- Command(s): `date.recent(days=7)`
- Preview data:
```csv
"Value"
"2026-06-11T14:10:36.847Z"
```

#### `domain-date-recent-arg-refDate`

- Command(s): `date.recent(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2019-12-31T17:33:19.970Z"
```

#### `domain-date-recent-pair-days-refDate`

- Command(s): `date.recent(days=7, refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2019-12-31T16:09:08.524Z"
```

#### `domain-date-soon-base`

- Command(s): `date.soon()`
- Preview data:
```csv
"Value"
"2026-06-13T10:23:16.938Z"
```

#### `domain-date-soon-arg-days`

- Command(s): `date.soon(days=7)`
- Preview data:
```csv
"Value"
"2026-06-15T02:51:05.166Z"
```

#### `domain-date-soon-arg-refDate`

- Command(s): `date.soon(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-01-01T14:00:11.275Z"
```

#### `domain-date-soon-pair-days-refDate`

- Command(s): `date.soon(days=7, refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-01-05T05:26:41.692Z"
```

#### `domain-date-timeZone-base`

- Command(s): `date.timeZone()`
- Preview data:
```csv
"Value"
"Africa/Blantyre"
```

#### `domain-date-weekday-base`

- Command(s): `date.weekday()`
- Preview data:
```csv
"Value"
"Sunday"
```

#### `domain-date-weekday-arg-abbreviated`

- Command(s): `date.weekday(abbreviated=true)`
- Preview data:
```csv
"Value"
"Fri"
```

#### `domain-date-weekday-arg-context`

- Command(s): `date.weekday(context=true)`
- Preview data:
```csv
"Value"
"Sunday"
```

#### `domain-date-weekday-pair-abbreviated-context`

- Command(s): `date.weekday(abbreviated=true, context=true)`
- Preview data:
```csv
"Value"
"Wed"
```

#### `domain-finance-accountName-base`

- Command(s): `finance.accountName()`
- Preview data:
```csv
"Value"
"Credit Card Account"
```

#### `domain-finance-accountNumber-base`

- Command(s): `finance.accountNumber()`
- Preview data:
```csv
"Value"
"12741818"
```

#### `domain-finance-accountNumber-arg-length`

- Command(s): `finance.accountNumber(length=4)`
- Preview data:
```csv
"Value"
"0626"
```

#### `domain-finance-amount-base`

- Command(s): `finance.amount()`
- Preview data:
```csv
"Value"
"98.23"
```

#### `domain-finance-amount-arg-autoFormat`

- Command(s): `finance.amount(autoFormat=true)`
- Preview data:
```csv
"Value"
"243.58"
```

#### `domain-finance-amount-arg-dec`

- Command(s): `finance.amount(dec=2)`
- Preview data:
```csv
"Value"
"180.47"
```

#### `domain-finance-amount-arg-max`

- Command(s): `finance.amount(max=100)`
- Preview data:
```csv
"Value"
"98.06"
```

#### `domain-finance-amount-arg-min`

- Command(s): `finance.amount(min=1)`
- Preview data:
```csv
"Value"
"745.17"
```

#### `domain-finance-amount-arg-symbol`

- Command(s): `finance.amount(symbol="$")`
- Preview data:
```csv
"Value"
"$439.51"
```

#### `domain-finance-amount-pair-autoFormat-dec`

- Command(s): `finance.amount(autoFormat=true, dec=2)`
- Preview data:
```csv
"Value"
"823.64"
```

#### `domain-finance-amount-pair-dec-max`

- Command(s): `finance.amount(dec=2, max=100)`
- Preview data:
```csv
"Value"
"61.65"
```

#### `domain-finance-amount-pair-max-min`

- Command(s): `finance.amount(max=100, min=1)`
- Preview data:
```csv
"Value"
"73.22"
```

#### `domain-finance-amount-pair-min-symbol`

- Command(s): `finance.amount(min=1, symbol="$")`
- Preview data:
```csv
"Value"
"$738.40"
```

#### `domain-finance-bic-base`

- Command(s): `finance.bic()`
- Preview data:
```csv
"Value"
"SCXGMW70"
```

#### `domain-finance-bic-arg-includeBranchCode`

- Command(s): `finance.bic(includeBranchCode=true)`
- Preview data:
```csv
"Value"
"TOZQSBL96NT"
```

#### `domain-finance-bitcoinAddress-base`

- Command(s): `finance.bitcoinAddress()`
- Preview data:
```csv
"Value"
"34fzp3Y8vj9LnQmtgNeraDGfkqT2rk"
```

#### `domain-finance-creditCardCVV-base`

- Command(s): `finance.creditCardCVV()`
- Preview data:
```csv
"Value"
"463"
```

#### `domain-finance-creditCardIssuer-base`

- Command(s): `finance.creditCardIssuer()`
- Preview data:
```csv
"Value"
"american_express"
```

#### `domain-finance-creditCardNumber-base`

- Command(s): `finance.creditCardNumber()`
- Preview data:
```csv
"Value"
"3529-6738-8179-4135"
```

#### `domain-finance-creditCardNumber-arg-issuer`

- Command(s): `finance.creditCardNumber(issuer="finance-creditCardNumber-issuer")`
- Preview data:
```csv
"Value"
"3044-612107-9965"
```

#### `domain-finance-currencyCode-base`

- Command(s): `finance.currencyCode()`
- Preview data:
```csv
"Value"
"LBP"
```

#### `domain-finance-currencyName-base`

- Command(s): `finance.currencyName()`
- Preview data:
```csv
"Value"
"Cedi"
```

#### `domain-finance-currencyNumericCode-base`

- Command(s): `finance.currencyNumericCode()`
- Preview data:
```csv
"Value"
"934"
```

#### `domain-finance-currencySymbol-base`

- Command(s): `finance.currencySymbol()`
- Preview data:
```csv
"Value"
"₴"
```

#### `domain-finance-ethereumAddress-base`

- Command(s): `finance.ethereumAddress()`
- Preview data:
```csv
"Value"
"0x05a9f11aa9ac6713b564dc821edb1cee4ea9bb33"
```

#### `domain-finance-iban-base`

- Command(s): `finance.iban()`
- Preview data:
```csv
"Value"
"LV80HNUZ1327310107987"
```

#### `domain-finance-iban-arg-countryCode`

- Command(s): `finance.iban(countryCode="GB")`
- Preview data:
```csv
"Value"
"GB93ZCOC36631779090042"
```

#### `domain-finance-iban-arg-formatted`

- Command(s): `finance.iban(formatted=true)`
- Preview data:
```csv
"Value"
"FI75 6537 4040 0859 87"
```

#### `domain-finance-iban-pair-countryCode-formatted`

- Command(s): `finance.iban(countryCode="GB", formatted=true)`
- Preview data:
```csv
"Value"
"GB63 QSMG 1465 6277 3690 20"
```

#### `domain-finance-litecoinAddress-base`

- Command(s): `finance.litecoinAddress()`
- Preview data:
```csv
"Value"
"387GmSW4s1E1t16xYaNCi9zgLtV5cDM"
```

#### `domain-finance-maskedNumber-base`

- Command(s): `finance.maskedNumber()`
- Preview data:
```csv
"Value"
"(...1483)"
```

#### `domain-finance-maskedNumber-arg-length`

- Command(s): `finance.maskedNumber(length=4)`
- Preview data:
```csv
"Value"
"(...7138)"
```

#### `domain-finance-pin-base`

- Command(s): `finance.pin()`
- Preview data:
```csv
"Value"
"2035"
```

#### `domain-finance-pin-arg-length`

- Command(s): `finance.pin(length=4)`
- Preview data:
```csv
"Value"
"1155"
```

#### `domain-finance-routingNumber-base`

- Command(s): `finance.routingNumber()`
- Preview data:
```csv
"Value"
"960542158"
```

#### `domain-finance-transactionDescription-base`

- Command(s): `finance.transactionDescription()`
- Preview data:
```csv
"Value"
"payment processed at Ullrich LLC for PKR 490.00, using card ending ****1272. Account: ***8641."
```

#### `domain-finance-transactionType-base`

- Command(s): `finance.transactionType()`
- Preview data:
```csv
"Value"
"withdrawal"
```

#### `domain-food-adjective-base`

- Command(s): `food.adjective()`
- Preview data:
```csv
"Value"
"fluffy"
```

#### `domain-food-description-base`

- Command(s): `food.description()`
- Preview data:
```csv
"Value"
"A classic pie filled with delicious venison and crunchy purple rice, baked in a smoky pastry crust and topped with a golden-brown lattice."
```

#### `domain-food-dish-base`

- Command(s): `food.dish()`
- Preview data:
```csv
"Value"
"Passionfruit Pie"
```

#### `domain-food-ethnicCategory-base`

- Command(s): `food.ethnicCategory()`
- Preview data:
```csv
"Value"
"Belarusian"
```

#### `domain-food-fruit-base`

- Command(s): `food.fruit()`
- Preview data:
```csv
"Value"
"grape"
```

#### `domain-food-ingredient-base`

- Command(s): `food.ingredient()`
- Preview data:
```csv
"Value"
"bonza"
```

#### `domain-food-meat-base`

- Command(s): `food.meat()`
- Preview data:
```csv
"Value"
"crocodile"
```

#### `domain-food-spice-base`

- Command(s): `food.spice()`
- Preview data:
```csv
"Value"
"achiote seed"
```

#### `domain-food-vegetable-base`

- Command(s): `food.vegetable()`
- Preview data:
```csv
"Value"
"lettuce"
```

#### `domain-git-branch-base`

- Command(s): `git.branch()`
- Preview data:
```csv
"Value"
"array-input"
```

#### `domain-git-commitDate-base`

- Command(s): `git.commitDate()`
- Preview data:
```csv
"Value"
"Fri Jun 12 09:20:22 2026 -0700"
```

#### `domain-git-commitEntry-base`

- Command(s): `git.commitEntry()`
- Preview data:
```csv
"Value"
"commit 7738bbde748c2e27e1520b9bf8bb637a48e2feaa
Author: Josie Russel <Josie.Russel95@yahoo.com>
Date: Fri Jun 12 10:05:38 2026 +0700

    transmit solid state protocol
"
```

#### `domain-git-commitMessage-base`

- Command(s): `git.commitMessage()`
- Preview data:
```csv
"Value"
"program multi-byte alarm"
```

#### `domain-git-commitSha-base`

- Command(s): `git.commitSha()`
- Preview data:
```csv
"Value"
"aa5bda8d6f6a71fed1ccffd89a4ea33d4ec21e7e"
```

#### `domain-hacker-abbreviation-base`

- Command(s): `hacker.abbreviation()`
- Preview data:
```csv
"Value"
"UDP"
```

#### `domain-hacker-adjective-base`

- Command(s): `hacker.adjective()`
- Preview data:
```csv
"Value"
"solid state"
```

#### `domain-hacker-ingverb-base`

- Command(s): `hacker.ingverb()`
- Preview data:
```csv
"Value"
"bypassing"
```

#### `domain-hacker-noun-base`

- Command(s): `hacker.noun()`
- Preview data:
```csv
"Value"
"card"
```

#### `domain-hacker-phrase-base`

- Command(s): `hacker.phrase()`
- Preview data:
```csv
"Value"
"compressing the array won't do anything, we need to bypass the cross-platform PCI alarm!"
```

#### `domain-hacker-verb-base`

- Command(s): `hacker.verb()`
- Preview data:
```csv
"Value"
"calculate"
```

#### `domain-image-avatar-base`

- Command(s): `image.avatar()`
- Preview data:
```csv
"Value"
"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/20.jpg"
```

#### `domain-image-avatarGitHub-base`

- Command(s): `image.avatarGitHub()`
- Preview data:
```csv
"Value"
"https://avatars.githubusercontent.com/u/16590067"
```

#### `domain-image-avatarLegacy-base`

- Command(s): `image.avatarLegacy()`
- Preview data:
```csv
"Value"
"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/8.jpg"
```

#### `domain-image-dataUri-base`

- Command(s): `image.dataUri()`
- Preview data:
```csv
"Value"
"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%222476%22%20height%3D%223320%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23db2805%22%2F%3E%3Ctext%20x%3D%221238%22%20y%3D%221660%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E2476x3320%3C%2Ftext%3E%3C%2Fsvg%3E"
```

#### `domain-image-personPortrait-base`

- Command(s): `image.personPortrait()`
- Preview data:
```csv
"Value"
"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/96.jpg"
```

#### `domain-image-url-base`

- Command(s): `image.url()`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3937/617?lock=3931926876699204"
```

#### `domain-image-url-arg-height`

- Command(s): `image.url(height=2)`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3193/2?lock=3191839961479511"
```

#### `domain-image-url-arg-width`

- Command(s): `image.url(width=3)`
- Preview data:
```csv
"Value"
"https://picsum.photos/seed/3UIYDPaNWB/3/984"
```

#### `domain-image-url-pair-height-width`

- Command(s): `image.url(height=2, width=3)`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3/2?lock=7146576591433292"
```

#### `domain-image-urlLoremFlickr-base`

- Command(s): `image.urlLoremFlickr()`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3481/2017?lock=3236073595510946"
```

#### `domain-image-urlPicsumPhotos-base`

- Command(s): `image.urlPicsumPhotos()`
- Preview data:
```csv
"Value"
"https://picsum.photos/seed/s9gojEHeQ/1634/3581?grayscale&blur=1"
```

#### `domain-image-urlPlaceholder-base`

- Command(s): `image.urlPlaceholder()`
- Preview data:
```csv
"Value"
"https://via.placeholder.com/3214x1881/defd36/91bc2c.jpg?text=comedo%20vespillo%20venio"
```

#### `domain-internet-color-base`

- Command(s): `internet.color()`
- Preview data:
```csv
"Value"
"#2f0204"
```

#### `domain-internet-displayName-base`

- Command(s): `internet.displayName()`
- Preview data:
```csv
"Value"
"Demetrius.Kuhlman"
```

#### `domain-internet-domainName-base`

- Command(s): `internet.domainName()`
- Preview data:
```csv
"Value"
"french-tuber.org"
```

#### `domain-internet-domainSuffix-base`

- Command(s): `internet.domainSuffix()`
- Preview data:
```csv
"Value"
"name"
```

#### `domain-internet-domainWord-base`

- Command(s): `internet.domainWord()`
- Preview data:
```csv
"Value"
"pure-alb"
```

#### `domain-internet-email-base`

- Command(s): `internet.email()`
- Preview data:
```csv
"Value"
"Brian42@yahoo.com"
```

#### `domain-internet-email-arg-allowSpecialCharacters`

- Command(s): `internet.email(allowSpecialCharacters=true)`
- Preview data:
```csv
"Value"
"Brant=Abernathy@hotmail.com"
```

#### `domain-internet-email-arg-firstName`

- Command(s): `internet.email(firstName="Ada")`
- Preview data:
```csv
"Value"
"Ada.Schumm@gmail.com"
```

#### `domain-internet-email-arg-lastName`

- Command(s): `internet.email(lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Gavin.Lovelace62@yahoo.com"
```

#### `domain-internet-email-arg-provider`

- Command(s): `internet.email(provider="example.com")`
- Preview data:
```csv
"Value"
"Viola.Torphy@example.com"
```

#### `domain-internet-email-pair-allowSpecialCharacters-firstName`

- Command(s): `internet.email(allowSpecialCharacters=true, firstName="Ada")`
- Preview data:
```csv
"Value"
"Ada93@hotmail.com"
```

#### `domain-internet-email-pair-firstName-lastName`

- Command(s): `internet.email(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Ada.Lovelace55@yahoo.com"
```

#### `domain-internet-email-pair-lastName-provider`

- Command(s): `internet.email(lastName="Lovelace", provider="example.com")`
- Preview data:
```csv
"Value"
"Euna.Lovelace@example.com"
```

#### `domain-internet-emoji-base`

- Command(s): `internet.emoji()`
- Preview data:
```csv
"Value"
"🐆"
```

#### `domain-internet-emoji-arg-types`

- Command(s): `internet.emoji(types=["food"])`
- Preview data:
```csv
"Value"
"🫑"
```

#### `domain-internet-exampleEmail-base`

- Command(s): `internet.exampleEmail()`
- Preview data:
```csv
"Value"
"Hulda5@example.org"
```

#### `domain-internet-httpMethod-base`

- Command(s): `internet.httpMethod()`
- Preview data:
```csv
"Value"
"PATCH"
```

#### `domain-internet-httpStatusCode-base`

- Command(s): `internet.httpStatusCode()`
- Preview data:
```csv
"Value"
"401"
```

#### `domain-internet-ip-base`

- Command(s): `internet.ip()`
- Preview data:
```csv
"Value"
"229.141.100.182"
```

#### `domain-internet-ipv4-base`

- Command(s): `internet.ipv4()`
- Preview data:
```csv
"Value"
"52.210.222.85"
```

#### `domain-internet-ipv4-arg-cidrBlock`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24")`
- Preview data:
```csv
"Value"
"192.168.0.68"
```

#### `domain-internet-ipv4-arg-network`

- Command(s): `internet.ipv4(network="private-a")`
- Preview data:
```csv
"Value"
"10.77.209.214"
```

#### `domain-internet-ipv4-pair-cidrBlock-network`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24", network="private-a")`
- Preview data:
```csv
"Value"
"192.168.0.45"
```

#### `domain-internet-ipv6-base`

- Command(s): `internet.ipv6()`
- Preview data:
```csv
"Value"
"ff36:bc8e:3eea:4c8e:ac0b:50a2:fc4a:dbcf"
```

#### `domain-internet-jwt-base`

- Command(s): `internet.jwt()`
- Preview data:
```csv
"Value"
"eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODEyNTQ2OTEsImV4cCI6MTc4MTMxMDc3MiwibmJmIjoxNzc4MDQ1NzczLCJpc3MiOiJTYXR0ZXJmaWVsZCBHcm91cCIsInN1YiI6IjYxMzIwNjNhLTE5MjktNDkwZi1iNWNhLTM2MWU2NmM1MmRkNCIsImF1ZCI6IjQwNjEwNWNkLTE2MjgtNDA4Yi1iN2EyLWQ2NmM1M2Y3NGFiNSIsImp0aSI6IjU4YmNiMzdkLTRkOGEtNGYyZS04ZDNmLTQyMGM4MGExNGMwNCJ9.MLGSLGF7hNjp6RghVgC2GZIDrfHAZBBIZ8WaqXFphTbyRPkIFKnEnnSToLoWkvDw"
```

#### `domain-internet-jwt-arg-header`

- Command(s): `internet.jwt(header={})`
- Preview data:
```csv
"Value"
"e30.eyJpYXQiOjE3ODEyNjQzOTcsImV4cCI6MTc4MTI4Njg0OSwibmJmIjoxNzg3NjA3MTY2LCJpc3MiOiJGYWhleSwgS2lobiBhbmQgUmVpY2hlcnQiLCJzdWIiOiIxYzQyMmU2ZS1lNzcxLTRmMDAtYmU3OS02NzAwNGViZjg1OGYiLCJhdWQiOiI5MmY3OTFiMy0wYTI5LTQ4ZjItOWUxZS00MGU1Yzk2NTkzYWQiLCJqdGkiOiJkNzk2YzA3Yy0zNjRmLTQzNjgtYWJhZS00N2M3NTExODk4MWEifQ.e8QhcTHj4nBTF2jK53PylJjqBpYeMf9N0oMfTsbM6jKYhngnf0HuiaRiyjUW5TWk"
```

#### `domain-internet-jwt-arg-payload`

- Command(s): `internet.jwt(payload={})`
- Preview data:
```csv
"Value"
"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.e30.bzBMPPc25eqL3Wz5ty1xLOmqFcQ5UhbkK5Bz27pZJGMImquk9U1G93TTIT78S0Li"
```

#### `domain-internet-jwt-arg-refDate`

- Command(s): `internet.jwt(refDate=4)`
- Preview data:
```csv
"Value"
"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0xMTYxMCwiZXhwIjo2OTYyMSwibmJmIjozMTE3NTUyMywiaXNzIjoiU2lwZXMsIEJhdHogYW5kIExvd2UiLCJzdWIiOiIxZWVhZGYwNC0zMDQ2LTRkYmItOWVhNC0yMGY1Zjg5N2Y2YWQiLCJhdWQiOiI2ZmJhMDFiYS0yMWY0LTRlZTQtYmVlZC1iZjA2MDlhMTNkMzAiLCJqdGkiOiI0NDFlMWI4ZC00MmFhLTQzM2UtODA0Ni05YmNiZmFjY2ZjZGIifQ.ShTkX7nPtnWynmGL3sA1GZzI2AzKj6Mj3LgvWpTuDw2z02aONYVFT1gwYoVsPPH4"
```

#### `domain-internet-jwt-pair-header-payload`

- Command(s): `internet.jwt(header={}, payload={})`
- Preview data:
```csv
"Value"
"e30.e30.O604I0hDV1mFaT0FXBy2U9vHZNugne9xahCoN7ydkh96jHDR36zV9TDxv6yQjGqM"
```

#### `domain-internet-jwt-pair-payload-refDate`

- Command(s): `internet.jwt(payload={}, refDate=4)`
- Preview data:
```csv
"Value"
"eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.e30.cqMtfsjVRe4taxGy1S7uH1KOAlSBZSXQoKXttlGA5b8LcMBlMXhYYMZxt7ED45qV"
```

#### `domain-internet-jwtAlgorithm-base`

- Command(s): `internet.jwtAlgorithm()`
- Preview data:
```csv
"Value"
"ES256"
```

#### `domain-internet-mac-base`

- Command(s): `internet.mac()`
- Preview data:
```csv
"Value"
"45:11:8d:5b:a6:32"
```

#### `domain-internet-mac-arg-separator`

- Command(s): `internet.mac(separator="-")`
- Preview data:
```csv
"Value"
"c0-c3-a3-5e-ef-da"
```

#### `domain-internet-password-base`

- Command(s): `internet.password()`
- Preview data:
```csv
"Value"
"TBoqXmfYfXk3I3A"
```

#### `domain-internet-password-example-1`

- Command(s): `internet.password(length=10, memorable=false, pattern="[A-Za-z0-9]", prefix="#")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"#wMJJrPMVo"
```

#### `domain-internet-password-arg-length`

- Command(s): `internet.password(length=12)`
- Preview data:
```csv
"Value"
"hzyT0010JBYb"
```

#### `domain-internet-password-arg-memorable`

- Command(s): `internet.password(memorable=true)`
- Preview data:
```csv
"Value"
"zapeboqulewufuf"
```

#### `domain-internet-password-arg-pattern`

- Command(s): `internet.password(pattern="[A-Z]")`
- Preview data:
```csv
"Value"
"BVSNRUBNEAWUTJT"
```

#### `domain-internet-password-arg-prefix`

- Command(s): `internet.password(prefix="#")`
- Preview data:
```csv
"Value"
"#xxsm9CX1flFshv"
```

#### `domain-internet-password-pair-length-memorable`

- Command(s): `internet.password(length=12, memorable=true)`
- Preview data:
```csv
"Value"
"jecotucenedo"
```

#### `domain-internet-password-pair-memorable-pattern`

- Command(s): `internet.password(memorable=true, pattern="[A-Z]")`
- Preview data:
```csv
"Value"
"nomudolunexolec"
```

#### `domain-internet-password-pair-pattern-prefix`

- Command(s): `internet.password(pattern="[A-Z]", prefix="#")`
- Preview data:
```csv
"Value"
"#EXCEEXMTTHRSHT"
```

#### `domain-internet-port-base`

- Command(s): `internet.port()`
- Preview data:
```csv
"Value"
"63399"
```

#### `domain-internet-protocol-base`

- Command(s): `internet.protocol()`
- Preview data:
```csv
"Value"
"http"
```

#### `domain-internet-url-base`

- Command(s): `internet.url()`
- Preview data:
```csv
"Value"
"https://grave-overheard.org"
```

#### `domain-internet-url-arg-appendSlash`

- Command(s): `internet.url(appendSlash=true)`
- Preview data:
```csv
"Value"
"https://pleasing-scrap.biz/"
```

#### `domain-internet-url-arg-protocol`

- Command(s): `internet.url(protocol="https")`
- Preview data:
```csv
"Value"
"https://zealous-flat.net"
```

#### `domain-internet-url-pair-appendSlash-protocol`

- Command(s): `internet.url(appendSlash=true, protocol="https")`
- Preview data:
```csv
"Value"
"https://good-natured-hovel.info/"
```

#### `domain-internet-userAgent-base`

- Command(s): `internet.userAgent()`
- Preview data:
```csv
"Value"
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/560.22 (KHTML, like Gecko) Chrome/100.9.0.1 Safari/555.7 Edg/113.8.7.15"
```

#### `domain-internet-username-base`

- Command(s): `internet.username()`
- Preview data:
```csv
"Value"
"Kailey2"
```

#### `domain-internet-username-arg-firstName`

- Command(s): `internet.username(firstName="Ada")`
- Preview data:
```csv
"Value"
"Ada_Bode"
```

#### `domain-internet-username-arg-lastName`

- Command(s): `internet.username(lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Dallin.Lovelace"
```

#### `domain-internet-username-pair-firstName-lastName`

- Command(s): `internet.username(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Ada.Lovelace"
```

#### `domain-internet-userName-base`

- Command(s): `internet.userName()`
- Preview data:
```csv
"Value"
"Marlee30"
```

#### `domain-literal-value-base`

- Command(s): `literal.value()`
- Preview data:
```csv
"Value"
""
```

#### `domain-literal-value-example-1`

- Command(s): `literal.value("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Pending"
```

#### `domain-literal-value-example-2`

- Command(s): `literal.value("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
""
```

#### `domain-literal-value-arg-value`

- Command(s): `literal.value(value=true)`
- Preview data:
```csv
"Value"
"true"
```

#### `domain-location-buildingNumber-base`

- Command(s): `location.buildingNumber()`
- Preview data:
```csv
"Value"
"86561"
```

#### `domain-location-cardinalDirection-base`

- Command(s): `location.cardinalDirection()`
- Preview data:
```csv
"Value"
"North"
```

#### `domain-location-city-base`

- Command(s): `location.city()`
- Preview data:
```csv
"Value"
"Antelope"
```

#### `domain-location-continent-base`

- Command(s): `location.continent()`
- Preview data:
```csv
"Value"
"Africa"
```

#### `domain-location-country-base`

- Command(s): `location.country()`
- Preview data:
```csv
"Value"
"Eritrea"
```

#### `domain-location-countryCode-base`

- Command(s): `location.countryCode()`
- Preview data:
```csv
"Value"
"GU"
```

#### `domain-location-county-base`

- Command(s): `location.county()`
- Preview data:
```csv
"Value"
"Cumbria"
```

#### `domain-location-direction-base`

- Command(s): `location.direction()`
- Preview data:
```csv
"Value"
"West"
```

#### `domain-location-direction-arg-abbreviated`

- Command(s): `location.direction(abbreviated=true)`
- Preview data:
```csv
"Value"
"S"
```

#### `domain-location-latitude-base`

- Command(s): `location.latitude()`
- Preview data:
```csv
"Value"
"41.3757"
```

#### `domain-location-latitude-arg-min`

- Command(s): `location.latitude(min=1)`
- Preview data:
```csv
"Value"
"12.2218"
```

#### `domain-location-latitude-arg-max`

- Command(s): `location.latitude(max=3)`
- Preview data:
```csv
"Value"
"-85.9885"
```

#### `domain-location-latitude-arg-precision`

- Command(s): `location.latitude(precision=4)`
- Preview data:
```csv
"Value"
"-16.2319"
```

#### `domain-location-latitude-pair-min-max`

- Command(s): `location.latitude(min=1, max=3)`
- Preview data:
```csv
"Value"
"2.315"
```

#### `domain-location-latitude-pair-max-precision`

- Command(s): `location.latitude(max=3, precision=4)`
- Preview data:
```csv
"Value"
"-52.1397"
```

#### `domain-location-longitude-base`

- Command(s): `location.longitude()`
- Preview data:
```csv
"Value"
"156.4157"
```

#### `domain-location-longitude-arg-min`

- Command(s): `location.longitude(min=1)`
- Preview data:
```csv
"Value"
"26.1188"
```

#### `domain-location-longitude-arg-max`

- Command(s): `location.longitude(max=3)`
- Preview data:
```csv
"Value"
"-68.5071"
```

#### `domain-location-longitude-arg-precision`

- Command(s): `location.longitude(precision=4)`
- Preview data:
```csv
"Value"
"-52.7542"
```

#### `domain-location-longitude-pair-min-max`

- Command(s): `location.longitude(min=1, max=3)`
- Preview data:
```csv
"Value"
"1.1204"
```

#### `domain-location-longitude-pair-max-precision`

- Command(s): `location.longitude(max=3, precision=4)`
- Preview data:
```csv
"Value"
"-134.0996"
```

#### `domain-location-ordinalDirection-base`

- Command(s): `location.ordinalDirection()`
- Preview data:
```csv
"Value"
"Southeast"
```

#### `domain-location-secondaryAddress-base`

- Command(s): `location.secondaryAddress()`
- Preview data:
```csv
"Value"
"Apt. 818"
```

#### `domain-location-state-base`

- Command(s): `location.state()`
- Preview data:
```csv
"Value"
"Michigan"
```

#### `domain-location-state-arg-abbreviated`

- Command(s): `location.state(abbreviated=true)`
- Preview data:
```csv
"Value"
"WI"
```

#### `domain-location-street-base`

- Command(s): `location.street()`
- Preview data:
```csv
"Value"
"Brown Trafficway"
```

#### `domain-location-streetAddress-base`

- Command(s): `location.streetAddress()`
- Preview data:
```csv
"Value"
"428 Grant Walks"
```

#### `domain-location-streetAddress-arg-useFullAddress`

- Command(s): `location.streetAddress(useFullAddress=true)`
- Preview data:
```csv
"Value"
"6267 Euclid Avenue Apt. 758"
```

#### `domain-location-timeZone-base`

- Command(s): `location.timeZone()`
- Preview data:
```csv
"Value"
"America/North_Dakota/Beulah"
```

#### `domain-location-zipCode-base`

- Command(s): `location.zipCode()`
- Preview data:
```csv
"Value"
"86088"
```

#### `domain-lorem-lines-base`

- Command(s): `lorem.lines()`
- Preview data:
```csv
"Value"
"Celo defetiscor magnam chirographum peccatus contigo solium aggredior truculenter.
Optio torqueo vinco.
Tamquam neque repellendus adamo talio valens.
Demonstro crebro circumvenio aggero.
Speciosus demulceo celebrer copiose cunabula caritas ambulo caveo unde."
```

#### `domain-lorem-lines-arg-min`

- Command(s): `lorem.lines(min=1)`
- Preview data:
```csv
"Value"
"Abutor viridis tripudio calculus totam venio blanditiis talio."
```

#### `domain-lorem-lines-arg-max`

- Command(s): `lorem.lines(max=3)`
- Preview data:
```csv
"Value"
"Voluptatem vinum balbus ago.
Audentia utrum tamdiu tersus minima desino uter.
Expedita ducimus numquam sint aegrus vox accommodo amplitudo.
Ager conor adipisci admiratio cicuta id ullus apto ara conitor."
```

#### `domain-lorem-lines-arg-lineCount`

- Command(s): `lorem.lines(lineCount=2)`
- Preview data:
```csv
"Value"
"Comparo celebrer capio.
Nesciunt ipsa acerbitas cilicium thalassinus inflammatio."
```

#### `domain-lorem-lines-arg-lineCountMax`

- Command(s): `lorem.lines(lineCountMax=2)`
- Preview data:
```csv
"Value"
"Commodi civitas peccatus aestus ager nesciunt laboriosam quos.
Acidus ipsum spes nesciunt vulticulus.
Incidunt utor vito supplanto spes dens succurro uter vita.
Coma toties tribuo certe eius calco aperiam calco viridis tantillus.
Creta conforto usitas sol."
```

#### `domain-lorem-lines-arg-lineCountMin`

- Command(s): `lorem.lines(lineCountMin=1)`
- Preview data:
```csv
"Value"
"Calculus valetudo adopto tergeo tyrannus quaerat.
Tergo non conturbo vitae eligendi compono patruus ascit adipiscor.
Vulticulus absum adamo caste cena repellat abbas coadunatio spiculum.
Thymum solutio tamisium viscus quo.
Sint ultra adsum vester tres tametsi."
```

#### `domain-lorem-lines-pair-min-max`

- Command(s): `lorem.lines(min=1, max=3)`
- Preview data:
```csv
"Value"
"Dolore vere conicio suggero demo."
```

#### `domain-lorem-lines-pair-max-lineCount`

- Command(s): `lorem.lines(max=3, lineCount=2)`
- Preview data:
```csv
"Value"
"Aperiam cervus perspiciatis dedico deputo combibo tutis vester quis vigilo."
```

#### `domain-lorem-lines-pair-lineCount-lineCountMax`

- Command(s): `lorem.lines(lineCount=2, lineCountMax=2)`
- Preview data:
```csv
"Value"
"Tres vacuus somnus asper allatus allatus."
```

#### `domain-lorem-lines-pair-lineCountMax-lineCountMin`

- Command(s): `lorem.lines(lineCountMax=2, lineCountMin=1)`
- Preview data:
```csv
"Value"
"Nemo sophismata illo itaque.
Cernuus solutio sed comes degusto suscipio territo civitas."
```

#### `domain-lorem-paragraph-base`

- Command(s): `lorem.paragraph()`
- Preview data:
```csv
"Value"
"Voluptate adopto arguo. Titulus summisse molestiae arx careo patior. Alveus conservo canto succedo demergo cupressus collum amplus cotidie autem."
```

#### `domain-lorem-paragraph-arg-min`

- Command(s): `lorem.paragraph(min=1)`
- Preview data:
```csv
"Value"
"Decerno theatrum crapula utroque crastinus demoror bis."
```

#### `domain-lorem-paragraph-arg-max`

- Command(s): `lorem.paragraph(max=3)`
- Preview data:
```csv
"Value"
"Vulnero deleniti vitae aspicio sapiente. Decumbo voluptate claustrum ascisco angustus thema synagoga. Ad conspergo adfectus casso allatus patior."
```

#### `domain-lorem-paragraph-arg-sentenceCount`

- Command(s): `lorem.paragraph(sentenceCount=4)`
- Preview data:
```csv
"Value"
"Tergeo congregatio tolero. Trepide consuasor censura. Architecto aegrus creptio fugiat atqui delego."
```

#### `domain-lorem-paragraph-arg-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCountMax=5)`
- Preview data:
```csv
"Value"
"Amiculum ambulo depraedor clibanus quae tres coepi complectus creptio. Condico tonsor curatio aggero accusantium utrum demergo. Deripio creo trucido civis despecto."
```

#### `domain-lorem-paragraph-arg-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMin=6)`
- Preview data:
```csv
"Value"
"Alo quod argentum illo cattus decretum. Tenuis nemo conor campana bardus collum sint. Benevolentia sui sint tripudio conicio."
```

#### `domain-lorem-paragraph-pair-min-max`

- Command(s): `lorem.paragraph(min=1, max=3)`
- Preview data:
```csv
"Value"
"Labore labore torrens vesco tumultus attollo canto canonicus cupiditate."
```

#### `domain-lorem-paragraph-pair-max-sentenceCount`

- Command(s): `lorem.paragraph(max=3, sentenceCount=4)`
- Preview data:
```csv
"Value"
"Repellendus aperiam textilis claro volubilis voluptas sophismata veritas tibi umerus. Ultio deleniti voco audacia depulso astrum inflammatio vulnus. Occaecati tactus titulus vel communis."
```

#### `domain-lorem-paragraph-pair-sentenceCount-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCount=4, sentenceCountMax=5)`
- Preview data:
```csv
"Value"
"Tandem victus repellendus varius distinctio cur varietas video. Totus occaecati bene est vacuus versus. Voluptate crustulum adhuc artificiose libero super aperte labore peior laborum."
```

#### `domain-lorem-paragraph-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMax=5, sentenceCountMin=6)`
- Preview data:
```csv
"Value"
"Quas tonsor ambulo tum. Ascit aggredior crepusculum quis constans articulus corona adiuvo. Thesis amita video solium ultra exercitationem."
```

#### `domain-lorem-paragraphs-base`

- Command(s): `lorem.paragraphs()`
- Preview data:
```csv
"Value"
"Tandem surgo ulterius defero aut veniam communis. Porro claro conturbo urbs aestivus cognomen advenio aureus sulum collum. Tertius apud bonus ara fugit totam tempora veritas.
Adduco congregatio crinis nam ascit tabernus cupiditate curo. Curso cohibeo nesciunt alioqui vilitas. Cubo aspicio abutor corporis tergiversatio tam adaugeo.
Defendo tergo spectaculum. Caries laborum spes solitudo aestivus. Curvo comparo rem."
```

#### `domain-lorem-paragraphs-arg-min`

- Command(s): `lorem.paragraphs(min=1)`
- Preview data:
```csv
"Value"
"Arca deprimo confugo amplexus arcus vulnus vester titulus super suffoco. Cruentus debilito adulatio audacia vicinus pax attonbitus delicate cuius. Arbustum demens doloribus dolor."
```

#### `domain-lorem-paragraphs-arg-max`

- Command(s): `lorem.paragraphs(max=3)`
- Preview data:
```csv
"Value"
"Cogo decet adflicto sumptus ut. Amo sustineo creta templum. Sapiente creator non decipio comes comminor aro aliquid curso.3Amplitudo et aliqua solitudo cruciamentum atque versus sustineo audacia credo. Alias decipio demens nemo speciosus absens ustilo vinco. Cetera impedit despecto apto.3Viriliter denuo thymbra curiositas vomito rerum canonicus amplitudo. Comprehendo bestia ambulo aranea adipiscor temperantia amaritudo culpo curia addo. Ex pax canonicus statua sperno adfero copia vulgaris videlicet."
```

#### `domain-lorem-paragraphs-arg-paragraphCount`

- Command(s): `lorem.paragraphs(paragraphCount=4)`
- Preview data:
```csv
"Value"
"Avaritia decor odio alienus aliquid confido delectus. Curriculum angelus cubo vulgaris crustulum vinco canonicus ventito. Patruus depulso venio addo.
Usitas ipsum comitatus accusator angulus tibi cubitum. Adicio debeo dedecor comitatus comminor aut succedo conor tandem. Cruciamentum tutamen tui angelus totidem deserunt decipio.
Cohors complectus chirographum aiunt bibo condico appono cornu censura. Consequuntur tres sponte caute. Colo ea nostrum vehemens alius molestias victus."
```

#### `domain-lorem-paragraphs-arg-separator`

- Command(s): `lorem.paragraphs(separator="-")`
- Preview data:
```csv
"Value"
"Auxilium capto volva arca perspiciatis. Quod odio cum turpis ascisco culpa sed consequuntur cogo. Tracto ademptio quas sufficio decet tempora utrum.
Cuppedia aegrus defluo vociferor venia. Cresco odit contigo vinco pectus vinum vapulus. Victoria bestia claustrum decretum benevolentia soleo.
Patruus vorax cariosus laboriosam. Defleo vox textor desipio voluptas apostolus caelum. Claustrum cometes talio super placeat aut."
```

#### `domain-lorem-paragraphs-arg-paragraphCountMax`

- Command(s): `lorem.paragraphs(paragraphCountMax=6)`
- Preview data:
```csv
"Value"
"Varius averto adeptio vestigium versus acerbitas peccatus fugit. Tam cunctatio crebro demitto corrumpo. Conicio vester utroque ascit ab unde quidem.
Tonsor adstringo sollers validus acceptus sumo vel totus vulariter. Assentator carbo amo suppellex crapula decor. Tenax defluo appono vix vulnero bos utpote.
Sophismata angustus alveus eveniet ventito. Theatrum somnus conduco sublime. Corrupti benigne uberrime aegrotatio cursus suscipit."
```

#### `domain-lorem-paragraphs-arg-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMin=7)`
- Preview data:
```csv
"Value"
"Strues aeneus debilito pectus capto perferendis antiquus doloremque placeat acsi. Advoco ventosus suus collum thymum truculenter beneficium ratione cruciamentum. Coniecto valens terreo.
Decens ara cubitum. Deinde adamo communis summopere placeat. Complectus amor suasoria vigor.
Arca aro vinculum. Synagoga alias tracto ars conforto crudelis solitudo ascisco. Ventosus circumvenio concido versus via arbustum maiores thymbra."
```

#### `domain-lorem-paragraphs-pair-min-max`

- Command(s): `lorem.paragraphs(min=1, max=3)`
- Preview data:
```csv
"Value"
"Arbitro aequus turbo cur coerceo bestia acer facilis. Collum ut varietas chirographum pecto coadunatio. Pariatur derelinquo solus rem tempus arcus necessitatibus validus voluptate."
```

#### `domain-lorem-paragraphs-pair-max-paragraphCount`

- Command(s): `lorem.paragraphs(max=3, paragraphCount=4)`
- Preview data:
```csv
"Value"
"Sopor collum suus. Thalassinus speculum ut. Audeo beneficium arx repellat teres creator numquam carmen.3Velum cubitum aranea surculus arceo centum tantillus cumque. Defero capto demo summisse sto venio stultus adnuo derelinquo. Crepusculum acer tantum vulgo.3Sufficio accendo compono arcesso voluptates surculus demulceo. Denuncio tantum tertius angustus. Distinctio delectus iste pariatur."
```

#### `domain-lorem-paragraphs-pair-paragraphCount-separator`

- Command(s): `lorem.paragraphs(paragraphCount=4, separator="-")`
- Preview data:
```csv
"Value"
"Culpo arcesso voluptatum antiquus suscipit. Vestrum nam advenio aer tabula tondeo expedita eaque. Odio decretum tunc sint volubilis casus reprehenderit odio nulla.
Addo consectetur fugit vesica spectaculum sperno curo alveus. Velit odio aegrus amplexus. Ancilla ubi congregatio stabilis.
Spoliatio taceo deporto temporibus adfectus ipsum. Cum tyrannus adhuc totam. Illo vae uredo sursum carbo absorbeo admoveo valeo titulus strues."
```

#### `domain-lorem-paragraphs-pair-separator-paragraphCountMax`

- Command(s): `lorem.paragraphs(separator="-", paragraphCountMax=6)`
- Preview data:
```csv
"Value"
"Aiunt amicitia animus decimus. Temeritas quis nemo. Tibi ubi optio absconditus aufero.
Careo volubilis arbitro. Accendo crapula desino canto odit doloribus valde libero debeo turpis. Aiunt crux virgo recusandae alveus vinitor speciosus unde abbas acidus.
Velut conicio temptatio armarium sint aspicio apostolus. Tolero claudeo congregatio credo vis ulterius. Repellendus consequatur molestiae avaritia sursum comptus carcer aperio."
```

#### `domain-lorem-paragraphs-pair-paragraphCountMax-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMax=6, paragraphCountMin=7)`
- Preview data:
```csv
"Value"
"Color crur suffragium veniam voluptas. Commodi angelus molestias suppono asper ait eum thymbra synagoga. Magnam utpote asper stips.
Veritas clamo coaegresco verus. Aveho blanditiis campana debeo vinum. Cito amitto speciosus caterva a comitatus volo.
Absorbeo canonicus acquiro subnecto vito vacuus. Eveniet arcus appono viriliter supplanto sollicito temporibus super. Exercitationem paens nulla abutor beatus quia defendo autus argumentum temeritas."
```

#### `domain-lorem-sentence-base`

- Command(s): `lorem.sentence()`
- Preview data:
```csv
"Value"
"Thymum curo rerum utrum."
```

#### `domain-lorem-sentence-arg-min`

- Command(s): `lorem.sentence(min=1)`
- Preview data:
```csv
"Value"
"Appello."
```

#### `domain-lorem-sentence-arg-max`

- Command(s): `lorem.sentence(max=3)`
- Preview data:
```csv
"Value"
"Ter textus admoneo acceptus deripio ullam succedo clam odit succurro."
```

#### `domain-lorem-sentence-arg-wordCount`

- Command(s): `lorem.sentence(wordCount=4)`
- Preview data:
```csv
"Value"
"Voluptas despecto admoneo aestivus auxilium adhuc aegre dicta."
```

#### `domain-lorem-sentence-arg-wordCountMax`

- Command(s): `lorem.sentence(wordCountMax=5)`
- Preview data:
```csv
"Value"
"Vivo accendo sint placeat supellex amoveo damnatio aegre."
```

#### `domain-lorem-sentence-arg-wordCountMin`

- Command(s): `lorem.sentence(wordCountMin=6)`
- Preview data:
```csv
"Value"
"Denuo torqueo id cohibeo deludo depono truculenter delectatio tolero."
```

#### `domain-lorem-sentence-pair-min-max`

- Command(s): `lorem.sentence(min=1, max=3)`
- Preview data:
```csv
"Value"
"Summa."
```

#### `domain-lorem-sentence-pair-max-wordCount`

- Command(s): `lorem.sentence(max=3, wordCount=4)`
- Preview data:
```csv
"Value"
"Civis reprehenderit tripudio."
```

#### `domain-lorem-sentence-pair-wordCount-wordCountMax`

- Command(s): `lorem.sentence(wordCount=4, wordCountMax=5)`
- Preview data:
```csv
"Value"
"Tego vilitas assumenda desidero."
```

#### `domain-lorem-sentence-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.sentence(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv
"Value"
"Pecto sequi accommodo aegrotatio."
```

#### `domain-lorem-sentences-base`

- Command(s): `lorem.sentences()`
- Preview data:
```csv
"Value"
"Virgo blandior adflicto. Adeo vos sortitus conventus ventito. Arca defessus tres argumentum amissio."
```

#### `domain-lorem-sentences-arg-min`

- Command(s): `lorem.sentences(min=1)`
- Preview data:
```csv
"Value"
"Ullam coruscus alienus avaritia vulnero."
```

#### `domain-lorem-sentences-arg-max`

- Command(s): `lorem.sentences(max=3)`
- Preview data:
```csv
"Value"
"Officiis angustus assentator cur sit.3Totam utilis tergiversatio clibanus auditor cunabula cena.3Umquam deporto caelum.3Vomito consequuntur soleo voluptates tamisium textilis deprecator absque ambitus demo.3Depono cunae tergum spectaculum quia expedita.3Thalassinus tyrannus molestias bellicus."
```

#### `domain-lorem-sentences-arg-sentenceCount`

- Command(s): `lorem.sentences(sentenceCount=4)`
- Preview data:
```csv
"Value"
"Vilis valens vacuus theatrum excepturi cras conservo vinculum. Termes antiquus aggero deserunt. Artificiose aestivus audax doloremque basium."
```

#### `domain-lorem-sentences-arg-separator`

- Command(s): `lorem.sentences(separator="-")`
- Preview data:
```csv
"Value"
"Virgo cibus tres speculum vacuus omnis talio comprehendo earum. Demens ambitus minima advenio abeo. Usitas surculus veniam atrox carcer thorax corona. Taceo bos solutio tamquam admoveo villa cognomen tertius placeat. Causa alo bellum vestigium video ademptio vomica. Crudelis consectetur spectaculum tempus ullam."
```

#### `domain-lorem-sentences-arg-sentenceCountMax`

- Command(s): `lorem.sentences(sentenceCountMax=6)`
- Preview data:
```csv
"Value"
"Nemo ciminatio coruscus cognomen cum uredo adsidue sodalitas stipes cometes. Acerbitas turpis terebro sodalitas colligo deputo. Thermae truculenter absorbeo textor tyrannus arbustum debeo. Ducimus antepono solium arca tergo celebrer torqueo. Toties vesco cras stabilis tamisium infit summa beatus sublime coerceo."
```

#### `domain-lorem-sentences-arg-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMin=7)`
- Preview data:
```csv
"Value"
"Beneficium vita viduo clementia. Exercitationem tergiversatio appello. Commodi harum validus surculus venio enim cultellus claudeo. Illo tot trucido thymbra teneo laudantium sopor autem. Verbera amitto tertius vomito subseco tertius. Subvenio charisma velut."
```

#### `domain-lorem-sentences-pair-min-max`

- Command(s): `lorem.sentences(min=1, max=3)`
- Preview data:
```csv
"Value"
"Aedificium amo demum vicinus tribuo."
```

#### `domain-lorem-sentences-pair-max-sentenceCount`

- Command(s): `lorem.sentences(max=3, sentenceCount=4)`
- Preview data:
```csv
"Value"
"Caute carcer sumo textor.3Cariosus denuncio nostrum depulso pecto ad aduro.3Utilis defero tardus aequus taceo angustus beneficium carcer voluptatem volaticus.3Cras abbas avaritia."
```

#### `domain-lorem-sentences-pair-sentenceCount-separator`

- Command(s): `lorem.sentences(sentenceCount=4, separator="-")`
- Preview data:
```csv
"Value"
"Atrocitas arbitro desidero torrens atqui despecto vito dolore. Arto sol tendo. Adeo triduana facilis cum laboriosam amicitia. Voluptas surculus tabernus voluptatibus victus."
```

#### `domain-lorem-sentences-pair-separator-sentenceCountMax`

- Command(s): `lorem.sentences(separator="-", sentenceCountMax=6)`
- Preview data:
```csv
"Value"
"Cattus animadverto urbs utrimque subiungo sint vulgivagus conqueror nostrum. Cibo coma adsidue aequus virtus considero dolore aetas commodo officia. Atavus adsuesco eaque degusto. Tepidus supellex attonbitus. Accommodo summopere iusto celo vivo amor vivo quidem."
```

#### `domain-lorem-sentences-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMax=6, sentenceCountMin=7)`
- Preview data:
```csv
"Value"
"Carmen bestia angelus tergiversatio cunabula assumenda terror tamisium sed alias. Perferendis audio odit facere. Canonicus suscipit voluptas. Vito corroboro incidunt recusandae ultra civis repellendus."
```

#### `domain-lorem-slug-base`

- Command(s): `lorem.slug()`
- Preview data:
```csv
"Value"
"vacuus-arcesso-volva"
```

#### `domain-lorem-slug-arg-min`

- Command(s): `lorem.slug(min=1)`
- Preview data:
```csv
"Value"
"vociferor"
```

#### `domain-lorem-slug-arg-max`

- Command(s): `lorem.slug(max=3)`
- Preview data:
```csv
"Value"
"assumenda-nam-capillus"
```

#### `domain-lorem-slug-arg-wordCount`

- Command(s): `lorem.slug(wordCount=4)`
- Preview data:
```csv
"Value"
"vulariter-est-antea"
```

#### `domain-lorem-slug-arg-wordCountMax`

- Command(s): `lorem.slug(wordCountMax=5)`
- Preview data:
```csv
"Value"
"adipisci-absque-acies"
```

#### `domain-lorem-slug-arg-wordCountMin`

- Command(s): `lorem.slug(wordCountMin=6)`
- Preview data:
```csv
"Value"
"curatio-strenuus-voluntarius"
```

#### `domain-lorem-slug-pair-min-max`

- Command(s): `lorem.slug(min=1, max=3)`
- Preview data:
```csv
"Value"
"advoco"
```

#### `domain-lorem-slug-pair-max-wordCount`

- Command(s): `lorem.slug(max=3, wordCount=4)`
- Preview data:
```csv
"Value"
"comitatus-spiculum-tandem"
```

#### `domain-lorem-slug-pair-wordCount-wordCountMax`

- Command(s): `lorem.slug(wordCount=4, wordCountMax=5)`
- Preview data:
```csv
"Value"
"clarus-dedico-totus"
```

#### `domain-lorem-slug-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.slug(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv
"Value"
"vita-celebrer-adinventitias"
```

#### `domain-lorem-text-base`

- Command(s): `lorem.text()`
- Preview data:
```csv
"Value"
"Calamitas tristis iste consectetur bos sed verbum capitulus. Civitas absorbeo stella cilicium delinquo odit admoneo vinco auctor cui. Adhuc consuasor sui ullus vilis tergum neque contra.
Balbus tempora cura cohibeo angelus corrigo. Audax crebro delinquo demum adfectus ulciscor textilis. Desidero decens ex vae arx curriculum nostrum attollo cervus.
Adicio voluptatibus non aut brevis est sponte arguo iure. Bos confido venustas. Vestigium speculum fuga aggredior suffragium cernuus occaecati super cunae error."
```

#### `domain-lorem-word-base`

- Command(s): `lorem.word()`
- Preview data:
```csv
"Value"
"careo"
```

#### `domain-lorem-word-arg-min`

- Command(s): `lorem.word(min=1)`
- Preview data:
```csv
"Value"
"defluo"
```

#### `domain-lorem-word-arg-max`

- Command(s): `lorem.word(max=3)`
- Preview data:
```csv
"Value"
"voluptates"
```

#### `domain-lorem-word-arg-length`

- Command(s): `lorem.word(length=4)`
- Preview data:
```csv
"Value"
"nemo"
```

#### `domain-lorem-word-arg-strategy`

- Command(s): `lorem.word(strategy="lorem-word-strategy")`
- Preview data:
```csv
"Value"
"id"
```

#### `domain-lorem-word-pair-min-max`

- Command(s): `lorem.word(min=1, max=3)`
- Preview data:
```csv
"Value"
"vero"
```

#### `domain-lorem-word-pair-max-length`

- Command(s): `lorem.word(max=3, length=4)`
- Preview data:
```csv
"Value"
"curo"
```

#### `domain-lorem-word-pair-length-strategy`

- Command(s): `lorem.word(length=4, strategy="lorem-word-strategy")`
- Preview data:
```csv
"Value"
"vito"
```

#### `domain-lorem-words-base`

- Command(s): `lorem.words()`
- Preview data:
```csv
"Value"
"verus voluptates suppellex"
```

#### `domain-lorem-words-arg-min`

- Command(s): `lorem.words(min=1)`
- Preview data:
```csv
"Value"
"tollo"
```

#### `domain-lorem-words-arg-max`

- Command(s): `lorem.words(max=3)`
- Preview data:
```csv
"Value"
"illum triduana deficio"
```

#### `domain-lorem-words-arg-wordCount`

- Command(s): `lorem.words(wordCount=4)`
- Preview data:
```csv
"Value"
"optio cohaero uredo"
```

#### `domain-lorem-words-arg-wordCountMax`

- Command(s): `lorem.words(wordCountMax=5)`
- Preview data:
```csv
"Value"
"texo dolorum spargo"
```

#### `domain-lorem-words-arg-wordCountMin`

- Command(s): `lorem.words(wordCountMin=6)`
- Preview data:
```csv
"Value"
"defero vacuus impedit"
```

#### `domain-lorem-words-pair-min-max`

- Command(s): `lorem.words(min=1, max=3)`
- Preview data:
```csv
"Value"
"cibus"
```

#### `domain-lorem-words-pair-max-wordCount`

- Command(s): `lorem.words(max=3, wordCount=4)`
- Preview data:
```csv
"Value"
"mollitia abeo urbs"
```

#### `domain-lorem-words-pair-wordCount-wordCountMax`

- Command(s): `lorem.words(wordCount=4, wordCountMax=5)`
- Preview data:
```csv
"Value"
"sollicito tondeo et"
```

#### `domain-lorem-words-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.words(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv
"Value"
"depono cedo absum"
```

#### `domain-music-album-base`

- Command(s): `music.album()`
- Preview data:
```csv
"Value"
"Majestic"
```

#### `domain-music-artist-base`

- Command(s): `music.artist()`
- Preview data:
```csv
"Value"
"George Michael"
```

#### `domain-music-genre-base`

- Command(s): `music.genre()`
- Preview data:
```csv
"Value"
"Latin"
```

#### `domain-music-songName-base`

- Command(s): `music.songName()`
- Preview data:
```csv
"Value"
"You've Got a Friend"
```

#### `domain-number-bigInt-base`

- Command(s): `number.bigInt()`
- Preview data:
```csv
"Value"
"571092089829729"
```

#### `domain-number-bigInt-arg-value`

- Command(s): `number.bigInt(value=true)`
- Preview data:
```csv
"Value"
"586349396167377"
```

#### `domain-number-binary-base`

- Command(s): `number.binary()`
- Preview data:
```csv
"Value"
"0"
```

#### `domain-number-binary-arg-max`

- Command(s): `number.binary(max=3)`
- Preview data:
```csv
"Value"
"0"
```

#### `domain-number-binary-arg-min`

- Command(s): `number.binary(min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-binary-pair-max-min`

- Command(s): `number.binary(max=3, min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-float-base`

- Command(s): `number.float()`
- Preview data:
```csv
"Value"
"0.3550653996448585"
```

#### `domain-number-float-arg-fractionDigits`

- Command(s): `number.float(fractionDigits=2)`
- Preview data:
```csv
"Value"
"0.73"
```

#### `domain-number-float-arg-max`

- Command(s): `number.float(max=3)`
- Preview data:
```csv
"Value"
"2.7132336805883557"
```

#### `domain-number-float-arg-min`

- Command(s): `number.float(min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-float-arg-multipleOf`

- Command(s): `number.float(multipleOf=0.5)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-float-pair-fractionDigits-max`

- Command(s): `number.float(fractionDigits=2, max=3)`
- Preview data:
```csv
"Value"
"0.32"
```

#### `domain-number-float-pair-max-min`

- Command(s): `number.float(max=3, min=1)`
- Preview data:
```csv
"Value"
"2.8150852265633652"
```

#### `domain-number-float-pair-min-multipleOf`

- Command(s): `number.float(min=1, multipleOf=0.5)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-hex-base`

- Command(s): `number.hex()`
- Preview data:
```csv
"Value"
"f"
```

#### `domain-number-hex-arg-min`

- Command(s): `number.hex(min=1)`
- Preview data:
```csv
"Value"
"b"
```

#### `domain-number-hex-arg-max`

- Command(s): `number.hex(max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-hex-pair-min-max`

- Command(s): `number.hex(min=1, max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-int-base`

- Command(s): `number.int()`
- Preview data:
```csv
"Value"
"1105340026189529"
```

#### `domain-number-int-arg-min`

- Command(s): `number.int(min=1)`
- Preview data:
```csv
"Value"
"4151426716022040"
```

#### `domain-number-int-arg-max`

- Command(s): `number.int(max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-int-arg-multipleOf`

- Command(s): `number.int(multipleOf=4)`
- Preview data:
```csv
"Value"
"3324814506500716"
```

#### `domain-number-int-pair-min-max`

- Command(s): `number.int(min=1, max=3)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-int-pair-max-multipleOf`

- Command(s): `number.int(max=3, multipleOf=4)`
- Preview data:
```csv
"Value"
"0"
```

#### `domain-number-octal-base`

- Command(s): `number.octal()`
- Preview data:
```csv
"Value"
"7"
```

#### `domain-number-octal-arg-max`

- Command(s): `number.octal(max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-octal-arg-min`

- Command(s): `number.octal(min=1)`
- Preview data:
```csv
"Value"
"6"
```

#### `domain-number-octal-pair-max-min`

- Command(s): `number.octal(max=3, min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-romanNumeral-base`

- Command(s): `number.romanNumeral()`
- Preview data:
```csv
"Value"
"MMMCDXXI"
```

#### `domain-number-romanNumeral-arg-min`

- Command(s): `number.romanNumeral(min=1)`
- Preview data:
```csv
"Value"
"CCXCI"
```

#### `domain-number-romanNumeral-arg-max`

- Command(s): `number.romanNumeral(max=3)`
- Preview data:
```csv
"Value"
"I"
```

#### `domain-number-romanNumeral-pair-min-max`

- Command(s): `number.romanNumeral(min=1, max=3)`
- Preview data:
```csv
"Value"
"II"
```

#### `domain-person-bio-base`

- Command(s): `person.bio()`
- Preview data:
```csv
"Value"
"environmentalist"
```

#### `domain-person-firstName-base`

- Command(s): `person.firstName()`
- Preview data:
```csv
"Value"
"Osbaldo"
```

#### `domain-person-firstName-arg-sex`

- Command(s): `person.firstName(sex="male")`
- Preview data:
```csv
"Value"
"Jon"
```

#### `domain-person-fullName-base`

- Command(s): `person.fullName()`
- Preview data:
```csv
"Value"
"Dixie Beer"
```

#### `domain-person-gender-base`

- Command(s): `person.gender()`
- Preview data:
```csv
"Value"
"Female to male transgender man"
```

#### `domain-person-jobArea-base`

- Command(s): `person.jobArea()`
- Preview data:
```csv
"Value"
"Directives"
```

#### `domain-person-jobDescriptor-base`

- Command(s): `person.jobDescriptor()`
- Preview data:
```csv
"Value"
"International"
```

#### `domain-person-jobTitle-base`

- Command(s): `person.jobTitle()`
- Preview data:
```csv
"Value"
"Human Accountability Producer"
```

#### `domain-person-jobType-base`

- Command(s): `person.jobType()`
- Preview data:
```csv
"Value"
"Manager"
```

#### `domain-person-lastName-base`

- Command(s): `person.lastName()`
- Preview data:
```csv
"Value"
"Koss"
```

#### `domain-person-lastName-arg-sex`

- Command(s): `person.lastName(sex="male")`
- Preview data:
```csv
"Value"
"Krajcik"
```

#### `domain-person-middleName-base`

- Command(s): `person.middleName()`
- Preview data:
```csv
"Value"
"Reagan"
```

#### `domain-person-middleName-arg-sex`

- Command(s): `person.middleName(sex="male")`
- Preview data:
```csv
"Value"
"Harrison"
```

#### `domain-person-prefix-base`

- Command(s): `person.prefix()`
- Preview data:
```csv
"Value"
"Dr."
```

#### `domain-person-prefix-arg-sex`

- Command(s): `person.prefix(sex="male")`
- Preview data:
```csv
"Value"
"Mr."
```

#### `domain-person-sex-base`

- Command(s): `person.sex()`
- Preview data:
```csv
"Value"
"male"
```

#### `domain-person-sexType-base`

- Command(s): `person.sexType()`
- Preview data:
```csv
"Value"
"male"
```

#### `domain-person-suffix-base`

- Command(s): `person.suffix()`
- Preview data:
```csv
"Value"
"DVM"
```

#### `domain-person-zodiacSign-base`

- Command(s): `person.zodiacSign()`
- Preview data:
```csv
"Value"
"Leo"
```

#### `domain-phone-imei-base`

- Command(s): `phone.imei()`
- Preview data:
```csv
"Value"
"79-903165-712789-0"
```

#### `domain-phone-number-base`

- Command(s): `phone.number()`
- Preview data:
```csv
"Value"
"1-329-484-4271 x034"
```

#### `domain-phone-number-arg-style`

- Command(s): `phone.number(style="international")`
- Preview data:
```csv
"Value"
"+18882200058"
```

#### `domain-string-alpha-base`

- Command(s): `string.alpha()`
- Preview data:
```csv
"Value"
"l"
```

#### `domain-string-alpha-arg-length`

- Command(s): `string.alpha(length=4)`
- Preview data:
```csv
"Value"
"eNHO"
```

#### `domain-string-alpha-arg-casing`

- Command(s): `string.alpha(casing="upper")`
- Preview data:
```csv
"Value"
"J"
```

#### `domain-string-alpha-arg-exclude`

- Command(s): `string.alpha(exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"Z"
```

#### `domain-string-alpha-pair-length-casing`

- Command(s): `string.alpha(length=4, casing="upper")`
- Preview data:
```csv
"Value"
"XLKS"
```

#### `domain-string-alpha-pair-casing-exclude`

- Command(s): `string.alpha(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"F"
```

#### `domain-string-alphanumeric-base`

- Command(s): `string.alphanumeric()`
- Preview data:
```csv
"Value"
"U"
```

#### `domain-string-alphanumeric-arg-length`

- Command(s): `string.alphanumeric(length=4)`
- Preview data:
```csv
"Value"
"LmDo"
```

#### `domain-string-alphanumeric-arg-casing`

- Command(s): `string.alphanumeric(casing="upper")`
- Preview data:
```csv
"Value"
"2"
```

#### `domain-string-alphanumeric-arg-exclude`

- Command(s): `string.alphanumeric(exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"N"
```

#### `domain-string-alphanumeric-pair-length-casing`

- Command(s): `string.alphanumeric(length=4, casing="upper")`
- Preview data:
```csv
"Value"
"IF7H"
```

#### `domain-string-alphanumeric-pair-casing-exclude`

- Command(s): `string.alphanumeric(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"I"
```

#### `domain-string-binary-base`

- Command(s): `string.binary()`
- Preview data:
```csv
"Value"
"0b1"
```

#### `domain-string-binary-arg-length`

- Command(s): `string.binary(length=4)`
- Preview data:
```csv
"Value"
"0b0001"
```

#### `domain-string-binary-arg-prefix`

- Command(s): `string.binary(prefix="#")`
- Preview data:
```csv
"Value"
"#1"
```

#### `domain-string-binary-pair-length-prefix`

- Command(s): `string.binary(length=4, prefix="#")`
- Preview data:
```csv
"Value"
"#0001"
```

#### `domain-string-counterString-base`

- Command(s): `string.counterString(1, 25, "*")`
- Preview data:
```csv
"Value"
"2*4*6*8*11*"
```

#### `domain-string-counterString-example-1`

- Command(s): `string.counterString()`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"2*4*"
```

#### `domain-string-counterString-example-2`

- Command(s): `string.counterString(15)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"*3*5*7*9*12*15*"
```

#### `domain-string-counterString-example-3`

- Command(s): `string.counterString(min=5, max=12)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"2*4*6*"
```

#### `domain-string-counterString-example-4`

- Command(s): `string.counterString(min=12, max=12, delimiter="#")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"#3#5#7#9#12#"
```

#### `domain-string-counterString-arg-min`

- Command(s): `string.counterString(min=5)`
- Preview data:
```csv
"Value"
"*3*5*"
```

#### `domain-string-counterString-arg-max`

- Command(s): `string.counterString(max=12)`
- Preview data:
```csv
"Value"
"2*4*6*8*"
```

#### `domain-string-counterString-arg-delimiter`

- Command(s): `string.counterString(delimiter="#")`
- Preview data:
```csv
"Value"
"2#4#6#8#11#14#17#"
```

#### `domain-string-counterString-pair-min-max`

- Command(s): `string.counterString(min=5, max=12)`
- Preview data:
```csv
"Value"
"*3*5*"
```

#### `domain-string-counterString-pair-max-delimiter`

- Command(s): `string.counterString(max=12, delimiter="#")`
- Preview data:
```csv
"Value"
"#3#5#7#"
```

#### `domain-string-fromCharacters-base`

- Command(s): `string.fromCharacters("ABC123", 4)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"A3C3"
```

#### `domain-string-fromCharacters-example-1`

- Command(s): `string.fromCharacters("ABC123", 6)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"C1A22B"
```

#### `domain-string-fromCharacters-example-2`

- Command(s): `string.fromCharacters(characters=["A", "B", "C"], length=4)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"CBAB"
```

#### `domain-string-fromCharacters-arg-characters`

- Command(s): `string.fromCharacters(characters="ABC123")`
- Preview data:
```csv
"Value"
"B"
```

#### `domain-string-fromCharacters-arg-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv
"Value"
"2221"
```

#### `domain-string-fromCharacters-pair-characters-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv
"Value"
"2CBB"
```

#### `domain-string-hexadecimal-base`

- Command(s): `string.hexadecimal()`
- Preview data:
```csv
"Value"
"0xC"
```

#### `domain-string-hexadecimal-arg-casing`

- Command(s): `string.hexadecimal(casing="upper")`
- Preview data:
```csv
"Value"
"0x8"
```

#### `domain-string-hexadecimal-arg-length`

- Command(s): `string.hexadecimal(length=4)`
- Preview data:
```csv
"Value"
"0xbAbc"
```

#### `domain-string-hexadecimal-arg-prefix`

- Command(s): `string.hexadecimal(prefix="#")`
- Preview data:
```csv
"Value"
"#E"
```

#### `domain-string-hexadecimal-pair-casing-length`

- Command(s): `string.hexadecimal(casing="upper", length=4)`
- Preview data:
```csv
"Value"
"0x8E8E"
```

#### `domain-string-hexadecimal-pair-length-prefix`

- Command(s): `string.hexadecimal(length=4, prefix="#")`
- Preview data:
```csv
"Value"
"#ffef"
```

#### `domain-string-nanoid-base`

- Command(s): `string.nanoid()`
- Preview data:
```csv
"Value"
"NdoP5wwyLFTWcdq-2JUPT"
```

#### `domain-string-nanoid-arg-length`

- Command(s): `string.nanoid(length=4)`
- Preview data:
```csv
"Value"
"emm-"
```

#### `domain-string-numeric-base`

- Command(s): `string.numeric()`
- Preview data:
```csv
"Value"
"8"
```

#### `domain-string-numeric-arg-length`

- Command(s): `string.numeric(length=4)`
- Preview data:
```csv
"Value"
"2920"
```

#### `domain-string-numeric-arg-allowLeadingZeros`

- Command(s): `string.numeric(allowLeadingZeros=true)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-string-numeric-arg-exclude`

- Command(s): `string.numeric(exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-string-numeric-pair-length-allowLeadingZeros`

- Command(s): `string.numeric(length=4, allowLeadingZeros=true)`
- Preview data:
```csv
"Value"
"8990"
```

#### `domain-string-numeric-pair-allowLeadingZeros-exclude`

- Command(s): `string.numeric(allowLeadingZeros=true, exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"6"
```

#### `domain-string-octal-base`

- Command(s): `string.octal()`
- Preview data:
```csv
"Value"
"0o3"
```

#### `domain-string-octal-arg-length`

- Command(s): `string.octal(length=4)`
- Preview data:
```csv
"Value"
"0o5416"
```

#### `domain-string-octal-arg-prefix`

- Command(s): `string.octal(prefix="#")`
- Preview data:
```csv
"Value"
"#6"
```

#### `domain-string-octal-pair-length-prefix`

- Command(s): `string.octal(length=4, prefix="#")`
- Preview data:
```csv
"Value"
"#2612"
```

#### `domain-string-sample-base`

- Command(s): `string.sample()`
- Preview data:
```csv
"Value"
"<BaB/g[//`"
```

#### `domain-string-sample-arg-length`

- Command(s): `string.sample(length=4)`
- Preview data:
```csv
"Value"
"}*V4"
```

#### `domain-string-symbol-base`

- Command(s): `string.symbol()`
- Preview data:
```csv
"Value"
")"
```

#### `domain-string-symbol-arg-length`

- Command(s): `string.symbol(length=4)`
- Preview data:
```csv
"Value"
">#>'"
```

#### `domain-string-ulid-base`

- Command(s): `string.ulid()`
- Preview data:
```csv
"Value"
"01KV01R36F4MY648F8XPVTRQE9"
```

#### `domain-string-ulid-arg-refDate`

- Command(s): `string.ulid(refDate=2)`
- Preview data:
```csv
"Value"
"00000000022P5BDQJ90BT5VFMX"
```

#### `domain-string-uuid-base`

- Command(s): `string.uuid()`
- Preview data:
```csv
"Value"
"5188d2de-3f7b-4998-a61f-cb3e78b71bb8"
```

#### `domain-system-commonFileExt-base`

- Command(s): `system.commonFileExt()`
- Preview data:
```csv
"Value"
"m2v"
```

#### `domain-system-commonFileName-base`

- Command(s): `system.commonFileName()`
- Preview data:
```csv
"Value"
"because.htm"
```

#### `domain-system-commonFileName-arg-extension`

- Command(s): `system.commonFileName(extension="system-commonFileName-extension")`
- Preview data:
```csv
"Value"
"brush_oh.system-commonFileName-extension"
```

#### `domain-system-commonFileType-base`

- Command(s): `system.commonFileType()`
- Preview data:
```csv
"Value"
"text"
```

#### `domain-system-cron-base`

- Command(s): `system.cron()`
- Preview data:
```csv
"Value"
"* * * 8 ?"
```

#### `domain-system-cron-arg-includeNonStandard`

- Command(s): `system.cron(includeNonStandard=true)`
- Preview data:
```csv
"Value"
"22 6 14 7 1"
```

#### `domain-system-cron-arg-includeYear`

- Command(s): `system.cron(includeYear=true)`
- Preview data:
```csv
"Value"
"* 1 ? 9 5 *"
```

#### `domain-system-cron-pair-includeNonStandard-includeYear`

- Command(s): `system.cron(includeNonStandard=true, includeYear=true)`
- Preview data:
```csv
"Value"
"@hourly"
```

#### `domain-system-directoryPath-base`

- Command(s): `system.directoryPath()`
- Preview data:
```csv
"Value"
"/etc"
```

#### `domain-system-fileExt-base`

- Command(s): `system.fileExt()`
- Preview data:
```csv
"Value"
"ear"
```

#### `domain-system-fileExt-arg-mimeType`

- Command(s): `system.fileExt(mimeType="system-fileExt-mimeType")`
- Preview data:
```csv
"Value"
"epub"
```

#### `domain-system-fileName-base`

- Command(s): `system.fileName()`
- Preview data:
```csv
"Value"
"finally.otf"
```

#### `domain-system-filePath-base`

- Command(s): `system.filePath()`
- Preview data:
```csv
"Value"
"/lost+found/bah.epub"
```

#### `domain-system-fileType-base`

- Command(s): `system.fileType()`
- Preview data:
```csv
"Value"
"application"
```

#### `domain-system-mimeType-base`

- Command(s): `system.mimeType()`
- Preview data:
```csv
"Value"
"image/gif"
```

#### `domain-system-networkInterface-base`

- Command(s): `system.networkInterface()`
- Preview data:
```csv
"Value"
"ens0d1"
```

#### `domain-system-semver-base`

- Command(s): `system.semver()`
- Preview data:
```csv
"Value"
"6.20.15"
```

#### `domain-vehicle-bicycle-base`

- Command(s): `vehicle.bicycle()`
- Preview data:
```csv
"Value"
"Hybrid Bicycle"
```

#### `domain-vehicle-color-base`

- Command(s): `vehicle.color()`
- Preview data:
```csv
"Value"
"fuchsia"
```

#### `domain-vehicle-fuel-base`

- Command(s): `vehicle.fuel()`
- Preview data:
```csv
"Value"
"Electric"
```

#### `domain-vehicle-manufacturer-base`

- Command(s): `vehicle.manufacturer()`
- Preview data:
```csv
"Value"
"Chrysler"
```

#### `domain-vehicle-model-base`

- Command(s): `vehicle.model()`
- Preview data:
```csv
"Value"
"CTS"
```

#### `domain-vehicle-type-base`

- Command(s): `vehicle.type()`
- Preview data:
```csv
"Value"
"Convertible"
```

#### `domain-vehicle-vehicle-base`

- Command(s): `vehicle.vehicle()`
- Preview data:
```csv
"Value"
"Smart Alpine"
```

#### `domain-vehicle-vin-base`

- Command(s): `vehicle.vin()`
- Preview data:
```csv
"Value"
"928JZDANRWG098654"
```

#### `domain-vehicle-vrm-base`

- Command(s): `vehicle.vrm()`
- Preview data:
```csv
"Value"
"RN16HVP"
```

#### `domain-word-adjective-base`

- Command(s): `word.adjective()`
- Preview data:
```csv
"Value"
"moist"
```

#### `domain-word-adjective-arg-length`

- Command(s): `word.adjective(length=4)`
- Preview data:
```csv
"Value"
"zany"
```

#### `domain-word-adjective-arg-max`

- Command(s): `word.adjective(max=3)`
- Preview data:
```csv
"Value"
"distorted"
```

#### `domain-word-adjective-arg-strategy`

- Command(s): `word.adjective(strategy="word-adjective-strategy")`
- Preview data:
```csv
"Value"
"illiterate"
```

#### `domain-word-adjective-pair-length-max`

- Command(s): `word.adjective(length=4, max=3)`
- Preview data:
```csv
"Value"
"live"
```

#### `domain-word-adjective-pair-max-strategy`

- Command(s): `word.adjective(max=3, strategy="word-adjective-strategy")`
- Preview data:
```csv
"Value"
"blue"
```

#### `domain-word-adverb-base`

- Command(s): `word.adverb()`
- Preview data:
```csv
"Value"
"certainly"
```

#### `domain-word-adverb-arg-length`

- Command(s): `word.adverb(length=4)`
- Preview data:
```csv
"Value"
"very"
```

#### `domain-word-adverb-arg-max`

- Command(s): `word.adverb(max=3)`
- Preview data:
```csv
"Value"
"swiftly"
```

#### `domain-word-adverb-arg-strategy`

- Command(s): `word.adverb(strategy="word-adverb-strategy")`
- Preview data:
```csv
"Value"
"voluntarily"
```

#### `domain-word-adverb-pair-length-max`

- Command(s): `word.adverb(length=4, max=3)`
- Preview data:
```csv
"Value"
"fast"
```

#### `domain-word-adverb-pair-max-strategy`

- Command(s): `word.adverb(max=3, strategy="word-adverb-strategy")`
- Preview data:
```csv
"Value"
"majestically"
```

#### `domain-word-conjunction-base`

- Command(s): `word.conjunction()`
- Preview data:
```csv
"Value"
"why"
```

#### `domain-word-conjunction-arg-length`

- Command(s): `word.conjunction(length=4)`
- Preview data:
```csv
"Value"
"what"
```

#### `domain-word-conjunction-arg-max`

- Command(s): `word.conjunction(max=3)`
- Preview data:
```csv
"Value"
"whoever"
```

#### `domain-word-conjunction-arg-strategy`

- Command(s): `word.conjunction(strategy="word-conjunction-strategy")`
- Preview data:
```csv
"Value"
"inasmuch"
```

#### `domain-word-conjunction-pair-length-max`

- Command(s): `word.conjunction(length=4, max=3)`
- Preview data:
```csv
"Value"
"once"
```

#### `domain-word-conjunction-pair-max-strategy`

- Command(s): `word.conjunction(max=3, strategy="word-conjunction-strategy")`
- Preview data:
```csv
"Value"
"for"
```

#### `domain-word-interjection-base`

- Command(s): `word.interjection()`
- Preview data:
```csv
"Value"
"blah"
```

#### `domain-word-interjection-arg-length`

- Command(s): `word.interjection(length=4)`
- Preview data:
```csv
"Value"
"gosh"
```

#### `domain-word-interjection-arg-max`

- Command(s): `word.interjection(max=3)`
- Preview data:
```csv
"Value"
"ah"
```

#### `domain-word-interjection-arg-strategy`

- Command(s): `word.interjection(strategy="word-interjection-strategy")`
- Preview data:
```csv
"Value"
"er"
```

#### `domain-word-interjection-pair-length-max`

- Command(s): `word.interjection(length=4, max=3)`
- Preview data:
```csv
"Value"
"pish"
```

#### `domain-word-interjection-pair-max-strategy`

- Command(s): `word.interjection(max=3, strategy="word-interjection-strategy")`
- Preview data:
```csv
"Value"
"whoa"
```

#### `domain-word-noun-base`

- Command(s): `word.noun()`
- Preview data:
```csv
"Value"
"foodstuffs"
```

#### `domain-word-noun-arg-length`

- Command(s): `word.noun(length=4)`
- Preview data:
```csv
"Value"
"coal"
```

#### `domain-word-noun-arg-max`

- Command(s): `word.noun(max=3)`
- Preview data:
```csv
"Value"
"backbone"
```

#### `domain-word-noun-arg-strategy`

- Command(s): `word.noun(strategy="word-noun-strategy")`
- Preview data:
```csv
"Value"
"meander"
```

#### `domain-word-noun-pair-length-max`

- Command(s): `word.noun(length=4, max=3)`
- Preview data:
```csv
"Value"
"king"
```

#### `domain-word-noun-pair-max-strategy`

- Command(s): `word.noun(max=3, strategy="word-noun-strategy")`
- Preview data:
```csv
"Value"
"numeric"
```

#### `domain-word-preposition-base`

- Command(s): `word.preposition()`
- Preview data:
```csv
"Value"
"times"
```

#### `domain-word-preposition-arg-length`

- Command(s): `word.preposition(length=4)`
- Preview data:
```csv
"Value"
"with"
```

#### `domain-word-preposition-arg-max`

- Command(s): `word.preposition(max=3)`
- Preview data:
```csv
"Value"
"a"
```

#### `domain-word-preposition-arg-strategy`

- Command(s): `word.preposition(strategy="word-preposition-strategy")`
- Preview data:
```csv
"Value"
"than"
```

#### `domain-word-preposition-pair-length-max`

- Command(s): `word.preposition(length=4, max=3)`
- Preview data:
```csv
"Value"
"plus"
```

#### `domain-word-preposition-pair-max-strategy`

- Command(s): `word.preposition(max=3, strategy="word-preposition-strategy")`
- Preview data:
```csv
"Value"
"near"
```

#### `domain-word-sample-base`

- Command(s): `word.sample()`
- Preview data:
```csv
"Value"
"microchip"
```

#### `domain-word-sample-arg-length`

- Command(s): `word.sample(length=4)`
- Preview data:
```csv
"Value"
"when"
```

#### `domain-word-sample-arg-max`

- Command(s): `word.sample(max=3)`
- Preview data:
```csv
"Value"
"aha"
```

#### `domain-word-sample-arg-strategy`

- Command(s): `word.sample(strategy="word-sample-strategy")`
- Preview data:
```csv
"Value"
"ew"
```

#### `domain-word-sample-pair-length-max`

- Command(s): `word.sample(length=4, max=3)`
- Preview data:
```csv
"Value"
"lamp"
```

#### `domain-word-sample-pair-max-strategy`

- Command(s): `word.sample(max=3, strategy="word-sample-strategy")`
- Preview data:
```csv
"Value"
"an"
```

#### `domain-word-verb-base`

- Command(s): `word.verb()`
- Preview data:
```csv
"Value"
"federate"
```

#### `domain-word-verb-arg-length`

- Command(s): `word.verb(length=4)`
- Preview data:
```csv
"Value"
"pant"
```

#### `domain-word-verb-arg-max`

- Command(s): `word.verb(max=3)`
- Preview data:
```csv
"Value"
"braid"
```

#### `domain-word-verb-arg-strategy`

- Command(s): `word.verb(strategy="word-verb-strategy")`
- Preview data:
```csv
"Value"
"prance"
```

#### `domain-word-verb-pair-length-max`

- Command(s): `word.verb(length=4, max=3)`
- Preview data:
```csv
"Value"
"come"
```

#### `domain-word-verb-pair-max-strategy`

- Command(s): `word.verb(max=3, strategy="word-verb-strategy")`
- Preview data:
```csv
"Value"
"pant"
```

#### `domain-word-words-base`

- Command(s): `word.words()`
- Preview data:
```csv
"Value"
"mutate ack"
```

#### `domain-word-words-arg-count`

- Command(s): `word.words(count=2)`
- Preview data:
```csv
"Value"
"instead conservative"
```

#### `domain-word-words-arg-max`

- Command(s): `word.words(max=3)`
- Preview data:
```csv
"Value"
"yahoo"
```

#### `domain-word-words-pair-count-max`

- Command(s): `word.words(count=2, max=3)`
- Preview data:
```csv
"Value"
"brr whoever"
```


## Runtime Scenarios

Scenario count: **621**
Generated preview data count: **621**
Review-only scenario count: **0**
Non-executable scenario count: **0**

### By Source Type

| Key | Count |
| --- | ---: |
| `domain` | 572 |
| `enum` | 2 |
| `faker` | 43 |
| `literal` | 2 |
| `regex` | 2 |

### By Origin

| Key | Count |
| --- | ---: |
| `arg` | 211 |
| `base` | 257 |
| `custom` | 6 |
| `empty` | 2 |
| `example` | 28 |
| `pair` | 119 |
| `pairwise` | 1 |

### Commands By Source Type

#### `domain` (245)

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
- `finance.maskedNumber`
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
- `image.avatarLegacy`
- `image.dataUri`
- `image.personPortrait`
- `image.url`
- `image.urlLoremFlickr`
- `image.urlPicsumPhotos`
- `image.urlPlaceholder`
- `internet.color`
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
- `internet.userName`
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
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
"pending"
```

#### `custom-enum-pairwise`

- Command(s): `Status: enum(active,inactive,pending) | Priority: enum(high,medium,low)`
- UI preview parity: `exact`
- Schema Rows: `Status: enum(active,inactive,pending)`, `Priority: enum(high,medium,low)`
- Preview data:
```csv
"Status","Priority"
"inactive","medium"
"inactive","low"
```
- Pairwise preview data:
```csv
"Status","Priority"
"active","high"
"active","medium"
"active","low"
"inactive","high"
"inactive","medium"
"inactive","low"
"pending","high"
"pending","medium"
"pending","low"
```

#### `custom-literal-base`

- Command(s): `literal("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
"Pending"
```

#### `custom-literal-empty`

- Command(s): `literal("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
""
```

#### `custom-regex-base`

- Command(s): `regex("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Code"
"VC23"
```

#### `custom-regex-empty`

- Command(s): `regex("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Code"
""
```

#### `faker-helpers-arrayElement-base`

- Command(s): `helpers.arrayElement(["A", "B"])`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"B"
```

#### `faker-helpers-arrayElement-example-1`

- Command(s): `helpers.arrayElement(["A", "B", "C"])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"A"
```

#### `faker-helpers-arrayElement-arg-array`

- Command(s): `helpers.arrayElement(["A", "B"])`
- Preview data:
```csv
"Value"
"B"
```

#### `faker-helpers-arrayElements-base`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""B"",""A""]"
```

#### `faker-helpers-arrayElements-example-1`

- Command(s): `helpers.arrayElements(["A", "B", "C"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-arrayElements-arg-array`

- Command(s): `helpers.arrayElements(["A", "B"])`
- Preview data:
```csv
"Value"
"[""B""]"
```

#### `faker-helpers-arrayElements-arg-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-arrayElements-pair-array-count`

- Command(s): `helpers.arrayElements(["A", "B"], 2)`
- Preview data:
```csv
"Value"
"[""B"",""A""]"
```

#### `faker-helpers-fake-base`

- Command(s): `helpers.fake("{{person.firstName}}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"Melvin"
```

#### `faker-helpers-fake-example-1`

- Command(s): `helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"Hi, my name is Ardith Weber!"
```

#### `faker-helpers-fake-arg-pattern`

- Command(s): `helpers.fake("[A-Z]{2}")`
- Preview data:
```csv
"Value"
"[A-Z]{2}"
```

#### `faker-helpers-fromRegExp-base`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"BJ"
```

#### `faker-helpers-fromRegExp-example-1`

- Command(s): `helpers.fromRegExp("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"PU71"
```

#### `faker-helpers-fromRegExp-arg-pattern`

- Command(s): `helpers.fromRegExp("[A-Z]{2}")`
- Preview data:
```csv
"Value"
"XA"
```

#### `faker-helpers-mustache-base`

- Command(s): `helpers.mustache("{{name}}", { name: "Ada" })`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Ada"
```

#### `faker-helpers-mustache-example-1`

- Command(s): `helpers.mustache("Hello {{name}}", { name: "Ada" })`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Hello Ada"
```

#### `faker-helpers-mustache-arg-text`

- Command(s): `helpers.mustache("{{name}}")`
- Preview data:
```csv
"Value"
"{{name}}"
```

#### `faker-helpers-mustache-arg-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv
"Value"
"{{name}}"
```

#### `faker-helpers-mustache-pair-text-data`

- Command(s): `helpers.mustache("{{name}}", {})`
- Preview data:
```csv
"Value"
"{{name}}"
```

#### `faker-helpers-rangeToNumber-base`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"1"
```

#### `faker-helpers-rangeToNumber-example-1`

- Command(s): `helpers.rangeToNumber({ min: 1, max: 2 })`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"2"
```

#### `faker-helpers-rangeToNumber-arg-numberOrRange`

- Command(s): `helpers.rangeToNumber(2)`
- Preview data:
```csv
"Value"
"2"
```

#### `faker-helpers-replaceCreditCardSymbols-base`

- Command(s): `helpers.replaceCreditCardSymbols()`
- Preview data:
```csv
"Value"
"6453-3460-3761-5138-2959"
```

#### `faker-helpers-replaceCreditCardSymbols-example-1`

- Command(s): `helpers.replaceCreditCardSymbols("1234-[4-9]-##!!-L")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"1234-5-4775-8"
```

#### `faker-helpers-replaceCreditCardSymbols-arg-string`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string")`
- Preview data:
```csv
"Value"
"helpers-replaceCreditCardSymbols-string"
```

#### `faker-helpers-replaceCreditCardSymbols-arg-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv
"Value"
"helpers-replaceCreditCardSymbols-string"
```

#### `faker-helpers-replaceCreditCardSymbols-pair-string-symbol`

- Command(s): `helpers.replaceCreditCardSymbols("helpers-replaceCreditCardSymbols-string", "helpers-replaceCreditCardSymbols-symbol")`
- Preview data:
```csv
"Value"
"helpers-replaceCreditCardSymbols-string"
```

#### `faker-helpers-replaceSymbols-base`

- Command(s): `helpers.replaceSymbols()`
- Preview data:
```csv
"Value"
""
```

#### `faker-helpers-replaceSymbols-example-1`

- Command(s): `helpers.replaceSymbols("##??-##")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"47UI-39"
```

#### `faker-helpers-replaceSymbols-arg-string`

- Command(s): `helpers.replaceSymbols("helpers-replaceSymbols-string")`
- Preview data:
```csv
"Value"
"helpers-replaceSymbols-string"
```

#### `faker-helpers-shuffle-base`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""B"",""A"",""C""]"
```

#### `faker-helpers-shuffle-example-1`

- Command(s): `helpers.shuffle(["A", "B", "C"])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""B"",""A"",""C""]"
```

#### `faker-helpers-shuffle-arg-array`

- Command(s): `helpers.shuffle(["A", "B"])`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-slugify-base`

- Command(s): `helpers.slugify()`
- Preview data:
```csv
"Value"
""
```

#### `faker-helpers-slugify-example-1`

- Command(s): `helpers.slugify("Hello World 2026")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Hello-World-2026"
```

#### `faker-helpers-slugify-arg-string`

- Command(s): `helpers.slugify("helpers-slugify-string")`
- Preview data:
```csv
"Value"
"helpers-slugify-string"
```

#### `faker-helpers-uniqueArray-base`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-uniqueArray-example-1`

- Command(s): `helpers.uniqueArray(["red", "green", "blue"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""blue"",""green""]"
```

#### `faker-helpers-uniqueArray-arg-source`

- Command(s): `helpers.uniqueArray(["A", "B"])`
- Preview data:
```csv
"Value"
"[]"
```

#### `faker-helpers-uniqueArray-arg-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv
"Value"
"[""B"",""A""]"
```

#### `faker-helpers-uniqueArray-pair-source-length`

- Command(s): `helpers.uniqueArray(["A", "B"], 4)`
- Preview data:
```csv
"Value"
"[""A"",""B""]"
```

#### `faker-helpers-weightedArrayElement-base`

- Command(s): `helpers.weightedArrayElement([{ "weight": 1, "value": "A" }, { "weight": 2, "value": "B" }])`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"A"
```

#### `faker-helpers-weightedArrayElement-example-1`

- Command(s): `helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"sunny"
```

#### `domain-airline-aircraftType-base`

- Command(s): `airline.aircraftType()`
- Preview data:
```csv
"Value"
"widebody"
```

#### `domain-airline-flightNumber-base`

- Command(s): `airline.flightNumber()`
- Preview data:
```csv
"Value"
"54"
```

#### `domain-airline-iataCode-base`

- Command(s): `airline.iataCode()`
- Preview data:
```csv
"Value"
"VS"
```

#### `domain-airline-name-base`

- Command(s): `airline.name()`
- Preview data:
```csv
"Value"
"Juneyao Airlines"
```

#### `domain-airline-recordLocator-base`

- Command(s): `airline.recordLocator()`
- Preview data:
```csv
"Value"
"QYNEDR"
```

#### `domain-airline-seat-base`

- Command(s): `airline.seat()`
- Preview data:
```csv
"Value"
"29B"
```

#### `domain-airline-seat-example-1`

- Command(s): `airline.seat()`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"32C"
```

#### `domain-airline-seat-example-2`

- Command(s): `airline.seat(aircraftType="widebody")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"55J"
```

#### `domain-airline-seat-arg-aircraftType`

- Command(s): `airline.seat(aircraftType="widebody")`
- Preview data:
```csv
"Value"
"3A"
```

#### `domain-airplane-iataTypeCode-base`

- Command(s): `airplane.iataTypeCode()`
- Preview data:
```csv
"Value"
"345"
```

#### `domain-airplane-name-base`

- Command(s): `airplane.name()`
- Preview data:
```csv
"Value"
"Boeing 747-400"
```

#### `domain-airport-iataCode-base`

- Command(s): `airport.iataCode()`
- Preview data:
```csv
"Value"
"MEX"
```

#### `domain-airport-name-base`

- Command(s): `airport.name()`
- Preview data:
```csv
"Value"
"Hobart International Airport"
```

#### `domain-animal-bear-base`

- Command(s): `animal.bear()`
- Preview data:
```csv
"Value"
"American black bear"
```

#### `domain-animal-bird-base`

- Command(s): `animal.bird()`
- Preview data:
```csv
"Value"
"Red-footed Booby"
```

#### `domain-animal-cat-base`

- Command(s): `animal.cat()`
- Preview data:
```csv
"Value"
"Ojos Azules"
```

#### `domain-animal-cetacean-base`

- Command(s): `animal.cetacean()`
- Preview data:
```csv
"Value"
"Blue Whale"
```

#### `domain-animal-cow-base`

- Command(s): `animal.cow()`
- Preview data:
```csv
"Value"
"Mandalong Special"
```

#### `domain-animal-crocodilia-base`

- Command(s): `animal.crocodilia()`
- Preview data:
```csv
"Value"
"Cuban Crocodile"
```

#### `domain-animal-dog-base`

- Command(s): `animal.dog()`
- Preview data:
```csv
"Value"
"Yakutian Laika"
```

#### `domain-animal-fish-base`

- Command(s): `animal.fish()`
- Preview data:
```csv
"Value"
"Jumbo flying squid"
```

#### `domain-animal-horse-base`

- Command(s): `animal.horse()`
- Preview data:
```csv
"Value"
"Trait Du Nord"
```

#### `domain-animal-insect-base`

- Command(s): `animal.insect()`
- Preview data:
```csv
"Value"
"False honey ant"
```

#### `domain-animal-lion-base`

- Command(s): `animal.lion()`
- Preview data:
```csv
"Value"
"Cape lion"
```

#### `domain-animal-petName-base`

- Command(s): `animal.petName()`
- Preview data:
```csv
"Value"
"Bandit"
```

#### `domain-animal-rabbit-base`

- Command(s): `animal.rabbit()`
- Preview data:
```csv
"Value"
"Silver"
```

#### `domain-animal-rodent-base`

- Command(s): `animal.rodent()`
- Preview data:
```csv
"Value"
"Bonetto's tuco-tuco"
```

#### `domain-animal-snake-base`

- Command(s): `animal.snake()`
- Preview data:
```csv
"Value"
"White-lipped keelback"
```

#### `domain-animal-type-base`

- Command(s): `animal.type()`
- Preview data:
```csv
"Value"
"elephant"
```

#### `domain-autoIncrement-sequence-base`

- Command(s): `autoIncrement.sequence(1, 5, "filename", ".txt", 3)`
- Preview data:
```csv
"Value"
"filename0001.txt"
```

#### `domain-autoIncrement-sequence-example-1`

- Command(s): `autoIncrement.sequence()`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-autoIncrement-sequence-example-2`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv
"Value"
"10"
```

#### `domain-autoIncrement-sequence-example-3`

- Command(s): `autoIncrement.sequence(start=1, step=5, prefix="filename", suffix=".txt", zeropadding=3)`
- Preview data:
```csv
"Value"
"filename0001.txt"
```

#### `domain-autoIncrement-sequence-arg-start`

- Command(s): `autoIncrement.sequence(start=10)`
- Preview data:
```csv
"Value"
"10"
```

#### `domain-autoIncrement-sequence-arg-step`

- Command(s): `autoIncrement.sequence(step=5)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-autoIncrement-sequence-arg-prefix`

- Command(s): `autoIncrement.sequence(prefix="filename")`
- Preview data:
```csv
"Value"
"filename1"
```

#### `domain-autoIncrement-sequence-arg-suffix`

- Command(s): `autoIncrement.sequence(suffix=".txt")`
- Preview data:
```csv
"Value"
"1.txt"
```

#### `domain-autoIncrement-sequence-arg-zeropadding`

- Command(s): `autoIncrement.sequence(zeropadding=3)`
- Preview data:
```csv
"Value"
"0001"
```

#### `domain-autoIncrement-sequence-pair-start-step`

- Command(s): `autoIncrement.sequence(start=10, step=5)`
- Preview data:
```csv
"Value"
"10"
```

#### `domain-autoIncrement-sequence-pair-step-prefix`

- Command(s): `autoIncrement.sequence(step=5, prefix="filename")`
- Preview data:
```csv
"Value"
"filename1"
```

#### `domain-autoIncrement-sequence-pair-prefix-suffix`

- Command(s): `autoIncrement.sequence(prefix="filename", suffix=".txt")`
- Preview data:
```csv
"Value"
"filename1.txt"
```

#### `domain-autoIncrement-sequence-pair-suffix-zeropadding`

- Command(s): `autoIncrement.sequence(suffix=".txt", zeropadding=3)`
- Preview data:
```csv
"Value"
"0001.txt"
```

#### `domain-book-author-base`

- Command(s): `book.author()`
- Preview data:
```csv
"Value"
"Hermann Broch"
```

#### `domain-book-format-base`

- Command(s): `book.format()`
- Preview data:
```csv
"Value"
"Ebook"
```

#### `domain-book-genre-base`

- Command(s): `book.genre()`
- Preview data:
```csv
"Value"
"Philosophy"
```

#### `domain-book-publisher-base`

- Command(s): `book.publisher()`
- Preview data:
```csv
"Value"
"Hodder & Stoughton"
```

#### `domain-book-series-base`

- Command(s): `book.series()`
- Preview data:
```csv
"Value"
"Colonel Race"
```

#### `domain-book-title-base`

- Command(s): `book.title()`
- Preview data:
```csv
"Value"
"The Sound and the Fury"
```

#### `domain-chemicalElement-atomicNumber-base`

- Command(s): `chemicalElement.atomicNumber()`
- Preview data:
```csv
"Value"
"9"
```

#### `domain-chemicalElement-name-base`

- Command(s): `chemicalElement.name()`
- Preview data:
```csv
"Value"
"Meitnerium"
```

#### `domain-chemicalElement-symbol-base`

- Command(s): `chemicalElement.symbol()`
- Preview data:
```csv
"Value"
"Lv"
```

#### `domain-color-cssSupportedFunction-base`

- Command(s): `color.cssSupportedFunction()`
- Preview data:
```csv
"Value"
"hwb"
```

#### `domain-color-cssSupportedSpace-base`

- Command(s): `color.cssSupportedSpace()`
- Preview data:
```csv
"Value"
"sRGB"
```

#### `domain-color-human-base`

- Command(s): `color.human()`
- Preview data:
```csv
"Value"
"turquoise"
```

#### `domain-color-rgb-base`

- Command(s): `color.rgb()`
- Preview data:
```csv
"Value"
"#bce97e"
```

#### `domain-color-rgb-arg-casing`

- Command(s): `color.rgb(casing="upper")`
- Preview data:
```csv
"Value"
"#BCBFC4"
```

#### `domain-color-rgb-arg-format`

- Command(s): `color.rgb(format="hex")`
- Preview data:
```csv
"Value"
"#9be19f"
```

#### `domain-color-rgb-arg-includeAlpha`

- Command(s): `color.rgb(includeAlpha=true)`
- Preview data:
```csv
"Value"
"#71d66e8f"
```

#### `domain-color-rgb-arg-prefix`

- Command(s): `color.rgb(prefix="#")`
- Preview data:
```csv
"Value"
"#dceba6"
```

#### `domain-color-rgb-pair-casing-format`

- Command(s): `color.rgb(casing="upper", format="hex")`
- Preview data:
```csv
"Value"
"#F948CC"
```

#### `domain-color-rgb-pair-format-includeAlpha`

- Command(s): `color.rgb(format="hex", includeAlpha=true)`
- Preview data:
```csv
"Value"
"#bd037ce9"
```

#### `domain-color-rgb-pair-includeAlpha-prefix`

- Command(s): `color.rgb(includeAlpha=true, prefix="#")`
- Preview data:
```csv
"Value"
"#d95bfefc"
```

#### `domain-color-space-base`

- Command(s): `color.space()`
- Preview data:
```csv
"Value"
"CIEUVW"
```

#### `domain-commerce-department-base`

- Command(s): `commerce.department()`
- Preview data:
```csv
"Value"
"Home"
```

#### `domain-commerce-isbn-base`

- Command(s): `commerce.isbn()`
- Preview data:
```csv
"Value"
"978-0-276-38715-9"
```

#### `domain-commerce-isbn-arg-separator`

- Command(s): `commerce.isbn(separator="-")`
- Preview data:
```csv
"Value"
"978-1-01-952776-4"
```

#### `domain-commerce-isbn-arg-variant`

- Command(s): `commerce.isbn(variant="13")`
- Preview data:
```csv
"Value"
"978-0-9939513-5-0"
```

#### `domain-commerce-isbn-pair-separator-variant`

- Command(s): `commerce.isbn(separator="-", variant="13")`
- Preview data:
```csv
"Value"
"978-1-63392-157-3"
```

#### `domain-commerce-price-base`

- Command(s): `commerce.price()`
- Preview data:
```csv
"Value"
"557.85"
```

#### `domain-commerce-price-example-1`

- Command(s): `commerce.price(dec=2, max=10, min=1, symbol="$")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"$3.69"
```

#### `domain-commerce-price-arg-dec`

- Command(s): `commerce.price(dec=2)`
- Preview data:
```csv
"Value"
"489.39"
```

#### `domain-commerce-price-arg-max`

- Command(s): `commerce.price(max=100)`
- Preview data:
```csv
"Value"
"11.69"
```

#### `domain-commerce-price-arg-min`

- Command(s): `commerce.price(min=1)`
- Preview data:
```csv
"Value"
"624.89"
```

#### `domain-commerce-price-arg-symbol`

- Command(s): `commerce.price(symbol="$")`
- Preview data:
```csv
"Value"
"$408.79"
```

#### `domain-commerce-price-pair-dec-max`

- Command(s): `commerce.price(dec=2, max=100)`
- Preview data:
```csv
"Value"
"80.09"
```

#### `domain-commerce-price-pair-max-min`

- Command(s): `commerce.price(max=100, min=1)`
- Preview data:
```csv
"Value"
"65.60"
```

#### `domain-commerce-price-pair-min-symbol`

- Command(s): `commerce.price(min=1, symbol="$")`
- Preview data:
```csv
"Value"
"$80.15"
```

#### `domain-commerce-product-base`

- Command(s): `commerce.product()`
- Preview data:
```csv
"Value"
"Salad"
```

#### `domain-commerce-productAdjective-base`

- Command(s): `commerce.productAdjective()`
- Preview data:
```csv
"Value"
"Rustic"
```

#### `domain-commerce-productDescription-base`

- Command(s): `commerce.productDescription()`
- Preview data:
```csv
"Value"
"Discover the inconsequential new Gloves with an exciting mix of Cotton ingredients"
```

#### `domain-commerce-productMaterial-base`

- Command(s): `commerce.productMaterial()`
- Preview data:
```csv
"Value"
"Silk"
```

#### `domain-commerce-productName-base`

- Command(s): `commerce.productName()`
- Preview data:
```csv
"Value"
"Practical Aluminum Shirt"
```

#### `domain-company-buzzAdjective-base`

- Command(s): `company.buzzAdjective()`
- Preview data:
```csv
"Value"
"B2B"
```

#### `domain-company-buzzNoun-base`

- Command(s): `company.buzzNoun()`
- Preview data:
```csv
"Value"
"schemas"
```

#### `domain-company-buzzPhrase-base`

- Command(s): `company.buzzPhrase()`
- Preview data:
```csv
"Value"
"engineer scalable smart contracts"
```

#### `domain-company-buzzVerb-base`

- Command(s): `company.buzzVerb()`
- Preview data:
```csv
"Value"
"expedite"
```

#### `domain-company-catchPhrase-base`

- Command(s): `company.catchPhrase()`
- Preview data:
```csv
"Value"
"Synchronised fault-tolerant service-desk"
```

#### `domain-company-catchPhraseAdjective-base`

- Command(s): `company.catchPhraseAdjective()`
- Preview data:
```csv
"Value"
"Diverse"
```

#### `domain-company-catchPhraseDescriptor-base`

- Command(s): `company.catchPhraseDescriptor()`
- Preview data:
```csv
"Value"
"zero trust"
```

#### `domain-company-catchPhraseNoun-base`

- Command(s): `company.catchPhraseNoun()`
- Preview data:
```csv
"Value"
"hardware"
```

#### `domain-company-name-base`

- Command(s): `company.name()`
- Preview data:
```csv
"Value"
"Yundt, Boehm and Roob"
```

#### `domain-database-collation-base`

- Command(s): `database.collation()`
- Preview data:
```csv
"Value"
"utf8_bin"
```

#### `domain-database-column-base`

- Command(s): `database.column()`
- Preview data:
```csv
"Value"
"updatedAt"
```

#### `domain-database-engine-base`

- Command(s): `database.engine()`
- Preview data:
```csv
"Value"
"MyISAM"
```

#### `domain-database-mongodbObjectId-base`

- Command(s): `database.mongodbObjectId()`
- Preview data:
```csv
"Value"
"d62d29cffe9912ddfddddb58"
```

#### `domain-database-type-base`

- Command(s): `database.type()`
- Preview data:
```csv
"Value"
"point"
```

#### `domain-datatype-boolean-base`

- Command(s): `datatype.boolean()`
- Preview data:
```csv
"Value"
"false"
```

#### `domain-datatype-boolean-arg-probability`

- Command(s): `datatype.boolean(probability=2)`
- Preview data:
```csv
"Value"
"true"
```

#### `domain-datatype-enum-base`

- Command(s): `datatype.enum("active", "inactive", "pending")`
- Preview data:
```csv
"Value"
"active"
```

#### `domain-date-anytime-base`

- Command(s): `date.anytime()`
- Preview data:
```csv
"Value"
"2026-06-22T17:30:12.369Z"
```

#### `domain-date-anytime-arg-refDate`

- Command(s): `date.anytime(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-09-21T21:46:38.236Z"
```

#### `domain-date-between-base`

- Command(s): `date.between(1577836800000, 1609372800000)`
- Preview data:
```csv
"Value"
"2020-07-25T19:48:55.233Z"
```

#### `domain-date-between-arg-from`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv
"Value"
"2020-08-02T19:17:11.407Z"
```

#### `domain-date-between-arg-to`

- Command(s): `date.between(to=1609372800000, from=1577836800000)`
- Preview data:
```csv
"Value"
"2020-07-28T01:45:25.825Z"
```

#### `domain-date-between-pair-from-to`

- Command(s): `date.between(from=1577836800000, to=1609372800000)`
- Preview data:
```csv
"Value"
"2020-04-01T08:35:52.015Z"
```

#### `domain-date-birthdate-base`

- Command(s): `date.birthdate()`
- Preview data:
```csv
"Value"
"1957-08-17T17:25:24.372Z"
```

#### `domain-date-birthdate-example-1`

- Command(s): `date.birthdate(refDate=20000, max=69, min=16, mode="age")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"1920-10-04T17:22:24.125Z"
```

#### `domain-date-birthdate-arg-refDate`

- Command(s): `date.birthdate(refDate=1577836800000, min=18, max=65, mode="age")`
- Preview data:
```csv
"Value"
"1986-12-14T21:23:27.338Z"
```

#### `domain-date-birthdate-arg-max`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv
"Value"
"1979-07-05T21:32:12.817Z"
```

#### `domain-date-birthdate-arg-min`

- Command(s): `date.birthdate(min=18, max=65, mode="age")`
- Preview data:
```csv
"Value"
"1970-08-31T12:55:40.310Z"
```

#### `domain-date-birthdate-arg-mode`

- Command(s): `date.birthdate(mode="age", min=18, max=65)`
- Preview data:
```csv
"Value"
"1989-12-13T00:22:51.731Z"
```

#### `domain-date-birthdate-pair-refDate-max`

- Command(s): `date.birthdate(refDate=1577836800000, max=65, min=18, mode="age")`
- Preview data:
```csv
"Value"
"1973-08-07T06:26:36.179Z"
```

#### `domain-date-birthdate-pair-max-min`

- Command(s): `date.birthdate(max=65, min=18, mode="age")`
- Preview data:
```csv
"Value"
"1979-10-24T15:54:42.562Z"
```

#### `domain-date-birthdate-pair-min-mode`

- Command(s): `date.birthdate(min=18, mode="age", max=65)`
- Preview data:
```csv
"Value"
"1970-04-18T18:38:14.313Z"
```

#### `domain-date-future-base`

- Command(s): `date.future()`
- Preview data:
```csv
"Value"
"2026-09-28T03:54:21.115Z"
```

#### `domain-date-future-arg-refDate`

- Command(s): `date.future(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-01-10T14:38:46.292Z"
```

#### `domain-date-future-arg-years`

- Command(s): `date.future(years=2)`
- Preview data:
```csv
"Value"
"2027-12-10T22:37:31.420Z"
```

#### `domain-date-future-pair-refDate-years`

- Command(s): `date.future(refDate=1577836800000, years=2)`
- Preview data:
```csv
"Value"
"2021-08-02T04:49:51.903Z"
```

#### `domain-date-month-base`

- Command(s): `date.month()`
- Preview data:
```csv
"Value"
"August"
```

#### `domain-date-month-arg-abbreviated`

- Command(s): `date.month(abbreviated=true)`
- Preview data:
```csv
"Value"
"Jun"
```

#### `domain-date-month-arg-context`

- Command(s): `date.month(context=true)`
- Preview data:
```csv
"Value"
"August"
```

#### `domain-date-month-pair-abbreviated-context`

- Command(s): `date.month(abbreviated=true, context=true)`
- Preview data:
```csv
"Value"
"Jul"
```

#### `domain-date-past-base`

- Command(s): `date.past()`
- Preview data:
```csv
"Value"
"2026-01-11T01:33:19.288Z"
```

#### `domain-date-past-arg-refDate`

- Command(s): `date.past(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2019-08-27T00:03:49.125Z"
```

#### `domain-date-past-arg-years`

- Command(s): `date.past(years=2)`
- Preview data:
```csv
"Value"
"2025-06-15T14:33:12.683Z"
```

#### `domain-date-past-pair-refDate-years`

- Command(s): `date.past(refDate=1577836800000, years=2)`
- Preview data:
```csv
"Value"
"2019-05-16T08:15:04.782Z"
```

#### `domain-date-recent-base`

- Command(s): `date.recent()`
- Preview data:
```csv
"Value"
"2026-06-13T08:22:34.177Z"
```

#### `domain-date-recent-arg-days`

- Command(s): `date.recent(days=7)`
- Preview data:
```csv
"Value"
"2026-06-11T14:10:36.847Z"
```

#### `domain-date-recent-arg-refDate`

- Command(s): `date.recent(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2019-12-31T17:33:19.970Z"
```

#### `domain-date-recent-pair-days-refDate`

- Command(s): `date.recent(days=7, refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2019-12-31T16:09:08.524Z"
```

#### `domain-date-soon-base`

- Command(s): `date.soon()`
- Preview data:
```csv
"Value"
"2026-06-13T10:23:16.938Z"
```

#### `domain-date-soon-arg-days`

- Command(s): `date.soon(days=7)`
- Preview data:
```csv
"Value"
"2026-06-15T02:51:05.166Z"
```

#### `domain-date-soon-arg-refDate`

- Command(s): `date.soon(refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-01-01T14:00:11.275Z"
```

#### `domain-date-soon-pair-days-refDate`

- Command(s): `date.soon(days=7, refDate=1577836800000)`
- Preview data:
```csv
"Value"
"2020-01-05T05:26:41.692Z"
```

#### `domain-date-timeZone-base`

- Command(s): `date.timeZone()`
- Preview data:
```csv
"Value"
"Africa/Blantyre"
```

#### `domain-date-weekday-base`

- Command(s): `date.weekday()`
- Preview data:
```csv
"Value"
"Sunday"
```

#### `domain-date-weekday-arg-abbreviated`

- Command(s): `date.weekday(abbreviated=true)`
- Preview data:
```csv
"Value"
"Fri"
```

#### `domain-date-weekday-arg-context`

- Command(s): `date.weekday(context=true)`
- Preview data:
```csv
"Value"
"Sunday"
```

#### `domain-date-weekday-pair-abbreviated-context`

- Command(s): `date.weekday(abbreviated=true, context=true)`
- Preview data:
```csv
"Value"
"Wed"
```

#### `domain-finance-accountName-base`

- Command(s): `finance.accountName()`
- Preview data:
```csv
"Value"
"Credit Card Account"
```

#### `domain-finance-accountNumber-base`

- Command(s): `finance.accountNumber()`
- Preview data:
```csv
"Value"
"12741818"
```

#### `domain-finance-accountNumber-arg-length`

- Command(s): `finance.accountNumber(length=4)`
- Preview data:
```csv
"Value"
"0626"
```

#### `domain-finance-amount-base`

- Command(s): `finance.amount()`
- Preview data:
```csv
"Value"
"98.23"
```

#### `domain-finance-amount-arg-autoFormat`

- Command(s): `finance.amount(autoFormat=true)`
- Preview data:
```csv
"Value"
"243.58"
```

#### `domain-finance-amount-arg-dec`

- Command(s): `finance.amount(dec=2)`
- Preview data:
```csv
"Value"
"180.47"
```

#### `domain-finance-amount-arg-max`

- Command(s): `finance.amount(max=100)`
- Preview data:
```csv
"Value"
"98.06"
```

#### `domain-finance-amount-arg-min`

- Command(s): `finance.amount(min=1)`
- Preview data:
```csv
"Value"
"745.17"
```

#### `domain-finance-amount-arg-symbol`

- Command(s): `finance.amount(symbol="$")`
- Preview data:
```csv
"Value"
"$439.51"
```

#### `domain-finance-amount-pair-autoFormat-dec`

- Command(s): `finance.amount(autoFormat=true, dec=2)`
- Preview data:
```csv
"Value"
"823.64"
```

#### `domain-finance-amount-pair-dec-max`

- Command(s): `finance.amount(dec=2, max=100)`
- Preview data:
```csv
"Value"
"61.65"
```

#### `domain-finance-amount-pair-max-min`

- Command(s): `finance.amount(max=100, min=1)`
- Preview data:
```csv
"Value"
"73.22"
```

#### `domain-finance-amount-pair-min-symbol`

- Command(s): `finance.amount(min=1, symbol="$")`
- Preview data:
```csv
"Value"
"$738.40"
```

#### `domain-finance-bic-base`

- Command(s): `finance.bic()`
- Preview data:
```csv
"Value"
"SCXGMW70"
```

#### `domain-finance-bic-arg-includeBranchCode`

- Command(s): `finance.bic(includeBranchCode=true)`
- Preview data:
```csv
"Value"
"TOZQSBL96NT"
```

#### `domain-finance-bitcoinAddress-base`

- Command(s): `finance.bitcoinAddress()`
- Preview data:
```csv
"Value"
"34fzp3Y8vj9LnQmtgNeraDGfkqT2rk"
```

#### `domain-finance-creditCardCVV-base`

- Command(s): `finance.creditCardCVV()`
- Preview data:
```csv
"Value"
"463"
```

#### `domain-finance-creditCardIssuer-base`

- Command(s): `finance.creditCardIssuer()`
- Preview data:
```csv
"Value"
"american_express"
```

#### `domain-finance-creditCardNumber-base`

- Command(s): `finance.creditCardNumber()`
- Preview data:
```csv
"Value"
"3529-6738-8179-4135"
```

#### `domain-finance-creditCardNumber-arg-issuer`

- Command(s): `finance.creditCardNumber(issuer="finance-creditCardNumber-issuer")`
- Preview data:
```csv
"Value"
"3044-612107-9965"
```

#### `domain-finance-currencyCode-base`

- Command(s): `finance.currencyCode()`
- Preview data:
```csv
"Value"
"LBP"
```

#### `domain-finance-currencyName-base`

- Command(s): `finance.currencyName()`
- Preview data:
```csv
"Value"
"Cedi"
```

#### `domain-finance-currencyNumericCode-base`

- Command(s): `finance.currencyNumericCode()`
- Preview data:
```csv
"Value"
"934"
```

#### `domain-finance-currencySymbol-base`

- Command(s): `finance.currencySymbol()`
- Preview data:
```csv
"Value"
"₴"
```

#### `domain-finance-ethereumAddress-base`

- Command(s): `finance.ethereumAddress()`
- Preview data:
```csv
"Value"
"0x05a9f11aa9ac6713b564dc821edb1cee4ea9bb33"
```

#### `domain-finance-iban-base`

- Command(s): `finance.iban()`
- Preview data:
```csv
"Value"
"LV80HNUZ1327310107987"
```

#### `domain-finance-iban-arg-countryCode`

- Command(s): `finance.iban(countryCode="GB")`
- Preview data:
```csv
"Value"
"GB93ZCOC36631779090042"
```

#### `domain-finance-iban-arg-formatted`

- Command(s): `finance.iban(formatted=true)`
- Preview data:
```csv
"Value"
"FI75 6537 4040 0859 87"
```

#### `domain-finance-iban-pair-countryCode-formatted`

- Command(s): `finance.iban(countryCode="GB", formatted=true)`
- Preview data:
```csv
"Value"
"GB63 QSMG 1465 6277 3690 20"
```

#### `domain-finance-litecoinAddress-base`

- Command(s): `finance.litecoinAddress()`
- Preview data:
```csv
"Value"
"387GmSW4s1E1t16xYaNCi9zgLtV5cDM"
```

#### `domain-finance-maskedNumber-base`

- Command(s): `finance.maskedNumber()`
- Preview data:
```csv
"Value"
"(...1483)"
```

#### `domain-finance-maskedNumber-arg-length`

- Command(s): `finance.maskedNumber(length=4)`
- Preview data:
```csv
"Value"
"(...7138)"
```

#### `domain-finance-pin-base`

- Command(s): `finance.pin()`
- Preview data:
```csv
"Value"
"2035"
```

#### `domain-finance-pin-arg-length`

- Command(s): `finance.pin(length=4)`
- Preview data:
```csv
"Value"
"1155"
```

#### `domain-finance-routingNumber-base`

- Command(s): `finance.routingNumber()`
- Preview data:
```csv
"Value"
"960542158"
```

#### `domain-finance-transactionDescription-base`

- Command(s): `finance.transactionDescription()`
- Preview data:
```csv
"Value"
"payment processed at Ullrich LLC for PKR 490.00, using card ending ****1272. Account: ***8641."
```

#### `domain-finance-transactionType-base`

- Command(s): `finance.transactionType()`
- Preview data:
```csv
"Value"
"withdrawal"
```

#### `domain-food-adjective-base`

- Command(s): `food.adjective()`
- Preview data:
```csv
"Value"
"fluffy"
```

#### `domain-food-description-base`

- Command(s): `food.description()`
- Preview data:
```csv
"Value"
"A classic pie filled with delicious venison and crunchy purple rice, baked in a smoky pastry crust and topped with a golden-brown lattice."
```

#### `domain-food-dish-base`

- Command(s): `food.dish()`
- Preview data:
```csv
"Value"
"Passionfruit Pie"
```

#### `domain-food-ethnicCategory-base`

- Command(s): `food.ethnicCategory()`
- Preview data:
```csv
"Value"
"Belarusian"
```

#### `domain-food-fruit-base`

- Command(s): `food.fruit()`
- Preview data:
```csv
"Value"
"grape"
```

#### `domain-food-ingredient-base`

- Command(s): `food.ingredient()`
- Preview data:
```csv
"Value"
"bonza"
```

#### `domain-food-meat-base`

- Command(s): `food.meat()`
- Preview data:
```csv
"Value"
"crocodile"
```

#### `domain-food-spice-base`

- Command(s): `food.spice()`
- Preview data:
```csv
"Value"
"achiote seed"
```

#### `domain-food-vegetable-base`

- Command(s): `food.vegetable()`
- Preview data:
```csv
"Value"
"lettuce"
```

#### `domain-git-branch-base`

- Command(s): `git.branch()`
- Preview data:
```csv
"Value"
"array-input"
```

#### `domain-git-commitDate-base`

- Command(s): `git.commitDate()`
- Preview data:
```csv
"Value"
"Fri Jun 12 09:20:22 2026 -0700"
```

#### `domain-git-commitEntry-base`

- Command(s): `git.commitEntry()`
- Preview data:
```csv
"Value"
"commit 7738bbde748c2e27e1520b9bf8bb637a48e2feaa
Author: Josie Russel <Josie.Russel95@yahoo.com>
Date: Fri Jun 12 10:05:38 2026 +0700

    transmit solid state protocol
"
```

#### `domain-git-commitMessage-base`

- Command(s): `git.commitMessage()`
- Preview data:
```csv
"Value"
"program multi-byte alarm"
```

#### `domain-git-commitSha-base`

- Command(s): `git.commitSha()`
- Preview data:
```csv
"Value"
"aa5bda8d6f6a71fed1ccffd89a4ea33d4ec21e7e"
```

#### `domain-hacker-abbreviation-base`

- Command(s): `hacker.abbreviation()`
- Preview data:
```csv
"Value"
"UDP"
```

#### `domain-hacker-adjective-base`

- Command(s): `hacker.adjective()`
- Preview data:
```csv
"Value"
"solid state"
```

#### `domain-hacker-ingverb-base`

- Command(s): `hacker.ingverb()`
- Preview data:
```csv
"Value"
"bypassing"
```

#### `domain-hacker-noun-base`

- Command(s): `hacker.noun()`
- Preview data:
```csv
"Value"
"card"
```

#### `domain-hacker-phrase-base`

- Command(s): `hacker.phrase()`
- Preview data:
```csv
"Value"
"compressing the array won't do anything, we need to bypass the cross-platform PCI alarm!"
```

#### `domain-hacker-verb-base`

- Command(s): `hacker.verb()`
- Preview data:
```csv
"Value"
"calculate"
```

#### `domain-image-avatar-base`

- Command(s): `image.avatar()`
- Preview data:
```csv
"Value"
"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/20.jpg"
```

#### `domain-image-avatarGitHub-base`

- Command(s): `image.avatarGitHub()`
- Preview data:
```csv
"Value"
"https://avatars.githubusercontent.com/u/16590067"
```

#### `domain-image-avatarLegacy-base`

- Command(s): `image.avatarLegacy()`
- Preview data:
```csv
"Value"
"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/8.jpg"
```

#### `domain-image-dataUri-base`

- Command(s): `image.dataUri()`
- Preview data:
```csv
"Value"
"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%222476%22%20height%3D%223320%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23db2805%22%2F%3E%3Ctext%20x%3D%221238%22%20y%3D%221660%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E2476x3320%3C%2Ftext%3E%3C%2Fsvg%3E"
```

#### `domain-image-personPortrait-base`

- Command(s): `image.personPortrait()`
- Preview data:
```csv
"Value"
"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/96.jpg"
```

#### `domain-image-url-base`

- Command(s): `image.url()`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3937/617?lock=3931926876699204"
```

#### `domain-image-url-arg-height`

- Command(s): `image.url(height=2)`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3193/2?lock=3191839961479511"
```

#### `domain-image-url-arg-width`

- Command(s): `image.url(width=3)`
- Preview data:
```csv
"Value"
"https://picsum.photos/seed/3UIYDPaNWB/3/984"
```

#### `domain-image-url-pair-height-width`

- Command(s): `image.url(height=2, width=3)`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3/2?lock=7146576591433292"
```

#### `domain-image-urlLoremFlickr-base`

- Command(s): `image.urlLoremFlickr()`
- Preview data:
```csv
"Value"
"https://loremflickr.com/3481/2017?lock=3236073595510946"
```

#### `domain-image-urlPicsumPhotos-base`

- Command(s): `image.urlPicsumPhotos()`
- Preview data:
```csv
"Value"
"https://picsum.photos/seed/s9gojEHeQ/1634/3581?grayscale&blur=1"
```

#### `domain-image-urlPlaceholder-base`

- Command(s): `image.urlPlaceholder()`
- Preview data:
```csv
"Value"
"https://via.placeholder.com/3214x1881/defd36/91bc2c.jpg?text=comedo%20vespillo%20venio"
```

#### `domain-internet-color-base`

- Command(s): `internet.color()`
- Preview data:
```csv
"Value"
"#2f0204"
```

#### `domain-internet-displayName-base`

- Command(s): `internet.displayName()`
- Preview data:
```csv
"Value"
"Demetrius.Kuhlman"
```

#### `domain-internet-domainName-base`

- Command(s): `internet.domainName()`
- Preview data:
```csv
"Value"
"french-tuber.org"
```

#### `domain-internet-domainSuffix-base`

- Command(s): `internet.domainSuffix()`
- Preview data:
```csv
"Value"
"name"
```

#### `domain-internet-domainWord-base`

- Command(s): `internet.domainWord()`
- Preview data:
```csv
"Value"
"pure-alb"
```

#### `domain-internet-email-base`

- Command(s): `internet.email()`
- Preview data:
```csv
"Value"
"Brian42@yahoo.com"
```

#### `domain-internet-email-arg-allowSpecialCharacters`

- Command(s): `internet.email(allowSpecialCharacters=true)`
- Preview data:
```csv
"Value"
"Brant=Abernathy@hotmail.com"
```

#### `domain-internet-email-arg-firstName`

- Command(s): `internet.email(firstName="Ada")`
- Preview data:
```csv
"Value"
"Ada.Schumm@gmail.com"
```

#### `domain-internet-email-arg-lastName`

- Command(s): `internet.email(lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Gavin.Lovelace62@yahoo.com"
```

#### `domain-internet-email-arg-provider`

- Command(s): `internet.email(provider="example.com")`
- Preview data:
```csv
"Value"
"Viola.Torphy@example.com"
```

#### `domain-internet-email-pair-allowSpecialCharacters-firstName`

- Command(s): `internet.email(allowSpecialCharacters=true, firstName="Ada")`
- Preview data:
```csv
"Value"
"Ada93@hotmail.com"
```

#### `domain-internet-email-pair-firstName-lastName`

- Command(s): `internet.email(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Ada.Lovelace55@yahoo.com"
```

#### `domain-internet-email-pair-lastName-provider`

- Command(s): `internet.email(lastName="Lovelace", provider="example.com")`
- Preview data:
```csv
"Value"
"Euna.Lovelace@example.com"
```

#### `domain-internet-emoji-base`

- Command(s): `internet.emoji()`
- Preview data:
```csv
"Value"
"🐆"
```

#### `domain-internet-emoji-arg-types`

- Command(s): `internet.emoji(types=["food"])`
- Preview data:
```csv
"Value"
"🫑"
```

#### `domain-internet-exampleEmail-base`

- Command(s): `internet.exampleEmail()`
- Preview data:
```csv
"Value"
"Hulda5@example.org"
```

#### `domain-internet-httpMethod-base`

- Command(s): `internet.httpMethod()`
- Preview data:
```csv
"Value"
"PATCH"
```

#### `domain-internet-httpStatusCode-base`

- Command(s): `internet.httpStatusCode()`
- Preview data:
```csv
"Value"
"401"
```

#### `domain-internet-ip-base`

- Command(s): `internet.ip()`
- Preview data:
```csv
"Value"
"229.141.100.182"
```

#### `domain-internet-ipv4-base`

- Command(s): `internet.ipv4()`
- Preview data:
```csv
"Value"
"52.210.222.85"
```

#### `domain-internet-ipv4-arg-cidrBlock`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24")`
- Preview data:
```csv
"Value"
"192.168.0.68"
```

#### `domain-internet-ipv4-arg-network`

- Command(s): `internet.ipv4(network="private-a")`
- Preview data:
```csv
"Value"
"10.77.209.214"
```

#### `domain-internet-ipv4-pair-cidrBlock-network`

- Command(s): `internet.ipv4(cidrBlock="192.168.0.0/24", network="private-a")`
- Preview data:
```csv
"Value"
"192.168.0.45"
```

#### `domain-internet-ipv6-base`

- Command(s): `internet.ipv6()`
- Preview data:
```csv
"Value"
"ff36:bc8e:3eea:4c8e:ac0b:50a2:fc4a:dbcf"
```

#### `domain-internet-jwt-base`

- Command(s): `internet.jwt()`
- Preview data:
```csv
"Value"
"eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODEyNTQ2OTEsImV4cCI6MTc4MTMxMDc3MiwibmJmIjoxNzc4MDQ1NzczLCJpc3MiOiJTYXR0ZXJmaWVsZCBHcm91cCIsInN1YiI6IjYxMzIwNjNhLTE5MjktNDkwZi1iNWNhLTM2MWU2NmM1MmRkNCIsImF1ZCI6IjQwNjEwNWNkLTE2MjgtNDA4Yi1iN2EyLWQ2NmM1M2Y3NGFiNSIsImp0aSI6IjU4YmNiMzdkLTRkOGEtNGYyZS04ZDNmLTQyMGM4MGExNGMwNCJ9.MLGSLGF7hNjp6RghVgC2GZIDrfHAZBBIZ8WaqXFphTbyRPkIFKnEnnSToLoWkvDw"
```

#### `domain-internet-jwt-arg-header`

- Command(s): `internet.jwt(header={})`
- Preview data:
```csv
"Value"
"e30.eyJpYXQiOjE3ODEyNjQzOTcsImV4cCI6MTc4MTI4Njg0OSwibmJmIjoxNzg3NjA3MTY2LCJpc3MiOiJGYWhleSwgS2lobiBhbmQgUmVpY2hlcnQiLCJzdWIiOiIxYzQyMmU2ZS1lNzcxLTRmMDAtYmU3OS02NzAwNGViZjg1OGYiLCJhdWQiOiI5MmY3OTFiMy0wYTI5LTQ4ZjItOWUxZS00MGU1Yzk2NTkzYWQiLCJqdGkiOiJkNzk2YzA3Yy0zNjRmLTQzNjgtYWJhZS00N2M3NTExODk4MWEifQ.e8QhcTHj4nBTF2jK53PylJjqBpYeMf9N0oMfTsbM6jKYhngnf0HuiaRiyjUW5TWk"
```

#### `domain-internet-jwt-arg-payload`

- Command(s): `internet.jwt(payload={})`
- Preview data:
```csv
"Value"
"eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.e30.bzBMPPc25eqL3Wz5ty1xLOmqFcQ5UhbkK5Bz27pZJGMImquk9U1G93TTIT78S0Li"
```

#### `domain-internet-jwt-arg-refDate`

- Command(s): `internet.jwt(refDate=4)`
- Preview data:
```csv
"Value"
"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOi0xMTYxMCwiZXhwIjo2OTYyMSwibmJmIjozMTE3NTUyMywiaXNzIjoiU2lwZXMsIEJhdHogYW5kIExvd2UiLCJzdWIiOiIxZWVhZGYwNC0zMDQ2LTRkYmItOWVhNC0yMGY1Zjg5N2Y2YWQiLCJhdWQiOiI2ZmJhMDFiYS0yMWY0LTRlZTQtYmVlZC1iZjA2MDlhMTNkMzAiLCJqdGkiOiI0NDFlMWI4ZC00MmFhLTQzM2UtODA0Ni05YmNiZmFjY2ZjZGIifQ.ShTkX7nPtnWynmGL3sA1GZzI2AzKj6Mj3LgvWpTuDw2z02aONYVFT1gwYoVsPPH4"
```

#### `domain-internet-jwt-pair-header-payload`

- Command(s): `internet.jwt(header={}, payload={})`
- Preview data:
```csv
"Value"
"e30.e30.O604I0hDV1mFaT0FXBy2U9vHZNugne9xahCoN7ydkh96jHDR36zV9TDxv6yQjGqM"
```

#### `domain-internet-jwt-pair-payload-refDate`

- Command(s): `internet.jwt(payload={}, refDate=4)`
- Preview data:
```csv
"Value"
"eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.e30.cqMtfsjVRe4taxGy1S7uH1KOAlSBZSXQoKXttlGA5b8LcMBlMXhYYMZxt7ED45qV"
```

#### `domain-internet-jwtAlgorithm-base`

- Command(s): `internet.jwtAlgorithm()`
- Preview data:
```csv
"Value"
"ES256"
```

#### `domain-internet-mac-base`

- Command(s): `internet.mac()`
- Preview data:
```csv
"Value"
"45:11:8d:5b:a6:32"
```

#### `domain-internet-mac-arg-separator`

- Command(s): `internet.mac(separator="-")`
- Preview data:
```csv
"Value"
"c0-c3-a3-5e-ef-da"
```

#### `domain-internet-password-base`

- Command(s): `internet.password()`
- Preview data:
```csv
"Value"
"TBoqXmfYfXk3I3A"
```

#### `domain-internet-password-example-1`

- Command(s): `internet.password(length=10, memorable=false, pattern="[A-Za-z0-9]", prefix="#")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"#wMJJrPMVo"
```

#### `domain-internet-password-arg-length`

- Command(s): `internet.password(length=12)`
- Preview data:
```csv
"Value"
"hzyT0010JBYb"
```

#### `domain-internet-password-arg-memorable`

- Command(s): `internet.password(memorable=true)`
- Preview data:
```csv
"Value"
"zapeboqulewufuf"
```

#### `domain-internet-password-arg-pattern`

- Command(s): `internet.password(pattern="[A-Z]")`
- Preview data:
```csv
"Value"
"BVSNRUBNEAWUTJT"
```

#### `domain-internet-password-arg-prefix`

- Command(s): `internet.password(prefix="#")`
- Preview data:
```csv
"Value"
"#xxsm9CX1flFshv"
```

#### `domain-internet-password-pair-length-memorable`

- Command(s): `internet.password(length=12, memorable=true)`
- Preview data:
```csv
"Value"
"jecotucenedo"
```

#### `domain-internet-password-pair-memorable-pattern`

- Command(s): `internet.password(memorable=true, pattern="[A-Z]")`
- Preview data:
```csv
"Value"
"nomudolunexolec"
```

#### `domain-internet-password-pair-pattern-prefix`

- Command(s): `internet.password(pattern="[A-Z]", prefix="#")`
- Preview data:
```csv
"Value"
"#EXCEEXMTTHRSHT"
```

#### `domain-internet-port-base`

- Command(s): `internet.port()`
- Preview data:
```csv
"Value"
"63399"
```

#### `domain-internet-protocol-base`

- Command(s): `internet.protocol()`
- Preview data:
```csv
"Value"
"http"
```

#### `domain-internet-url-base`

- Command(s): `internet.url()`
- Preview data:
```csv
"Value"
"https://grave-overheard.org"
```

#### `domain-internet-url-arg-appendSlash`

- Command(s): `internet.url(appendSlash=true)`
- Preview data:
```csv
"Value"
"https://pleasing-scrap.biz/"
```

#### `domain-internet-url-arg-protocol`

- Command(s): `internet.url(protocol="https")`
- Preview data:
```csv
"Value"
"https://zealous-flat.net"
```

#### `domain-internet-url-pair-appendSlash-protocol`

- Command(s): `internet.url(appendSlash=true, protocol="https")`
- Preview data:
```csv
"Value"
"https://good-natured-hovel.info/"
```

#### `domain-internet-userAgent-base`

- Command(s): `internet.userAgent()`
- Preview data:
```csv
"Value"
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/560.22 (KHTML, like Gecko) Chrome/100.9.0.1 Safari/555.7 Edg/113.8.7.15"
```

#### `domain-internet-username-base`

- Command(s): `internet.username()`
- Preview data:
```csv
"Value"
"Kailey2"
```

#### `domain-internet-username-arg-firstName`

- Command(s): `internet.username(firstName="Ada")`
- Preview data:
```csv
"Value"
"Ada_Bode"
```

#### `domain-internet-username-arg-lastName`

- Command(s): `internet.username(lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Dallin.Lovelace"
```

#### `domain-internet-username-pair-firstName-lastName`

- Command(s): `internet.username(firstName="Ada", lastName="Lovelace")`
- Preview data:
```csv
"Value"
"Ada.Lovelace"
```

#### `domain-internet-userName-base`

- Command(s): `internet.userName()`
- Preview data:
```csv
"Value"
"Marlee30"
```

#### `domain-literal-value-base`

- Command(s): `literal.value()`
- Preview data:
```csv
"Value"
""
```

#### `domain-literal-value-example-1`

- Command(s): `literal.value("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Pending"
```

#### `domain-literal-value-example-2`

- Command(s): `literal.value("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
""
```

#### `domain-literal-value-arg-value`

- Command(s): `literal.value(value=true)`
- Preview data:
```csv
"Value"
"true"
```

#### `domain-location-buildingNumber-base`

- Command(s): `location.buildingNumber()`
- Preview data:
```csv
"Value"
"86561"
```

#### `domain-location-cardinalDirection-base`

- Command(s): `location.cardinalDirection()`
- Preview data:
```csv
"Value"
"North"
```

#### `domain-location-city-base`

- Command(s): `location.city()`
- Preview data:
```csv
"Value"
"Antelope"
```

#### `domain-location-continent-base`

- Command(s): `location.continent()`
- Preview data:
```csv
"Value"
"Africa"
```

#### `domain-location-country-base`

- Command(s): `location.country()`
- Preview data:
```csv
"Value"
"Eritrea"
```

#### `domain-location-countryCode-base`

- Command(s): `location.countryCode()`
- Preview data:
```csv
"Value"
"GU"
```

#### `domain-location-county-base`

- Command(s): `location.county()`
- Preview data:
```csv
"Value"
"Cumbria"
```

#### `domain-location-direction-base`

- Command(s): `location.direction()`
- Preview data:
```csv
"Value"
"West"
```

#### `domain-location-direction-arg-abbreviated`

- Command(s): `location.direction(abbreviated=true)`
- Preview data:
```csv
"Value"
"S"
```

#### `domain-location-latitude-base`

- Command(s): `location.latitude()`
- Preview data:
```csv
"Value"
"41.3757"
```

#### `domain-location-latitude-arg-min`

- Command(s): `location.latitude(min=1)`
- Preview data:
```csv
"Value"
"12.2218"
```

#### `domain-location-latitude-arg-max`

- Command(s): `location.latitude(max=3)`
- Preview data:
```csv
"Value"
"-85.9885"
```

#### `domain-location-latitude-arg-precision`

- Command(s): `location.latitude(precision=4)`
- Preview data:
```csv
"Value"
"-16.2319"
```

#### `domain-location-latitude-pair-min-max`

- Command(s): `location.latitude(min=1, max=3)`
- Preview data:
```csv
"Value"
"2.315"
```

#### `domain-location-latitude-pair-max-precision`

- Command(s): `location.latitude(max=3, precision=4)`
- Preview data:
```csv
"Value"
"-52.1397"
```

#### `domain-location-longitude-base`

- Command(s): `location.longitude()`
- Preview data:
```csv
"Value"
"156.4157"
```

#### `domain-location-longitude-arg-min`

- Command(s): `location.longitude(min=1)`
- Preview data:
```csv
"Value"
"26.1188"
```

#### `domain-location-longitude-arg-max`

- Command(s): `location.longitude(max=3)`
- Preview data:
```csv
"Value"
"-68.5071"
```

#### `domain-location-longitude-arg-precision`

- Command(s): `location.longitude(precision=4)`
- Preview data:
```csv
"Value"
"-52.7542"
```

#### `domain-location-longitude-pair-min-max`

- Command(s): `location.longitude(min=1, max=3)`
- Preview data:
```csv
"Value"
"1.1204"
```

#### `domain-location-longitude-pair-max-precision`

- Command(s): `location.longitude(max=3, precision=4)`
- Preview data:
```csv
"Value"
"-134.0996"
```

#### `domain-location-ordinalDirection-base`

- Command(s): `location.ordinalDirection()`
- Preview data:
```csv
"Value"
"Southeast"
```

#### `domain-location-secondaryAddress-base`

- Command(s): `location.secondaryAddress()`
- Preview data:
```csv
"Value"
"Apt. 818"
```

#### `domain-location-state-base`

- Command(s): `location.state()`
- Preview data:
```csv
"Value"
"Michigan"
```

#### `domain-location-state-arg-abbreviated`

- Command(s): `location.state(abbreviated=true)`
- Preview data:
```csv
"Value"
"WI"
```

#### `domain-location-street-base`

- Command(s): `location.street()`
- Preview data:
```csv
"Value"
"Brown Trafficway"
```

#### `domain-location-streetAddress-base`

- Command(s): `location.streetAddress()`
- Preview data:
```csv
"Value"
"428 Grant Walks"
```

#### `domain-location-streetAddress-arg-useFullAddress`

- Command(s): `location.streetAddress(useFullAddress=true)`
- Preview data:
```csv
"Value"
"6267 Euclid Avenue Apt. 758"
```

#### `domain-location-timeZone-base`

- Command(s): `location.timeZone()`
- Preview data:
```csv
"Value"
"America/North_Dakota/Beulah"
```

#### `domain-location-zipCode-base`

- Command(s): `location.zipCode()`
- Preview data:
```csv
"Value"
"86088"
```

#### `domain-lorem-lines-base`

- Command(s): `lorem.lines()`
- Preview data:
```csv
"Value"
"Celo defetiscor magnam chirographum peccatus contigo solium aggredior truculenter.
Optio torqueo vinco.
Tamquam neque repellendus adamo talio valens.
Demonstro crebro circumvenio aggero.
Speciosus demulceo celebrer copiose cunabula caritas ambulo caveo unde."
```

#### `domain-lorem-lines-arg-min`

- Command(s): `lorem.lines(min=1)`
- Preview data:
```csv
"Value"
"Abutor viridis tripudio calculus totam venio blanditiis talio."
```

#### `domain-lorem-lines-arg-max`

- Command(s): `lorem.lines(max=3)`
- Preview data:
```csv
"Value"
"Voluptatem vinum balbus ago.
Audentia utrum tamdiu tersus minima desino uter.
Expedita ducimus numquam sint aegrus vox accommodo amplitudo.
Ager conor adipisci admiratio cicuta id ullus apto ara conitor."
```

#### `domain-lorem-lines-arg-lineCount`

- Command(s): `lorem.lines(lineCount=2)`
- Preview data:
```csv
"Value"
"Comparo celebrer capio.
Nesciunt ipsa acerbitas cilicium thalassinus inflammatio."
```

#### `domain-lorem-lines-arg-lineCountMax`

- Command(s): `lorem.lines(lineCountMax=2)`
- Preview data:
```csv
"Value"
"Commodi civitas peccatus aestus ager nesciunt laboriosam quos.
Acidus ipsum spes nesciunt vulticulus.
Incidunt utor vito supplanto spes dens succurro uter vita.
Coma toties tribuo certe eius calco aperiam calco viridis tantillus.
Creta conforto usitas sol."
```

#### `domain-lorem-lines-arg-lineCountMin`

- Command(s): `lorem.lines(lineCountMin=1)`
- Preview data:
```csv
"Value"
"Calculus valetudo adopto tergeo tyrannus quaerat.
Tergo non conturbo vitae eligendi compono patruus ascit adipiscor.
Vulticulus absum adamo caste cena repellat abbas coadunatio spiculum.
Thymum solutio tamisium viscus quo.
Sint ultra adsum vester tres tametsi."
```

#### `domain-lorem-lines-pair-min-max`

- Command(s): `lorem.lines(min=1, max=3)`
- Preview data:
```csv
"Value"
"Dolore vere conicio suggero demo."
```

#### `domain-lorem-lines-pair-max-lineCount`

- Command(s): `lorem.lines(max=3, lineCount=2)`
- Preview data:
```csv
"Value"
"Aperiam cervus perspiciatis dedico deputo combibo tutis vester quis vigilo."
```

#### `domain-lorem-lines-pair-lineCount-lineCountMax`

- Command(s): `lorem.lines(lineCount=2, lineCountMax=2)`
- Preview data:
```csv
"Value"
"Tres vacuus somnus asper allatus allatus."
```

#### `domain-lorem-lines-pair-lineCountMax-lineCountMin`

- Command(s): `lorem.lines(lineCountMax=2, lineCountMin=1)`
- Preview data:
```csv
"Value"
"Nemo sophismata illo itaque.
Cernuus solutio sed comes degusto suscipio territo civitas."
```

#### `domain-lorem-paragraph-base`

- Command(s): `lorem.paragraph()`
- Preview data:
```csv
"Value"
"Voluptate adopto arguo. Titulus summisse molestiae arx careo patior. Alveus conservo canto succedo demergo cupressus collum amplus cotidie autem."
```

#### `domain-lorem-paragraph-arg-min`

- Command(s): `lorem.paragraph(min=1)`
- Preview data:
```csv
"Value"
"Decerno theatrum crapula utroque crastinus demoror bis."
```

#### `domain-lorem-paragraph-arg-max`

- Command(s): `lorem.paragraph(max=3)`
- Preview data:
```csv
"Value"
"Vulnero deleniti vitae aspicio sapiente. Decumbo voluptate claustrum ascisco angustus thema synagoga. Ad conspergo adfectus casso allatus patior."
```

#### `domain-lorem-paragraph-arg-sentenceCount`

- Command(s): `lorem.paragraph(sentenceCount=4)`
- Preview data:
```csv
"Value"
"Tergeo congregatio tolero. Trepide consuasor censura. Architecto aegrus creptio fugiat atqui delego."
```

#### `domain-lorem-paragraph-arg-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCountMax=5)`
- Preview data:
```csv
"Value"
"Amiculum ambulo depraedor clibanus quae tres coepi complectus creptio. Condico tonsor curatio aggero accusantium utrum demergo. Deripio creo trucido civis despecto."
```

#### `domain-lorem-paragraph-arg-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMin=6)`
- Preview data:
```csv
"Value"
"Alo quod argentum illo cattus decretum. Tenuis nemo conor campana bardus collum sint. Benevolentia sui sint tripudio conicio."
```

#### `domain-lorem-paragraph-pair-min-max`

- Command(s): `lorem.paragraph(min=1, max=3)`
- Preview data:
```csv
"Value"
"Labore labore torrens vesco tumultus attollo canto canonicus cupiditate."
```

#### `domain-lorem-paragraph-pair-max-sentenceCount`

- Command(s): `lorem.paragraph(max=3, sentenceCount=4)`
- Preview data:
```csv
"Value"
"Repellendus aperiam textilis claro volubilis voluptas sophismata veritas tibi umerus. Ultio deleniti voco audacia depulso astrum inflammatio vulnus. Occaecati tactus titulus vel communis."
```

#### `domain-lorem-paragraph-pair-sentenceCount-sentenceCountMax`

- Command(s): `lorem.paragraph(sentenceCount=4, sentenceCountMax=5)`
- Preview data:
```csv
"Value"
"Tandem victus repellendus varius distinctio cur varietas video. Totus occaecati bene est vacuus versus. Voluptate crustulum adhuc artificiose libero super aperte labore peior laborum."
```

#### `domain-lorem-paragraph-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.paragraph(sentenceCountMax=5, sentenceCountMin=6)`
- Preview data:
```csv
"Value"
"Quas tonsor ambulo tum. Ascit aggredior crepusculum quis constans articulus corona adiuvo. Thesis amita video solium ultra exercitationem."
```

#### `domain-lorem-paragraphs-base`

- Command(s): `lorem.paragraphs()`
- Preview data:
```csv
"Value"
"Tandem surgo ulterius defero aut veniam communis. Porro claro conturbo urbs aestivus cognomen advenio aureus sulum collum. Tertius apud bonus ara fugit totam tempora veritas.
Adduco congregatio crinis nam ascit tabernus cupiditate curo. Curso cohibeo nesciunt alioqui vilitas. Cubo aspicio abutor corporis tergiversatio tam adaugeo.
Defendo tergo spectaculum. Caries laborum spes solitudo aestivus. Curvo comparo rem."
```

#### `domain-lorem-paragraphs-arg-min`

- Command(s): `lorem.paragraphs(min=1)`
- Preview data:
```csv
"Value"
"Arca deprimo confugo amplexus arcus vulnus vester titulus super suffoco. Cruentus debilito adulatio audacia vicinus pax attonbitus delicate cuius. Arbustum demens doloribus dolor."
```

#### `domain-lorem-paragraphs-arg-max`

- Command(s): `lorem.paragraphs(max=3)`
- Preview data:
```csv
"Value"
"Cogo decet adflicto sumptus ut. Amo sustineo creta templum. Sapiente creator non decipio comes comminor aro aliquid curso.3Amplitudo et aliqua solitudo cruciamentum atque versus sustineo audacia credo. Alias decipio demens nemo speciosus absens ustilo vinco. Cetera impedit despecto apto.3Viriliter denuo thymbra curiositas vomito rerum canonicus amplitudo. Comprehendo bestia ambulo aranea adipiscor temperantia amaritudo culpo curia addo. Ex pax canonicus statua sperno adfero copia vulgaris videlicet."
```

#### `domain-lorem-paragraphs-arg-paragraphCount`

- Command(s): `lorem.paragraphs(paragraphCount=4)`
- Preview data:
```csv
"Value"
"Avaritia decor odio alienus aliquid confido delectus. Curriculum angelus cubo vulgaris crustulum vinco canonicus ventito. Patruus depulso venio addo.
Usitas ipsum comitatus accusator angulus tibi cubitum. Adicio debeo dedecor comitatus comminor aut succedo conor tandem. Cruciamentum tutamen tui angelus totidem deserunt decipio.
Cohors complectus chirographum aiunt bibo condico appono cornu censura. Consequuntur tres sponte caute. Colo ea nostrum vehemens alius molestias victus."
```

#### `domain-lorem-paragraphs-arg-separator`

- Command(s): `lorem.paragraphs(separator="-")`
- Preview data:
```csv
"Value"
"Auxilium capto volva arca perspiciatis. Quod odio cum turpis ascisco culpa sed consequuntur cogo. Tracto ademptio quas sufficio decet tempora utrum.
Cuppedia aegrus defluo vociferor venia. Cresco odit contigo vinco pectus vinum vapulus. Victoria bestia claustrum decretum benevolentia soleo.
Patruus vorax cariosus laboriosam. Defleo vox textor desipio voluptas apostolus caelum. Claustrum cometes talio super placeat aut."
```

#### `domain-lorem-paragraphs-arg-paragraphCountMax`

- Command(s): `lorem.paragraphs(paragraphCountMax=6)`
- Preview data:
```csv
"Value"
"Varius averto adeptio vestigium versus acerbitas peccatus fugit. Tam cunctatio crebro demitto corrumpo. Conicio vester utroque ascit ab unde quidem.
Tonsor adstringo sollers validus acceptus sumo vel totus vulariter. Assentator carbo amo suppellex crapula decor. Tenax defluo appono vix vulnero bos utpote.
Sophismata angustus alveus eveniet ventito. Theatrum somnus conduco sublime. Corrupti benigne uberrime aegrotatio cursus suscipit."
```

#### `domain-lorem-paragraphs-arg-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMin=7)`
- Preview data:
```csv
"Value"
"Strues aeneus debilito pectus capto perferendis antiquus doloremque placeat acsi. Advoco ventosus suus collum thymum truculenter beneficium ratione cruciamentum. Coniecto valens terreo.
Decens ara cubitum. Deinde adamo communis summopere placeat. Complectus amor suasoria vigor.
Arca aro vinculum. Synagoga alias tracto ars conforto crudelis solitudo ascisco. Ventosus circumvenio concido versus via arbustum maiores thymbra."
```

#### `domain-lorem-paragraphs-pair-min-max`

- Command(s): `lorem.paragraphs(min=1, max=3)`
- Preview data:
```csv
"Value"
"Arbitro aequus turbo cur coerceo bestia acer facilis. Collum ut varietas chirographum pecto coadunatio. Pariatur derelinquo solus rem tempus arcus necessitatibus validus voluptate."
```

#### `domain-lorem-paragraphs-pair-max-paragraphCount`

- Command(s): `lorem.paragraphs(max=3, paragraphCount=4)`
- Preview data:
```csv
"Value"
"Sopor collum suus. Thalassinus speculum ut. Audeo beneficium arx repellat teres creator numquam carmen.3Velum cubitum aranea surculus arceo centum tantillus cumque. Defero capto demo summisse sto venio stultus adnuo derelinquo. Crepusculum acer tantum vulgo.3Sufficio accendo compono arcesso voluptates surculus demulceo. Denuncio tantum tertius angustus. Distinctio delectus iste pariatur."
```

#### `domain-lorem-paragraphs-pair-paragraphCount-separator`

- Command(s): `lorem.paragraphs(paragraphCount=4, separator="-")`
- Preview data:
```csv
"Value"
"Culpo arcesso voluptatum antiquus suscipit. Vestrum nam advenio aer tabula tondeo expedita eaque. Odio decretum tunc sint volubilis casus reprehenderit odio nulla.
Addo consectetur fugit vesica spectaculum sperno curo alveus. Velit odio aegrus amplexus. Ancilla ubi congregatio stabilis.
Spoliatio taceo deporto temporibus adfectus ipsum. Cum tyrannus adhuc totam. Illo vae uredo sursum carbo absorbeo admoveo valeo titulus strues."
```

#### `domain-lorem-paragraphs-pair-separator-paragraphCountMax`

- Command(s): `lorem.paragraphs(separator="-", paragraphCountMax=6)`
- Preview data:
```csv
"Value"
"Aiunt amicitia animus decimus. Temeritas quis nemo. Tibi ubi optio absconditus aufero.
Careo volubilis arbitro. Accendo crapula desino canto odit doloribus valde libero debeo turpis. Aiunt crux virgo recusandae alveus vinitor speciosus unde abbas acidus.
Velut conicio temptatio armarium sint aspicio apostolus. Tolero claudeo congregatio credo vis ulterius. Repellendus consequatur molestiae avaritia sursum comptus carcer aperio."
```

#### `domain-lorem-paragraphs-pair-paragraphCountMax-paragraphCountMin`

- Command(s): `lorem.paragraphs(paragraphCountMax=6, paragraphCountMin=7)`
- Preview data:
```csv
"Value"
"Color crur suffragium veniam voluptas. Commodi angelus molestias suppono asper ait eum thymbra synagoga. Magnam utpote asper stips.
Veritas clamo coaegresco verus. Aveho blanditiis campana debeo vinum. Cito amitto speciosus caterva a comitatus volo.
Absorbeo canonicus acquiro subnecto vito vacuus. Eveniet arcus appono viriliter supplanto sollicito temporibus super. Exercitationem paens nulla abutor beatus quia defendo autus argumentum temeritas."
```

#### `domain-lorem-sentence-base`

- Command(s): `lorem.sentence()`
- Preview data:
```csv
"Value"
"Thymum curo rerum utrum."
```

#### `domain-lorem-sentence-arg-min`

- Command(s): `lorem.sentence(min=1)`
- Preview data:
```csv
"Value"
"Appello."
```

#### `domain-lorem-sentence-arg-max`

- Command(s): `lorem.sentence(max=3)`
- Preview data:
```csv
"Value"
"Ter textus admoneo acceptus deripio ullam succedo clam odit succurro."
```

#### `domain-lorem-sentence-arg-wordCount`

- Command(s): `lorem.sentence(wordCount=4)`
- Preview data:
```csv
"Value"
"Voluptas despecto admoneo aestivus auxilium adhuc aegre dicta."
```

#### `domain-lorem-sentence-arg-wordCountMax`

- Command(s): `lorem.sentence(wordCountMax=5)`
- Preview data:
```csv
"Value"
"Vivo accendo sint placeat supellex amoveo damnatio aegre."
```

#### `domain-lorem-sentence-arg-wordCountMin`

- Command(s): `lorem.sentence(wordCountMin=6)`
- Preview data:
```csv
"Value"
"Denuo torqueo id cohibeo deludo depono truculenter delectatio tolero."
```

#### `domain-lorem-sentence-pair-min-max`

- Command(s): `lorem.sentence(min=1, max=3)`
- Preview data:
```csv
"Value"
"Summa."
```

#### `domain-lorem-sentence-pair-max-wordCount`

- Command(s): `lorem.sentence(max=3, wordCount=4)`
- Preview data:
```csv
"Value"
"Civis reprehenderit tripudio."
```

#### `domain-lorem-sentence-pair-wordCount-wordCountMax`

- Command(s): `lorem.sentence(wordCount=4, wordCountMax=5)`
- Preview data:
```csv
"Value"
"Tego vilitas assumenda desidero."
```

#### `domain-lorem-sentence-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.sentence(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv
"Value"
"Pecto sequi accommodo aegrotatio."
```

#### `domain-lorem-sentences-base`

- Command(s): `lorem.sentences()`
- Preview data:
```csv
"Value"
"Virgo blandior adflicto. Adeo vos sortitus conventus ventito. Arca defessus tres argumentum amissio."
```

#### `domain-lorem-sentences-arg-min`

- Command(s): `lorem.sentences(min=1)`
- Preview data:
```csv
"Value"
"Ullam coruscus alienus avaritia vulnero."
```

#### `domain-lorem-sentences-arg-max`

- Command(s): `lorem.sentences(max=3)`
- Preview data:
```csv
"Value"
"Officiis angustus assentator cur sit.3Totam utilis tergiversatio clibanus auditor cunabula cena.3Umquam deporto caelum.3Vomito consequuntur soleo voluptates tamisium textilis deprecator absque ambitus demo.3Depono cunae tergum spectaculum quia expedita.3Thalassinus tyrannus molestias bellicus."
```

#### `domain-lorem-sentences-arg-sentenceCount`

- Command(s): `lorem.sentences(sentenceCount=4)`
- Preview data:
```csv
"Value"
"Vilis valens vacuus theatrum excepturi cras conservo vinculum. Termes antiquus aggero deserunt. Artificiose aestivus audax doloremque basium."
```

#### `domain-lorem-sentences-arg-separator`

- Command(s): `lorem.sentences(separator="-")`
- Preview data:
```csv
"Value"
"Virgo cibus tres speculum vacuus omnis talio comprehendo earum. Demens ambitus minima advenio abeo. Usitas surculus veniam atrox carcer thorax corona. Taceo bos solutio tamquam admoveo villa cognomen tertius placeat. Causa alo bellum vestigium video ademptio vomica. Crudelis consectetur spectaculum tempus ullam."
```

#### `domain-lorem-sentences-arg-sentenceCountMax`

- Command(s): `lorem.sentences(sentenceCountMax=6)`
- Preview data:
```csv
"Value"
"Nemo ciminatio coruscus cognomen cum uredo adsidue sodalitas stipes cometes. Acerbitas turpis terebro sodalitas colligo deputo. Thermae truculenter absorbeo textor tyrannus arbustum debeo. Ducimus antepono solium arca tergo celebrer torqueo. Toties vesco cras stabilis tamisium infit summa beatus sublime coerceo."
```

#### `domain-lorem-sentences-arg-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMin=7)`
- Preview data:
```csv
"Value"
"Beneficium vita viduo clementia. Exercitationem tergiversatio appello. Commodi harum validus surculus venio enim cultellus claudeo. Illo tot trucido thymbra teneo laudantium sopor autem. Verbera amitto tertius vomito subseco tertius. Subvenio charisma velut."
```

#### `domain-lorem-sentences-pair-min-max`

- Command(s): `lorem.sentences(min=1, max=3)`
- Preview data:
```csv
"Value"
"Aedificium amo demum vicinus tribuo."
```

#### `domain-lorem-sentences-pair-max-sentenceCount`

- Command(s): `lorem.sentences(max=3, sentenceCount=4)`
- Preview data:
```csv
"Value"
"Caute carcer sumo textor.3Cariosus denuncio nostrum depulso pecto ad aduro.3Utilis defero tardus aequus taceo angustus beneficium carcer voluptatem volaticus.3Cras abbas avaritia."
```

#### `domain-lorem-sentences-pair-sentenceCount-separator`

- Command(s): `lorem.sentences(sentenceCount=4, separator="-")`
- Preview data:
```csv
"Value"
"Atrocitas arbitro desidero torrens atqui despecto vito dolore. Arto sol tendo. Adeo triduana facilis cum laboriosam amicitia. Voluptas surculus tabernus voluptatibus victus."
```

#### `domain-lorem-sentences-pair-separator-sentenceCountMax`

- Command(s): `lorem.sentences(separator="-", sentenceCountMax=6)`
- Preview data:
```csv
"Value"
"Cattus animadverto urbs utrimque subiungo sint vulgivagus conqueror nostrum. Cibo coma adsidue aequus virtus considero dolore aetas commodo officia. Atavus adsuesco eaque degusto. Tepidus supellex attonbitus. Accommodo summopere iusto celo vivo amor vivo quidem."
```

#### `domain-lorem-sentences-pair-sentenceCountMax-sentenceCountMin`

- Command(s): `lorem.sentences(sentenceCountMax=6, sentenceCountMin=7)`
- Preview data:
```csv
"Value"
"Carmen bestia angelus tergiversatio cunabula assumenda terror tamisium sed alias. Perferendis audio odit facere. Canonicus suscipit voluptas. Vito corroboro incidunt recusandae ultra civis repellendus."
```

#### `domain-lorem-slug-base`

- Command(s): `lorem.slug()`
- Preview data:
```csv
"Value"
"vacuus-arcesso-volva"
```

#### `domain-lorem-slug-arg-min`

- Command(s): `lorem.slug(min=1)`
- Preview data:
```csv
"Value"
"vociferor"
```

#### `domain-lorem-slug-arg-max`

- Command(s): `lorem.slug(max=3)`
- Preview data:
```csv
"Value"
"assumenda-nam-capillus"
```

#### `domain-lorem-slug-arg-wordCount`

- Command(s): `lorem.slug(wordCount=4)`
- Preview data:
```csv
"Value"
"vulariter-est-antea"
```

#### `domain-lorem-slug-arg-wordCountMax`

- Command(s): `lorem.slug(wordCountMax=5)`
- Preview data:
```csv
"Value"
"adipisci-absque-acies"
```

#### `domain-lorem-slug-arg-wordCountMin`

- Command(s): `lorem.slug(wordCountMin=6)`
- Preview data:
```csv
"Value"
"curatio-strenuus-voluntarius"
```

#### `domain-lorem-slug-pair-min-max`

- Command(s): `lorem.slug(min=1, max=3)`
- Preview data:
```csv
"Value"
"advoco"
```

#### `domain-lorem-slug-pair-max-wordCount`

- Command(s): `lorem.slug(max=3, wordCount=4)`
- Preview data:
```csv
"Value"
"comitatus-spiculum-tandem"
```

#### `domain-lorem-slug-pair-wordCount-wordCountMax`

- Command(s): `lorem.slug(wordCount=4, wordCountMax=5)`
- Preview data:
```csv
"Value"
"clarus-dedico-totus"
```

#### `domain-lorem-slug-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.slug(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv
"Value"
"vita-celebrer-adinventitias"
```

#### `domain-lorem-text-base`

- Command(s): `lorem.text()`
- Preview data:
```csv
"Value"
"Calamitas tristis iste consectetur bos sed verbum capitulus. Civitas absorbeo stella cilicium delinquo odit admoneo vinco auctor cui. Adhuc consuasor sui ullus vilis tergum neque contra.
Balbus tempora cura cohibeo angelus corrigo. Audax crebro delinquo demum adfectus ulciscor textilis. Desidero decens ex vae arx curriculum nostrum attollo cervus.
Adicio voluptatibus non aut brevis est sponte arguo iure. Bos confido venustas. Vestigium speculum fuga aggredior suffragium cernuus occaecati super cunae error."
```

#### `domain-lorem-word-base`

- Command(s): `lorem.word()`
- Preview data:
```csv
"Value"
"careo"
```

#### `domain-lorem-word-arg-min`

- Command(s): `lorem.word(min=1)`
- Preview data:
```csv
"Value"
"defluo"
```

#### `domain-lorem-word-arg-max`

- Command(s): `lorem.word(max=3)`
- Preview data:
```csv
"Value"
"voluptates"
```

#### `domain-lorem-word-arg-length`

- Command(s): `lorem.word(length=4)`
- Preview data:
```csv
"Value"
"nemo"
```

#### `domain-lorem-word-arg-strategy`

- Command(s): `lorem.word(strategy="lorem-word-strategy")`
- Preview data:
```csv
"Value"
"id"
```

#### `domain-lorem-word-pair-min-max`

- Command(s): `lorem.word(min=1, max=3)`
- Preview data:
```csv
"Value"
"vero"
```

#### `domain-lorem-word-pair-max-length`

- Command(s): `lorem.word(max=3, length=4)`
- Preview data:
```csv
"Value"
"curo"
```

#### `domain-lorem-word-pair-length-strategy`

- Command(s): `lorem.word(length=4, strategy="lorem-word-strategy")`
- Preview data:
```csv
"Value"
"vito"
```

#### `domain-lorem-words-base`

- Command(s): `lorem.words()`
- Preview data:
```csv
"Value"
"verus voluptates suppellex"
```

#### `domain-lorem-words-arg-min`

- Command(s): `lorem.words(min=1)`
- Preview data:
```csv
"Value"
"tollo"
```

#### `domain-lorem-words-arg-max`

- Command(s): `lorem.words(max=3)`
- Preview data:
```csv
"Value"
"illum triduana deficio"
```

#### `domain-lorem-words-arg-wordCount`

- Command(s): `lorem.words(wordCount=4)`
- Preview data:
```csv
"Value"
"optio cohaero uredo"
```

#### `domain-lorem-words-arg-wordCountMax`

- Command(s): `lorem.words(wordCountMax=5)`
- Preview data:
```csv
"Value"
"texo dolorum spargo"
```

#### `domain-lorem-words-arg-wordCountMin`

- Command(s): `lorem.words(wordCountMin=6)`
- Preview data:
```csv
"Value"
"defero vacuus impedit"
```

#### `domain-lorem-words-pair-min-max`

- Command(s): `lorem.words(min=1, max=3)`
- Preview data:
```csv
"Value"
"cibus"
```

#### `domain-lorem-words-pair-max-wordCount`

- Command(s): `lorem.words(max=3, wordCount=4)`
- Preview data:
```csv
"Value"
"mollitia abeo urbs"
```

#### `domain-lorem-words-pair-wordCount-wordCountMax`

- Command(s): `lorem.words(wordCount=4, wordCountMax=5)`
- Preview data:
```csv
"Value"
"sollicito tondeo et"
```

#### `domain-lorem-words-pair-wordCountMax-wordCountMin`

- Command(s): `lorem.words(wordCountMax=5, wordCountMin=6)`
- Preview data:
```csv
"Value"
"depono cedo absum"
```

#### `domain-music-album-base`

- Command(s): `music.album()`
- Preview data:
```csv
"Value"
"Majestic"
```

#### `domain-music-artist-base`

- Command(s): `music.artist()`
- Preview data:
```csv
"Value"
"George Michael"
```

#### `domain-music-genre-base`

- Command(s): `music.genre()`
- Preview data:
```csv
"Value"
"Latin"
```

#### `domain-music-songName-base`

- Command(s): `music.songName()`
- Preview data:
```csv
"Value"
"You've Got a Friend"
```

#### `domain-number-bigInt-base`

- Command(s): `number.bigInt()`
- Preview data:
```csv
"Value"
"571092089829729"
```

#### `domain-number-bigInt-arg-value`

- Command(s): `number.bigInt(value=true)`
- Preview data:
```csv
"Value"
"586349396167377"
```

#### `domain-number-binary-base`

- Command(s): `number.binary()`
- Preview data:
```csv
"Value"
"0"
```

#### `domain-number-binary-arg-max`

- Command(s): `number.binary(max=3)`
- Preview data:
```csv
"Value"
"0"
```

#### `domain-number-binary-arg-min`

- Command(s): `number.binary(min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-binary-pair-max-min`

- Command(s): `number.binary(max=3, min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-float-base`

- Command(s): `number.float()`
- Preview data:
```csv
"Value"
"0.3550653996448585"
```

#### `domain-number-float-arg-fractionDigits`

- Command(s): `number.float(fractionDigits=2)`
- Preview data:
```csv
"Value"
"0.73"
```

#### `domain-number-float-arg-max`

- Command(s): `number.float(max=3)`
- Preview data:
```csv
"Value"
"2.7132336805883557"
```

#### `domain-number-float-arg-min`

- Command(s): `number.float(min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-float-arg-multipleOf`

- Command(s): `number.float(multipleOf=0.5)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-float-pair-fractionDigits-max`

- Command(s): `number.float(fractionDigits=2, max=3)`
- Preview data:
```csv
"Value"
"0.32"
```

#### `domain-number-float-pair-max-min`

- Command(s): `number.float(max=3, min=1)`
- Preview data:
```csv
"Value"
"2.8150852265633652"
```

#### `domain-number-float-pair-min-multipleOf`

- Command(s): `number.float(min=1, multipleOf=0.5)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-hex-base`

- Command(s): `number.hex()`
- Preview data:
```csv
"Value"
"f"
```

#### `domain-number-hex-arg-min`

- Command(s): `number.hex(min=1)`
- Preview data:
```csv
"Value"
"b"
```

#### `domain-number-hex-arg-max`

- Command(s): `number.hex(max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-hex-pair-min-max`

- Command(s): `number.hex(min=1, max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-int-base`

- Command(s): `number.int()`
- Preview data:
```csv
"Value"
"1105340026189529"
```

#### `domain-number-int-arg-min`

- Command(s): `number.int(min=1)`
- Preview data:
```csv
"Value"
"4151426716022040"
```

#### `domain-number-int-arg-max`

- Command(s): `number.int(max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-int-arg-multipleOf`

- Command(s): `number.int(multipleOf=4)`
- Preview data:
```csv
"Value"
"3324814506500716"
```

#### `domain-number-int-pair-min-max`

- Command(s): `number.int(min=1, max=3)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-int-pair-max-multipleOf`

- Command(s): `number.int(max=3, multipleOf=4)`
- Preview data:
```csv
"Value"
"0"
```

#### `domain-number-octal-base`

- Command(s): `number.octal()`
- Preview data:
```csv
"Value"
"7"
```

#### `domain-number-octal-arg-max`

- Command(s): `number.octal(max=3)`
- Preview data:
```csv
"Value"
"3"
```

#### `domain-number-octal-arg-min`

- Command(s): `number.octal(min=1)`
- Preview data:
```csv
"Value"
"6"
```

#### `domain-number-octal-pair-max-min`

- Command(s): `number.octal(max=3, min=1)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-number-romanNumeral-base`

- Command(s): `number.romanNumeral()`
- Preview data:
```csv
"Value"
"MMMCDXXI"
```

#### `domain-number-romanNumeral-arg-min`

- Command(s): `number.romanNumeral(min=1)`
- Preview data:
```csv
"Value"
"CCXCI"
```

#### `domain-number-romanNumeral-arg-max`

- Command(s): `number.romanNumeral(max=3)`
- Preview data:
```csv
"Value"
"I"
```

#### `domain-number-romanNumeral-pair-min-max`

- Command(s): `number.romanNumeral(min=1, max=3)`
- Preview data:
```csv
"Value"
"II"
```

#### `domain-person-bio-base`

- Command(s): `person.bio()`
- Preview data:
```csv
"Value"
"environmentalist"
```

#### `domain-person-firstName-base`

- Command(s): `person.firstName()`
- Preview data:
```csv
"Value"
"Osbaldo"
```

#### `domain-person-firstName-arg-sex`

- Command(s): `person.firstName(sex="male")`
- Preview data:
```csv
"Value"
"Jon"
```

#### `domain-person-fullName-base`

- Command(s): `person.fullName()`
- Preview data:
```csv
"Value"
"Dixie Beer"
```

#### `domain-person-gender-base`

- Command(s): `person.gender()`
- Preview data:
```csv
"Value"
"Female to male transgender man"
```

#### `domain-person-jobArea-base`

- Command(s): `person.jobArea()`
- Preview data:
```csv
"Value"
"Directives"
```

#### `domain-person-jobDescriptor-base`

- Command(s): `person.jobDescriptor()`
- Preview data:
```csv
"Value"
"International"
```

#### `domain-person-jobTitle-base`

- Command(s): `person.jobTitle()`
- Preview data:
```csv
"Value"
"Human Accountability Producer"
```

#### `domain-person-jobType-base`

- Command(s): `person.jobType()`
- Preview data:
```csv
"Value"
"Manager"
```

#### `domain-person-lastName-base`

- Command(s): `person.lastName()`
- Preview data:
```csv
"Value"
"Koss"
```

#### `domain-person-lastName-arg-sex`

- Command(s): `person.lastName(sex="male")`
- Preview data:
```csv
"Value"
"Krajcik"
```

#### `domain-person-middleName-base`

- Command(s): `person.middleName()`
- Preview data:
```csv
"Value"
"Reagan"
```

#### `domain-person-middleName-arg-sex`

- Command(s): `person.middleName(sex="male")`
- Preview data:
```csv
"Value"
"Harrison"
```

#### `domain-person-prefix-base`

- Command(s): `person.prefix()`
- Preview data:
```csv
"Value"
"Dr."
```

#### `domain-person-prefix-arg-sex`

- Command(s): `person.prefix(sex="male")`
- Preview data:
```csv
"Value"
"Mr."
```

#### `domain-person-sex-base`

- Command(s): `person.sex()`
- Preview data:
```csv
"Value"
"male"
```

#### `domain-person-sexType-base`

- Command(s): `person.sexType()`
- Preview data:
```csv
"Value"
"male"
```

#### `domain-person-suffix-base`

- Command(s): `person.suffix()`
- Preview data:
```csv
"Value"
"DVM"
```

#### `domain-person-zodiacSign-base`

- Command(s): `person.zodiacSign()`
- Preview data:
```csv
"Value"
"Leo"
```

#### `domain-phone-imei-base`

- Command(s): `phone.imei()`
- Preview data:
```csv
"Value"
"79-903165-712789-0"
```

#### `domain-phone-number-base`

- Command(s): `phone.number()`
- Preview data:
```csv
"Value"
"1-329-484-4271 x034"
```

#### `domain-phone-number-arg-style`

- Command(s): `phone.number(style="international")`
- Preview data:
```csv
"Value"
"+18882200058"
```

#### `domain-string-alpha-base`

- Command(s): `string.alpha()`
- Preview data:
```csv
"Value"
"l"
```

#### `domain-string-alpha-arg-length`

- Command(s): `string.alpha(length=4)`
- Preview data:
```csv
"Value"
"eNHO"
```

#### `domain-string-alpha-arg-casing`

- Command(s): `string.alpha(casing="upper")`
- Preview data:
```csv
"Value"
"J"
```

#### `domain-string-alpha-arg-exclude`

- Command(s): `string.alpha(exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"Z"
```

#### `domain-string-alpha-pair-length-casing`

- Command(s): `string.alpha(length=4, casing="upper")`
- Preview data:
```csv
"Value"
"XLKS"
```

#### `domain-string-alpha-pair-casing-exclude`

- Command(s): `string.alpha(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"F"
```

#### `domain-string-alphanumeric-base`

- Command(s): `string.alphanumeric()`
- Preview data:
```csv
"Value"
"U"
```

#### `domain-string-alphanumeric-arg-length`

- Command(s): `string.alphanumeric(length=4)`
- Preview data:
```csv
"Value"
"LmDo"
```

#### `domain-string-alphanumeric-arg-casing`

- Command(s): `string.alphanumeric(casing="upper")`
- Preview data:
```csv
"Value"
"2"
```

#### `domain-string-alphanumeric-arg-exclude`

- Command(s): `string.alphanumeric(exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"N"
```

#### `domain-string-alphanumeric-pair-length-casing`

- Command(s): `string.alphanumeric(length=4, casing="upper")`
- Preview data:
```csv
"Value"
"IF7H"
```

#### `domain-string-alphanumeric-pair-casing-exclude`

- Command(s): `string.alphanumeric(casing="upper", exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"I"
```

#### `domain-string-binary-base`

- Command(s): `string.binary()`
- Preview data:
```csv
"Value"
"0b1"
```

#### `domain-string-binary-arg-length`

- Command(s): `string.binary(length=4)`
- Preview data:
```csv
"Value"
"0b0001"
```

#### `domain-string-binary-arg-prefix`

- Command(s): `string.binary(prefix="#")`
- Preview data:
```csv
"Value"
"#1"
```

#### `domain-string-binary-pair-length-prefix`

- Command(s): `string.binary(length=4, prefix="#")`
- Preview data:
```csv
"Value"
"#0001"
```

#### `domain-string-counterString-base`

- Command(s): `string.counterString(1, 25, "*")`
- Preview data:
```csv
"Value"
"2*4*6*8*11*"
```

#### `domain-string-counterString-example-1`

- Command(s): `string.counterString()`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"2*4*"
```

#### `domain-string-counterString-example-2`

- Command(s): `string.counterString(15)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"*3*5*7*9*12*15*"
```

#### `domain-string-counterString-example-3`

- Command(s): `string.counterString(min=5, max=12)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"2*4*6*"
```

#### `domain-string-counterString-example-4`

- Command(s): `string.counterString(min=12, max=12, delimiter="#")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"#3#5#7#9#12#"
```

#### `domain-string-counterString-arg-min`

- Command(s): `string.counterString(min=5)`
- Preview data:
```csv
"Value"
"*3*5*"
```

#### `domain-string-counterString-arg-max`

- Command(s): `string.counterString(max=12)`
- Preview data:
```csv
"Value"
"2*4*6*8*"
```

#### `domain-string-counterString-arg-delimiter`

- Command(s): `string.counterString(delimiter="#")`
- Preview data:
```csv
"Value"
"2#4#6#8#11#14#17#"
```

#### `domain-string-counterString-pair-min-max`

- Command(s): `string.counterString(min=5, max=12)`
- Preview data:
```csv
"Value"
"*3*5*"
```

#### `domain-string-counterString-pair-max-delimiter`

- Command(s): `string.counterString(max=12, delimiter="#")`
- Preview data:
```csv
"Value"
"#3#5#7#"
```

#### `domain-string-fromCharacters-base`

- Command(s): `string.fromCharacters("ABC123", 4)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"A3C3"
```

#### `domain-string-fromCharacters-example-1`

- Command(s): `string.fromCharacters("ABC123", 6)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"C1A22B"
```

#### `domain-string-fromCharacters-example-2`

- Command(s): `string.fromCharacters(characters=["A", "B", "C"], length=4)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"CBAB"
```

#### `domain-string-fromCharacters-arg-characters`

- Command(s): `string.fromCharacters(characters="ABC123")`
- Preview data:
```csv
"Value"
"B"
```

#### `domain-string-fromCharacters-arg-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv
"Value"
"2221"
```

#### `domain-string-fromCharacters-pair-characters-length`

- Command(s): `string.fromCharacters(characters="ABC123", length=4)`
- Preview data:
```csv
"Value"
"2CBB"
```

#### `domain-string-hexadecimal-base`

- Command(s): `string.hexadecimal()`
- Preview data:
```csv
"Value"
"0xC"
```

#### `domain-string-hexadecimal-arg-casing`

- Command(s): `string.hexadecimal(casing="upper")`
- Preview data:
```csv
"Value"
"0x8"
```

#### `domain-string-hexadecimal-arg-length`

- Command(s): `string.hexadecimal(length=4)`
- Preview data:
```csv
"Value"
"0xbAbc"
```

#### `domain-string-hexadecimal-arg-prefix`

- Command(s): `string.hexadecimal(prefix="#")`
- Preview data:
```csv
"Value"
"#E"
```

#### `domain-string-hexadecimal-pair-casing-length`

- Command(s): `string.hexadecimal(casing="upper", length=4)`
- Preview data:
```csv
"Value"
"0x8E8E"
```

#### `domain-string-hexadecimal-pair-length-prefix`

- Command(s): `string.hexadecimal(length=4, prefix="#")`
- Preview data:
```csv
"Value"
"#ffef"
```

#### `domain-string-nanoid-base`

- Command(s): `string.nanoid()`
- Preview data:
```csv
"Value"
"NdoP5wwyLFTWcdq-2JUPT"
```

#### `domain-string-nanoid-arg-length`

- Command(s): `string.nanoid(length=4)`
- Preview data:
```csv
"Value"
"emm-"
```

#### `domain-string-numeric-base`

- Command(s): `string.numeric()`
- Preview data:
```csv
"Value"
"8"
```

#### `domain-string-numeric-arg-length`

- Command(s): `string.numeric(length=4)`
- Preview data:
```csv
"Value"
"2920"
```

#### `domain-string-numeric-arg-allowLeadingZeros`

- Command(s): `string.numeric(allowLeadingZeros=true)`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-string-numeric-arg-exclude`

- Command(s): `string.numeric(exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-string-numeric-pair-length-allowLeadingZeros`

- Command(s): `string.numeric(length=4, allowLeadingZeros=true)`
- Preview data:
```csv
"Value"
"8990"
```

#### `domain-string-numeric-pair-allowLeadingZeros-exclude`

- Command(s): `string.numeric(allowLeadingZeros=true, exclude=["A", "B"])`
- Preview data:
```csv
"Value"
"6"
```

#### `domain-string-octal-base`

- Command(s): `string.octal()`
- Preview data:
```csv
"Value"
"0o3"
```

#### `domain-string-octal-arg-length`

- Command(s): `string.octal(length=4)`
- Preview data:
```csv
"Value"
"0o5416"
```

#### `domain-string-octal-arg-prefix`

- Command(s): `string.octal(prefix="#")`
- Preview data:
```csv
"Value"
"#6"
```

#### `domain-string-octal-pair-length-prefix`

- Command(s): `string.octal(length=4, prefix="#")`
- Preview data:
```csv
"Value"
"#2612"
```

#### `domain-string-sample-base`

- Command(s): `string.sample()`
- Preview data:
```csv
"Value"
"<BaB/g[//`"
```

#### `domain-string-sample-arg-length`

- Command(s): `string.sample(length=4)`
- Preview data:
```csv
"Value"
"}*V4"
```

#### `domain-string-symbol-base`

- Command(s): `string.symbol()`
- Preview data:
```csv
"Value"
")"
```

#### `domain-string-symbol-arg-length`

- Command(s): `string.symbol(length=4)`
- Preview data:
```csv
"Value"
">#>'"
```

#### `domain-string-ulid-base`

- Command(s): `string.ulid()`
- Preview data:
```csv
"Value"
"01KV01R36F4MY648F8XPVTRQE9"
```

#### `domain-string-ulid-arg-refDate`

- Command(s): `string.ulid(refDate=2)`
- Preview data:
```csv
"Value"
"00000000022P5BDQJ90BT5VFMX"
```

#### `domain-string-uuid-base`

- Command(s): `string.uuid()`
- Preview data:
```csv
"Value"
"5188d2de-3f7b-4998-a61f-cb3e78b71bb8"
```

#### `domain-system-commonFileExt-base`

- Command(s): `system.commonFileExt()`
- Preview data:
```csv
"Value"
"m2v"
```

#### `domain-system-commonFileName-base`

- Command(s): `system.commonFileName()`
- Preview data:
```csv
"Value"
"because.htm"
```

#### `domain-system-commonFileName-arg-extension`

- Command(s): `system.commonFileName(extension="system-commonFileName-extension")`
- Preview data:
```csv
"Value"
"brush_oh.system-commonFileName-extension"
```

#### `domain-system-commonFileType-base`

- Command(s): `system.commonFileType()`
- Preview data:
```csv
"Value"
"text"
```

#### `domain-system-cron-base`

- Command(s): `system.cron()`
- Preview data:
```csv
"Value"
"* * * 8 ?"
```

#### `domain-system-cron-arg-includeNonStandard`

- Command(s): `system.cron(includeNonStandard=true)`
- Preview data:
```csv
"Value"
"22 6 14 7 1"
```

#### `domain-system-cron-arg-includeYear`

- Command(s): `system.cron(includeYear=true)`
- Preview data:
```csv
"Value"
"* 1 ? 9 5 *"
```

#### `domain-system-cron-pair-includeNonStandard-includeYear`

- Command(s): `system.cron(includeNonStandard=true, includeYear=true)`
- Preview data:
```csv
"Value"
"@hourly"
```

#### `domain-system-directoryPath-base`

- Command(s): `system.directoryPath()`
- Preview data:
```csv
"Value"
"/etc"
```

#### `domain-system-fileExt-base`

- Command(s): `system.fileExt()`
- Preview data:
```csv
"Value"
"ear"
```

#### `domain-system-fileExt-arg-mimeType`

- Command(s): `system.fileExt(mimeType="system-fileExt-mimeType")`
- Preview data:
```csv
"Value"
"epub"
```

#### `domain-system-fileName-base`

- Command(s): `system.fileName()`
- Preview data:
```csv
"Value"
"finally.otf"
```

#### `domain-system-filePath-base`

- Command(s): `system.filePath()`
- Preview data:
```csv
"Value"
"/lost+found/bah.epub"
```

#### `domain-system-fileType-base`

- Command(s): `system.fileType()`
- Preview data:
```csv
"Value"
"application"
```

#### `domain-system-mimeType-base`

- Command(s): `system.mimeType()`
- Preview data:
```csv
"Value"
"image/gif"
```

#### `domain-system-networkInterface-base`

- Command(s): `system.networkInterface()`
- Preview data:
```csv
"Value"
"ens0d1"
```

#### `domain-system-semver-base`

- Command(s): `system.semver()`
- Preview data:
```csv
"Value"
"6.20.15"
```

#### `domain-vehicle-bicycle-base`

- Command(s): `vehicle.bicycle()`
- Preview data:
```csv
"Value"
"Hybrid Bicycle"
```

#### `domain-vehicle-color-base`

- Command(s): `vehicle.color()`
- Preview data:
```csv
"Value"
"fuchsia"
```

#### `domain-vehicle-fuel-base`

- Command(s): `vehicle.fuel()`
- Preview data:
```csv
"Value"
"Electric"
```

#### `domain-vehicle-manufacturer-base`

- Command(s): `vehicle.manufacturer()`
- Preview data:
```csv
"Value"
"Chrysler"
```

#### `domain-vehicle-model-base`

- Command(s): `vehicle.model()`
- Preview data:
```csv
"Value"
"CTS"
```

#### `domain-vehicle-type-base`

- Command(s): `vehicle.type()`
- Preview data:
```csv
"Value"
"Convertible"
```

#### `domain-vehicle-vehicle-base`

- Command(s): `vehicle.vehicle()`
- Preview data:
```csv
"Value"
"Smart Alpine"
```

#### `domain-vehicle-vin-base`

- Command(s): `vehicle.vin()`
- Preview data:
```csv
"Value"
"928JZDANRWG098654"
```

#### `domain-vehicle-vrm-base`

- Command(s): `vehicle.vrm()`
- Preview data:
```csv
"Value"
"RN16HVP"
```

#### `domain-word-adjective-base`

- Command(s): `word.adjective()`
- Preview data:
```csv
"Value"
"moist"
```

#### `domain-word-adjective-arg-length`

- Command(s): `word.adjective(length=4)`
- Preview data:
```csv
"Value"
"zany"
```

#### `domain-word-adjective-arg-max`

- Command(s): `word.adjective(max=3)`
- Preview data:
```csv
"Value"
"distorted"
```

#### `domain-word-adjective-arg-strategy`

- Command(s): `word.adjective(strategy="word-adjective-strategy")`
- Preview data:
```csv
"Value"
"illiterate"
```

#### `domain-word-adjective-pair-length-max`

- Command(s): `word.adjective(length=4, max=3)`
- Preview data:
```csv
"Value"
"live"
```

#### `domain-word-adjective-pair-max-strategy`

- Command(s): `word.adjective(max=3, strategy="word-adjective-strategy")`
- Preview data:
```csv
"Value"
"blue"
```

#### `domain-word-adverb-base`

- Command(s): `word.adverb()`
- Preview data:
```csv
"Value"
"certainly"
```

#### `domain-word-adverb-arg-length`

- Command(s): `word.adverb(length=4)`
- Preview data:
```csv
"Value"
"very"
```

#### `domain-word-adverb-arg-max`

- Command(s): `word.adverb(max=3)`
- Preview data:
```csv
"Value"
"swiftly"
```

#### `domain-word-adverb-arg-strategy`

- Command(s): `word.adverb(strategy="word-adverb-strategy")`
- Preview data:
```csv
"Value"
"voluntarily"
```

#### `domain-word-adverb-pair-length-max`

- Command(s): `word.adverb(length=4, max=3)`
- Preview data:
```csv
"Value"
"fast"
```

#### `domain-word-adverb-pair-max-strategy`

- Command(s): `word.adverb(max=3, strategy="word-adverb-strategy")`
- Preview data:
```csv
"Value"
"majestically"
```

#### `domain-word-conjunction-base`

- Command(s): `word.conjunction()`
- Preview data:
```csv
"Value"
"why"
```

#### `domain-word-conjunction-arg-length`

- Command(s): `word.conjunction(length=4)`
- Preview data:
```csv
"Value"
"what"
```

#### `domain-word-conjunction-arg-max`

- Command(s): `word.conjunction(max=3)`
- Preview data:
```csv
"Value"
"whoever"
```

#### `domain-word-conjunction-arg-strategy`

- Command(s): `word.conjunction(strategy="word-conjunction-strategy")`
- Preview data:
```csv
"Value"
"inasmuch"
```

#### `domain-word-conjunction-pair-length-max`

- Command(s): `word.conjunction(length=4, max=3)`
- Preview data:
```csv
"Value"
"once"
```

#### `domain-word-conjunction-pair-max-strategy`

- Command(s): `word.conjunction(max=3, strategy="word-conjunction-strategy")`
- Preview data:
```csv
"Value"
"for"
```

#### `domain-word-interjection-base`

- Command(s): `word.interjection()`
- Preview data:
```csv
"Value"
"blah"
```

#### `domain-word-interjection-arg-length`

- Command(s): `word.interjection(length=4)`
- Preview data:
```csv
"Value"
"gosh"
```

#### `domain-word-interjection-arg-max`

- Command(s): `word.interjection(max=3)`
- Preview data:
```csv
"Value"
"ah"
```

#### `domain-word-interjection-arg-strategy`

- Command(s): `word.interjection(strategy="word-interjection-strategy")`
- Preview data:
```csv
"Value"
"er"
```

#### `domain-word-interjection-pair-length-max`

- Command(s): `word.interjection(length=4, max=3)`
- Preview data:
```csv
"Value"
"pish"
```

#### `domain-word-interjection-pair-max-strategy`

- Command(s): `word.interjection(max=3, strategy="word-interjection-strategy")`
- Preview data:
```csv
"Value"
"whoa"
```

#### `domain-word-noun-base`

- Command(s): `word.noun()`
- Preview data:
```csv
"Value"
"foodstuffs"
```

#### `domain-word-noun-arg-length`

- Command(s): `word.noun(length=4)`
- Preview data:
```csv
"Value"
"coal"
```

#### `domain-word-noun-arg-max`

- Command(s): `word.noun(max=3)`
- Preview data:
```csv
"Value"
"backbone"
```

#### `domain-word-noun-arg-strategy`

- Command(s): `word.noun(strategy="word-noun-strategy")`
- Preview data:
```csv
"Value"
"meander"
```

#### `domain-word-noun-pair-length-max`

- Command(s): `word.noun(length=4, max=3)`
- Preview data:
```csv
"Value"
"king"
```

#### `domain-word-noun-pair-max-strategy`

- Command(s): `word.noun(max=3, strategy="word-noun-strategy")`
- Preview data:
```csv
"Value"
"numeric"
```

#### `domain-word-preposition-base`

- Command(s): `word.preposition()`
- Preview data:
```csv
"Value"
"times"
```

#### `domain-word-preposition-arg-length`

- Command(s): `word.preposition(length=4)`
- Preview data:
```csv
"Value"
"with"
```

#### `domain-word-preposition-arg-max`

- Command(s): `word.preposition(max=3)`
- Preview data:
```csv
"Value"
"a"
```

#### `domain-word-preposition-arg-strategy`

- Command(s): `word.preposition(strategy="word-preposition-strategy")`
- Preview data:
```csv
"Value"
"than"
```

#### `domain-word-preposition-pair-length-max`

- Command(s): `word.preposition(length=4, max=3)`
- Preview data:
```csv
"Value"
"plus"
```

#### `domain-word-preposition-pair-max-strategy`

- Command(s): `word.preposition(max=3, strategy="word-preposition-strategy")`
- Preview data:
```csv
"Value"
"near"
```

#### `domain-word-sample-base`

- Command(s): `word.sample()`
- Preview data:
```csv
"Value"
"microchip"
```

#### `domain-word-sample-arg-length`

- Command(s): `word.sample(length=4)`
- Preview data:
```csv
"Value"
"when"
```

#### `domain-word-sample-arg-max`

- Command(s): `word.sample(max=3)`
- Preview data:
```csv
"Value"
"aha"
```

#### `domain-word-sample-arg-strategy`

- Command(s): `word.sample(strategy="word-sample-strategy")`
- Preview data:
```csv
"Value"
"ew"
```

#### `domain-word-sample-pair-length-max`

- Command(s): `word.sample(length=4, max=3)`
- Preview data:
```csv
"Value"
"lamp"
```

#### `domain-word-sample-pair-max-strategy`

- Command(s): `word.sample(max=3, strategy="word-sample-strategy")`
- Preview data:
```csv
"Value"
"an"
```

#### `domain-word-verb-base`

- Command(s): `word.verb()`
- Preview data:
```csv
"Value"
"federate"
```

#### `domain-word-verb-arg-length`

- Command(s): `word.verb(length=4)`
- Preview data:
```csv
"Value"
"pant"
```

#### `domain-word-verb-arg-max`

- Command(s): `word.verb(max=3)`
- Preview data:
```csv
"Value"
"braid"
```

#### `domain-word-verb-arg-strategy`

- Command(s): `word.verb(strategy="word-verb-strategy")`
- Preview data:
```csv
"Value"
"prance"
```

#### `domain-word-verb-pair-length-max`

- Command(s): `word.verb(length=4, max=3)`
- Preview data:
```csv
"Value"
"come"
```

#### `domain-word-verb-pair-max-strategy`

- Command(s): `word.verb(max=3, strategy="word-verb-strategy")`
- Preview data:
```csv
"Value"
"pant"
```

#### `domain-word-words-base`

- Command(s): `word.words()`
- Preview data:
```csv
"Value"
"mutate ack"
```

#### `domain-word-words-arg-count`

- Command(s): `word.words(count=2)`
- Preview data:
```csv
"Value"
"instead conservative"
```

#### `domain-word-words-arg-max`

- Command(s): `word.words(max=3)`
- Preview data:
```csv
"Value"
"yahoo"
```

#### `domain-word-words-pair-count-max`

- Command(s): `word.words(count=2, max=3)`
- Preview data:
```csv
"Value"
"brr whoever"
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
| `custom` | 6 |
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
"Status"
"pending"
```

#### `custom-enum-pairwise`

- Command(s): `Status: enum(active,inactive,pending) | Priority: enum(high,medium,low)`
- UI preview parity: `exact`
- Schema Rows: `Status: enum(active,inactive,pending)`, `Priority: enum(high,medium,low)`
- Preview data:
```csv
"Status","Priority"
"inactive","medium"
"inactive","low"
```
- Pairwise preview data:
```csv
"Status","Priority"
"active","high"
"active","medium"
"active","low"
"inactive","high"
"inactive","medium"
"inactive","low"
"pending","high"
"pending","medium"
"pending","low"
```

#### `custom-literal-base`

- Command(s): `literal("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
"Pending"
```

#### `custom-literal-empty`

- Command(s): `literal("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Status"
""
```

#### `custom-regex-base`

- Command(s): `regex("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Code"
"VC23"
```

#### `custom-regex-empty`

- Command(s): `regex("")`
- UI preview parity: `exact`
- Preview data:
```csv
"Code"
""
```

#### `faker-helpers-arrayElement-base`

- Command(s): `helpers.arrayElement(["A", "B"])`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"B"
```

#### `faker-helpers-fake-base`

- Command(s): `helpers.fake("{{person.firstName}}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"Melvin"
```

#### `faker-helpers-fromRegExp-example-1`

- Command(s): `helpers.fromRegExp("[A-Z]{2}[0-9]{2}")`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"PU71"
```

#### `faker-helpers-mustache-base`

- Command(s): `helpers.mustache("{{name}}", { name: "Ada" })`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Ada"
```

#### `faker-helpers-uniqueArray-example-1`

- Command(s): `helpers.uniqueArray(["red", "green", "blue"], 2)`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"[""blue"",""green""]"
```

#### `faker-helpers-weightedArrayElement-example-1`

- Command(s): `helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"sunny"
```

#### `domain-airline-seat-example-1`

- Command(s): `airline.seat()`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"32C"
```

#### `domain-autoIncrement-sequence-example-1`

- Command(s): `autoIncrement.sequence()`
- UI preview parity: `structural`
- Preview data:
```csv
"Value"
"1"
```

#### `domain-commerce-price-example-1`

- Command(s): `commerce.price(dec=2, max=10, min=1, symbol="$")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"$3.69"
```

#### `domain-date-birthdate-example-1`

- Command(s): `date.birthdate(refDate=20000, max=69, min=16, mode="age")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"1920-10-04T17:22:24.125Z"
```

#### `domain-internet-password-example-1`

- Command(s): `internet.password(length=10, memorable=false, pattern="[A-Za-z0-9]", prefix="#")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"#wMJJrPMVo"
```

#### `domain-literal-value-example-1`

- Command(s): `literal.value("Pending")`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"Pending"
```

#### `domain-string-counterString-example-1`

- Command(s): `string.counterString()`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"2*4*"
```

#### `domain-string-fromCharacters-base`

- Command(s): `string.fromCharacters("ABC123", 4)`
- UI preview parity: `exact`
- Preview data:
```csv
"Value"
"A3C3"
```

