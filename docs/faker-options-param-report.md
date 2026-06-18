# Faker `options` Param Inventory

Generated from `packages/core/js/faker/faker-command-help-metadata.js` in the current worktree.

## Summary

- `string.uuid` has already been fixed and is not included below.
- `86` other Faker commands still surface an `options` param in help metadata.
- Breakdown:
  - `63` are `object`-only `options` params.
  - `22` are scalar-or-object unions such as `number | { ... }`.
  - `1` is `helpers.multiple`, currently surfaced as `number | object`.

## Planning Notes

- Best flattening candidates:
  - Commands whose metadata currently says only `object`.
  - Commands already flattened in domain metadata or docs, where the field names are known.
- Mixed scalar-or-object signatures need a product decision:
  - keep scalar shorthand plus named params
  - or document only the named-param object shape in surfaced help
- Manual helper metadata already has custom definitions for:
  - `helpers.maybe`
  - `helpers.multiple`

## Object-only `options` Params

- `airline.flightNumber`
- `airline.recordLocator`
- `airline.seat`
- `color.cmyk`
- `color.colorByCSSColorSpace`
- `color.hsl`
- `color.hwb`
- `color.lab`
- `color.lch`
- `color.rgb`
- `commerce.price`
- `commerce.upc`
- `date.anytime`
- `date.between`
- `date.betweens`
- `date.birthdate`
- `date.future`
- `date.month`
- `date.past`
- `date.recent`
- `date.soon`
- `date.weekday`
- `finance.amount`
- `finance.bic`
- `finance.bitcoinAddress`
- `finance.iban`
- `git.commitDate`
- `git.commitEntry`
- `git.commitSha`
- `helpers.maybe`
- `image.dataUri`
- `image.personPortrait`
- `image.url`
- `image.urlPicsumPhotos`
- `internet.displayName`
- `internet.emoji`
- `internet.httpStatusCode`
- `internet.ipv4`
- `internet.jwt`
- `internet.mac`
- `internet.password`
- `internet.url`
- `internet.username`
- `location.cardinalDirection`
- `location.direction`
- `location.latitude`
- `location.longitude`
- `location.nearbyGPSCoordinate`
- `location.ordinalDirection`
- `location.state`
- `number.binary`
- `number.octal`
- `person.fullName`
- `person.sexType`
- `phone.number`
- `string.binary`
- `string.hexadecimal`
- `string.octal`
- `string.ulid`
- `system.cron`
- `system.fileName`
- `system.networkInterface`

## Scalar-or-object `options` Params

- `commerce.isbn` -> `10 | 13 | { variant?: 10 | 13; separator?: string; }`
- `datatype.boolean` -> `number | { probability?: number; }`
- `location.countryCode` -> `'alpha-2' | 'alpha-3' | 'numeric' | { variant?: ... }`
- `location.streetAddress` -> `boolean | { useFullAddress?: boolean; }`
- `lorem.word` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `number.bigInt` -> `bigint | number | string | boolean | { min?: ...; max?: ...; }`
- `number.float` -> `number | { min?: number; max?: number; fractionDigits?: number; multipleOf?: ... }`
- `number.hex` -> `number | { min?: number; max?: number; }`
- `number.int` -> `number | { min?: number; max?: number; multipleOf?: number; }`
- `number.romanNumeral` -> `number | { min?: number; max?: number; }`
- `string.alpha` -> `number | { length?: number | { min: number; max: number; }; casing?: ... }`
- `string.alphanumeric` -> `number | { length?: number | { min: number; max: number; }; casing?: ... }`
- `string.numeric` -> `number | { length?: number | { min: number; max: number; }; allowLeadingZeros?: ... }`
- `word.adjective` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.adverb` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.conjunction` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.interjection` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.noun` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.preposition` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.sample` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.verb` -> `number | { length?: number | { min: number; max: number; }; strategy?: ... }`
- `word.words` -> `number | { count?: number | { min: number; max: number; }; }`

## Special Case

- `helpers.multiple` -> `number | object`

This one likely needs a bespoke surfaced shape similar to the existing custom helper metadata approach.
