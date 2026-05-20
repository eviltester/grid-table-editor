---
slug: domain-abstraction-over-raw-faker
title: "Why We Moved from Raw Faker Commands to Domain Abstractions"
authors: [alan]
tags: [release, architecture, test-data, faker, domain]
date: 2026-05-18T10:30
---

As AnyWayData usage grew across UI, CLI, API, and MCP, we found that directly exposing raw faker calls created avoidable fragility.

We moved to a **domain abstraction layer** so schemas describe intent (`internet.email`, `number.int`, `date.recent`) instead of vendor-specific call shapes.

<!-- truncate -->

## The Problem with Raw Faker Calls

Raw faker usage tends to leak implementation details into test schemas:

- method names can change between faker versions
- argument signatures vary and can be hard to remember
- some calls return objects/arrays when scalar values are expected
- schemas become tightly coupled to one library

That coupling makes long-lived test suites harder to maintain.

## What Changed

Instead of treating faker as the schema language, we treat it as one implementation backend.

You now write rules in domain terms such as:

- `person.firstName`
- `internet.email`
- `number.int`
- `date.recent`
- `finance.amount`

Internally, the engine resolves these through domain keywords and alias handling, while preserving consistent schema behavior.

## Important Exception: Faker Helpers Stay Direct

We intentionally kept direct faker API calls for `faker.helpers.*` methods.

Those helper APIs are generally more advanced and flexible, and we have not yet mapped them cleanly into a generic domain-specific language without losing capability or clarity.

So the current model is:

- use domain rules for most day-to-day test data generation
- use direct faker helper calls when you need advanced helper behavior

## Before vs After

### Before (raw-library style)

```text
First Name
faker.person.firstName()

Email Address
faker.internet.email()

Request Timestamp
faker.date.recent()
```

### After (domain abstraction)

```text
First Name
person.firstName

Email Address
internet.email

Request Timestamp
date.recent
```

The second version is shorter, easier to read, and less sensitive to upstream library churn.

## Practical Benefits

1. Better stability across upgrades  
   Domain rules stay stable even when internal faker wiring changes.

2. Cleaner schemas for teams  
   Test intent is obvious without needing deep faker knowledge.

3. Safer command surface  
   Domain command curation avoids ambiguous or non-scalar-heavy usage in common flows.

4. Cross-interface consistency  
   The same schema works in `app.html`, `generator.html`, CLI, API, and MCP.

5. Easier docs and onboarding  
   Users learn one rules vocabulary, not multiple backend-specific APIs.

## Example: API Request Test Data

```text
# pairwise enums
HTTP Method
enum(GET,POST,PUT,DELETE)

# pairwise enums
Content Type
enum("application/json","application/xml","text/plain")

# randomized domain fields
User ID
number.int

Request Timestamp
date.recent

Email Address
internet.email

# regex
Authorization Token
[A-Fa-f0-9]{32}
```

This mixes enum, domain, and regex rules without exposing backend internals.

## Migration Guidance

- Keep existing schemas working where possible.
- Prefer domain keywords for new schemas.
- Replace `faker.*` rules incrementally during normal test maintenance.
- Keep `faker.helpers.*` calls where you rely on helper-specific advanced behavior.
- Use literals/regex/enums where domain keywords are not the best fit.

## Bottom Line

Moving from raw faker calls to a domain abstraction gives us stronger compatibility guarantees, clearer schemas, and a better long-term developer experience, while still retaining faker's generation power behind the scenes.
