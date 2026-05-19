---
sidebar_position: 80
title: "database Domain"
description: "Domain keyword reference for database."
---

# database Domain

The `database` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/database](https://fakerjs.dev/api/database)

## Methods

### `database.collation`

Returns a random database collation.

- Canonical: `awd.domain.database.collation`
- Faker docs: [https://fakerjs.dev/api/database](https://fakerjs.dev/api/database)

No parameters.

Examples:

```txt
database.collation()
```

Example return values:
- `"ascii_bin"`
- `"ascii_general_ci"`

### `database.column`

Returns a random database column name.

- Canonical: `awd.domain.database.column`
- Faker docs: [https://fakerjs.dev/api/database](https://fakerjs.dev/api/database)

No parameters.

Examples:

```txt
database.column()
```

Example return values:
- `"id"`
- `"updatedAt"`

### `database.engine`

Returns a random database engine.

- Canonical: `awd.domain.database.engine`
- Faker docs: [https://fakerjs.dev/api/database](https://fakerjs.dev/api/database)

No parameters.

Examples:

```txt
database.engine()
```

Example return values:
- `"MyISAM"`
- `"BLACKHOLE"`

### `database.mongodbObjectId`

Returns a MongoDB ObjectId string.

- Canonical: `awd.domain.database.mongodbObjectId`
- Faker docs: [https://fakerjs.dev/api/database](https://fakerjs.dev/api/database)

No parameters.

Examples:

```txt
database.mongodbObjectId()
```

Example return values:
- `"3ef8f1042addecfc81fd98f9"`
- `"b1c85eb686a0a96e1ebbefdf"`

### `database.type`

Returns a random database column type.

- Canonical: `awd.domain.database.type`
- Faker docs: [https://fakerjs.dev/api/database](https://fakerjs.dev/api/database)

No parameters.

Examples:

```txt
database.type()
```

Example return values:
- `"enum"`
- `"bigint"`
