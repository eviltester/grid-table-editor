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
- `"cp1250_bin"`
- `"ascii_bin"`

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
- `"email"`
- `"avatar"`

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
- `"MEMORY"`
- `"MyISAM"`

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
- `"eb75f6ebb57df4563b2b7e46"`
- `"1f47f5e497eaff859dc2d3ef"`

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
- `"text"`
- `"smallint"`
