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
- `"m1v"`
- `"pdf"`

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
- `"uneven_knottily.pdf"`
- `"unlucky_officially_over.shtml"`

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
- `"audio"`
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
- `"* * * 1 *"`
- `"* 10 10 * WED"`

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
- `"/usr/libexec"`
- `"/Network"`

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
- `"rar"`
- `"3g2"`

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
- `"lovingly.dump"`
- `"blond.ppt"`

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
- `"/usr/lib/phew_beautifully.boz"`
- `"/home/user/atrium.def"`

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
- `"video"`

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
- `"image/png"`
- `"application/vnd.oasis.opendocument.presentation"`

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
- `"wlo7"`
- `"wwxe7fb537260c4"`

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
- `"3.1.13"`
- `"4.1.12"`
