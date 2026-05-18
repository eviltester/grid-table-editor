---
sidebar_position: 260
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
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.commonFileExt()
```

Example return values:
- `"gif"`
- `"png"`

### `system.commonFileName`

Returns a random file name with a given extension or a commonly used extension.

- Canonical: `awd.domain.system.commonFileName`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `extension` | `string` | no | No description provided. |

Examples:

```txt
system.commonFileName()
```

```txt
system.commonFileName(extension="txt")
```

Example return values:
- `"monocle_unhappy.gif"`
- `"seal_fax.gif"`

### `system.commonFileType`

Returns a commonly used file type.

- Canonical: `awd.domain.system.commonFileType`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.commonFileType()
```

Example return values:
- `"image"`
- `"video"`

### `system.cron`

Returns a random cron expression.

- Canonical: `awd.domain.system.cron`
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
system.cron(includeNonStandard=true, includeYear=true)
```

Example return values:
- `"* * 23 * *"`
- `"* 12 ? * ?"`

### `system.directoryPath`

Returns a directory path.

- Canonical: `awd.domain.system.directoryPath`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.directoryPath()
```

Example return values:
- `"/lost+found"`
- `"/root"`

### `system.fileExt`

Returns a file extension.

- Canonical: `awd.domain.system.fileExt`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `mimeType` | `string` | no | No description provided. |

Examples:

```txt
system.fileExt()
```

```txt
system.fileExt(mimeType="image/png")
```

Example return values:
- `"odp"`
- `"bz"`

### `system.fileName`

Returns a random file name with extension.

- Canonical: `awd.domain.system.fileName`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.fileName()
```

Example return values:
- `"ew_deep_mothball.webm"`
- `"whale.ogg"`

### `system.filePath`

Returns a file path.

- Canonical: `awd.domain.system.filePath`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.filePath()
```

Example return values:
- `"/Applications/but_holster.dms"`
- `"/lib/anenst_glaring.xsl"`

### `system.fileType`

Returns a file type.

- Canonical: `awd.domain.system.fileType`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.fileType()
```

Example return values:
- `"image"`
- `"image"`

### `system.mimeType`

Returns a mime-type.

- Canonical: `awd.domain.system.mimeType`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.mimeType()
```

Example return values:
- `"image/jpeg"`
- `"application/x-7z-compressed"`

### `system.networkInterface`

Returns a random network interface.

- Canonical: `awd.domain.system.networkInterface`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.networkInterface()
```

Example return values:
- `"ens9d1"`
- `"wlp8s6f4"`

### `system.semver`

Returns a semantic version.

- Canonical: `awd.domain.system.semver`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.semver()
```

Example return values:
- `"1.8.17"`
- `"5.12.0"`
