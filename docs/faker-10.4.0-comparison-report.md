# Faker 10.4.0 Comparison Report

Generated: 2026-06-17

## Purpose

This is a one-off comparison between the repo's current curated faker command surface and `@faker-js/faker` `10.4.0`.

It is scoped to the commands and metadata this repo actually uses:

- `packages/core/js/faker/faker-commands.js`
- `packages/core/js/faker/faker-command-help-metadata.js`
- `packages/core/js/data_generation/faker/fakerCommand.js`

## Method

The comparison used four checks:

1. Compare the current curated command list against a locally packed `@faker-js/faker@10.4.0`.
2. Resolve each current curated command against the `10.4.0` runtime to find removals.
3. Compare current help/parameter metadata against `10.4.0` type declarations.
4. Run the repo's current `FakerCommand` parser/compiler/validator against both faker `9.7.0` and `10.4.0` to identify upgrade-specific breakpoints versus pre-existing ones.

## Summary

- Current curated faker commands: `266`
- Current direct `module.method` commands: `257`
- Public direct `module.method` commands visible in faker `10.4.0`: `261`
- Current curated commands removed in faker `10.4.0`: `5`
- New direct faker `10.4.0` commands not currently curated: `9`
- Current curated property-accessor commands still resolvable in faker `10.4.0`: `9`
- Known breakpoints when exercising current commands through the repo's `FakerCommand` path under faker `10.4.0`: `16`

## Removed Commands

These commands are still present in the repo's curated list but do not resolve in faker `10.4.0`:

| Current command | Suggested replacement | Notes |
| --- | --- | --- |
| `finance.maskedNumber` | Product decision needed | Faker's v10 guidance removes it with no exact one-call replacement. |
| `image.avatarLegacy` | `image.avatar` or `image.personPortrait` | `image.avatar` is the closest current repo fit. |
| `image.urlPlaceholder` | `image.dataUri` or `image.url` | `image.dataUri` is the closest documented replacement. |
| `internet.color` | `color.rgb` | Explicit faker replacement guidance. |
| `internet.userName` | `internet.username` | Explicit faker replacement guidance. |

These removals line up with the current curated list in `packages/core/js/faker/faker-commands.js`, where the deprecated entries are still present today.

## Deprecated Commands Still Present Before The Upgrade

These are already on borrowed time in the current curation and should be addressed as part of the upgrade:

- `finance.maskedNumber`
- `image.avatarLegacy`
- `image.urlPlaceholder`
- `internet.userName`
- `internet.color`
- `image.urlLoremFlickr`

`image.urlLoremFlickr` still resolves in faker `10.4.0`, but the runtime emitted a deprecation warning saying it has been deprecated since `10.1.0` and is scheduled for removal in `11.0.0`.

## New Public Commands In Faker 10.4.0

These direct faker commands exist in `10.4.0` but are not currently curated in this repo:

| Command | Likely action |
| --- | --- |
| `commerce.upc` | Candidate addition if we want new user-facing coverage. |
| `helpers.enumValue` | Candidate addition. |
| `helpers.objectEntry` | Candidate addition. |
| `helpers.objectKey` | Candidate addition. |
| `helpers.objectValue` | Candidate addition. |
| `airline.airline` | Already indirectly represented by accessor commands such as `airline.airline.name`. |
| `airline.airplane` | Already indirectly represented by accessor commands such as `airline.airplane.name`. |
| `airline.airport` | Already indirectly represented by accessor commands such as `airline.airport.name`. |
| `science.chemicalElement` | Already indirectly represented by accessor commands such as `science.chemicalElement.symbol`. |

The practical net-new curation candidates are:

- `commerce.upc`
- `helpers.enumValue`
- `helpers.objectEntry`
- `helpers.objectKey`
- `helpers.objectValue`

## Signature And Metadata Amendments

The comparison found meaningful metadata changes we should expect to reflect if we regenerate and review help:

| Command | Current metadata | Faker 10.4.0 observation |
| --- | --- | --- |
| `person.firstName` | `sex?: 'female' \| 'male'` | widens to `sex?: 'female' \| 'generic' \| 'male'` |
| `person.lastName` | `sex?: 'female' \| 'male'` | widens to `sex?: 'female' \| 'generic' \| 'male'` |
| `person.middleName` | `sex?: 'female' \| 'male'` | widens to `sex?: 'female' \| 'generic' \| 'male'` |
| `person.prefix` | `sex?: 'female' \| 'male'` | widens to `sex?: 'female' \| 'generic' \| 'male'` |
| `person.sexType` | no params | now exposes an optional `options` object |
| `string.uuid` | no params | now exposes an `options` object in typings |

Additional helper methods such as `helpers.arrayElement`, `helpers.arrayElements`, `helpers.maybe`, `helpers.multiple`, `helpers.shuffle`, `helpers.uniqueArray`, and `helpers.weightedArrayElement` still resolve at runtime, but the one-off type-extraction pass did not recover clean parameter metadata for them from faker `10.4.0`'s declarations. Treat those as manual review items when regenerating help.

## Current Property-Accessor Commands Still Supported

These existing curated commands still resolve in faker `10.4.0` through function-plus-property access:

- `airline.airport.name`
- `airline.airport.iataCode`
- `airline.airline.name`
- `airline.airline.iataCode`
- `airline.airplane.name`
- `airline.airplane.iataTypeCode`
- `science.chemicalElement.symbol`
- `science.chemicalElement.name`
- `science.chemicalElement.atomicNumber`

This matters because faker `10.4.0` now exposes the parent object-returning functions directly:

- `airline.airport`
- `airline.airline`
- `airline.airplane`
- `science.chemicalElement`

## Known Breakpoints

This section separates upgrade-specific breakpoints from issues that already reproduce against faker `9.7.0`.

### Upgrade-Specific Breakpoints

These failures are introduced by the `10.4.0` upgrade because the commands are removed there:

| Command | Failure seen through current `FakerCommand` path |
| --- | --- |
| `finance.maskedNumber` | `Could not find Faker API Command finance.maskedNumber {finance.maskedNumber}` |
| `image.avatarLegacy` | `Could not find Faker API Command image.avatarLegacy {image.avatarLegacy}` |
| `image.urlPlaceholder` | `Could not find Faker API Command image.urlPlaceholder {image.urlPlaceholder}` |
| `internet.userName` | `Could not find Faker API Command internet.userName {internet.userName}` |
| `internet.color` | `Could not find Faker API Command internet.color {internet.color}` |

### Pre-Existing Breakpoints Also Reproduced Under Faker 9.7.0

These failures also occurred when the same smoke test was run against faker `9.7.0`, so they are not new to the upgrade:

| Command | Faker 10.4.0 failure | Interpretation |
| --- | --- | --- |
| `date.between` | `Cannot destructure property 'from'...` | Requires arguments; current zero-arg validation path is not a useful compatibility signal. |
| `date.betweens` | `Cannot destructure property 'from'...` | Requires arguments; same category as above. |
| `helpers.fake` | `Cannot read properties of undefined (reading 'length')` | Requires meaningful input; current no-arg validation path already fails today. |
| `helpers.maybe` | `e is not a function` | Callback-dependent helper; current no-arg validation path already fails today. |
| `helpers.arrayElement` | `Cannot read properties of undefined (reading 'length')` | Requires array input; current no-arg validation path already fails today. |
| `helpers.shuffle` | `e is not iterable` | Requires array input; current no-arg validation path already fails today. |
| `helpers.weightedArrayElement` | `Cannot read properties of undefined (reading 'length')` | Requires weighted array input; current no-arg validation path already fails today. |
| `helpers.arrayElements` | `Cannot read properties of undefined (reading 'length')` | Requires array input; current no-arg validation path already fails today. |
| `string.fromCharacters` | `Cannot read properties of undefined (reading 'length')` | Requires input characters/options; current no-arg validation path already fails today. |
### Parser Hotspot Behind `ipv4` And `ipv6`

The original comparison surfaced `internet.ipv4` and `internet.ipv6` as parser-path failures, not faker removals:

- `packages/core/js/data_generation/faker/fakerCommand.js` was only accepting path segments that matched `^([A-Za-z]*)$`
- that excluded numeric characters inside segment names such as `ipv4` and `ipv6`

That parser issue has now been fixed in the current worktree by allowing digits after the first character in faker path segments. The upgrade work should still treat `ipv4` and `ipv6` as supported commands rather than migration removals.

## Recommended Upgrade Follow-Up

Recommended sequence for issue `#225`:

1. Remove or replace the five commands that faker `10.4.0` no longer resolves.
2. Decide whether to add the five meaningful new commands:
   `commerce.upc`, `helpers.enumValue`, `helpers.objectEntry`, `helpers.objectKey`, `helpers.objectValue`.
3. Regenerate faker help metadata and manually review helper-command parameter docs that the type-extraction pass does not recover cleanly.
4. Update any domain/help/method-picker surfaces that still expose removed commands.
5. Confirm the already-landed `ipv4` / `ipv6` parser fix remains covered so the curated list stays aligned with real runtime capability.

Decisions:

1. Remove  the five commands that faker `10.4.0` no longer resolves.
2. add the five meaningful new commands:
   `commerce.upc`, `helpers.enumValue`, `helpers.objectEntry`, `helpers.objectKey`, `helpers.objectValue`.
3. Regenerate faker help metadata and manually review helper-command parameter docs that the type-extraction pass does not recover cleanly.
4. Update any domain/help/method-picker surfaces that still expose removed commands.
5. fix the `ipv4` / `ipv6` parser constraint in `FakerCommand` so the curated list matches real runtime capability more closely.

## Caveats

- This report intentionally focuses on the repo's curated faker surface, not every API symbol faker exports.
- Some helper-method parameter differences in faker `10.4.0` need manual review because the declaration-extraction pass does not perfectly recover every helper signature.
- The runtime breakpoint smoke test is useful for surfacing removals and parser mismatches, but commands that require arguments will naturally fail when executed with no arguments.
