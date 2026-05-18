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
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

```txt
system.commonFileExt()
```

Example return values:
- `"png"`
- `"mpga"`

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
- `"save_quash_gee.mp4"`
- `"biodegradable_vol.gif"`

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
- `"application"`
- `"application"`

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
system.cron(includeNonStandard=true)
```

Example return values:
- `"* 17 ? * MON"`
- `"27 20 ? 3 ?"`

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
- `"/etc/ppp"`
- `"/usr/local/bin"`

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
- `"rmi"`
- `"csh"`

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
- `"disrespect.msi"`
- `"ah.kar"`

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
- `"/System/blend_mostly.3gp"`
- `"/var/swath.deb"`

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
- `"video"`
- `"audio"`

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
- `"application/ld+json"`
- `"image/png"`

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
- `"wwx5ba17e137568"`
- `"wlo9"`

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
- `"5.6.20"`
- `"8.15.6"`
