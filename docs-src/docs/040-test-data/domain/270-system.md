---
sidebar_position: 270
title: "system Domain"
description: "Domain keyword reference for system."
---

# system Domain

The `system` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

## Methods

### `system.commonFileExt`

Returns a commonly used file extension.

- Canonical: `awd.domain.system.commonFileExt`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.commonFileExt
```

Example return values:
- `png`

### `system.commonFileName`

Returns a random file name with a given extension or a commonly used extension.

- Canonical: `awd.domain.system.commonFileName`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `extension` | `string` | no | File extension to include in the generated filename. |

Examples:

```txt
system.commonFileName()
```

```txt
system.commonFileName(extension="txt")
```

Example return values:
- `fog_aboard.mp4v`
- `fog_aboard.txt`

### `system.commonFileType`

Returns a commonly used file type.

- Canonical: `awd.domain.system.commonFileType`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.commonFileType
```

Example return values:
- `image`

### `system.cron`

Returns a random cron expression.

- Canonical: `awd.domain.system.cron`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `includeNonStandard` | `boolean` | no | Whether to include a @yearly, @monthly, @daily, etc text labels in the generated expression. |
| `includeYear` | `boolean` | no | Whether to include a year in the generated expression. |

Examples:

```txt
system.cron()
```

```txt
system.cron(includeNonStandard=true)
```

```txt
system.cron(includeYear=true)
```

Example return values:
- `25 17 * 4 *`
- `@annually`
- `25 17 * 4 * 1994`

### `system.directoryPath`

Returns a directory path.

- Canonical: `awd.domain.system.directoryPath`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.directoryPath
```

Example return values:
- `/opt/include`

### `system.fileExt`

Returns a file extension.

- Canonical: `awd.domain.system.fileExt`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `mimeType` | `string` | no | MIME type used to constrain generated values. |

Examples:

```txt
system.fileExt()
```

```txt
system.fileExt(mimeType="image/png")
```

Example return values:
- `7z`
- `7z`

### `system.fileName`

Returns a random file name with extension.

- Canonical: `awd.domain.system.fileName`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.fileName
```

Example return values:
- `fog_aboard.otf`

### `system.filePath`

Returns a file path.

- Canonical: `awd.domain.system.filePath`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.filePath
```

Example return values:
- `/opt/include/down_reproachfully_besides.woff2`

### `system.fileType`

Returns a file type.

- Canonical: `awd.domain.system.fileType`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.fileType
```

Example return values:
- `font`

### `system.mimeType`

Returns a mime-type.

- Canonical: `awd.domain.system.mimeType`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.mimeType
```

Example return values:
- `application/x-httpd-php`

### `system.networkInterface`

Returns a random network interface.

- Canonical: `awd.domain.system.networkInterface`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.networkInterface
```

Example return values:
- `wlx042125686a3e`

### `system.semver`

Returns a semantic version.

- Canonical: `awd.domain.system.semver`
- Docs: [https://anywaydata.com/docs/test-data/domain/system](https://anywaydata.com/docs/test-data/domain/system)
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.semver
```

Example return values:
- `4.15.0`
