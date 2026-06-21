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

Shows the default system.commonFileExt call.

```txt
system.commonFileExt
```

Returns: `png`

### `system.commonFileName`

Returns a random file name with a given extension or a commonly used extension.

- Canonical: `awd.domain.system.commonFileName`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `extension` | `string` | no | File extension to include in the generated filename. |

Examples:

Shows system.commonFileName when optional params are omitted.

```txt
system.commonFileName()
```

Returns: `fog_aboard.mp4v`

Shows system.commonFileName using extension.

```txt
system.commonFileName(extension="txt")
```

Returns: `fog_aboard.txt`

### `system.commonFileType`

Returns a commonly used file type.

- Canonical: `awd.domain.system.commonFileType`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.commonFileType call.

```txt
system.commonFileType
```

Returns: `image`

### `system.cron`

Returns a random cron expression.

- Canonical: `awd.domain.system.cron`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `includeNonStandard` | `boolean` | no | Whether to include a @yearly, @monthly, @daily, etc text labels in the generated expression. |
| `includeYear` | `boolean` | no | Whether to include a year in the generated expression. |

Examples:

Shows system.cron when optional params are omitted.

```txt
system.cron()
```

Returns: `25 17 * 4 *`

Shows system.cron using includeNonStandard.

```txt
system.cron(includeNonStandard=true)
```

Returns: `@annually`

Shows system.cron using includeYear.

```txt
system.cron(includeYear=true)
```

Returns: `25 17 * 4 * 1994`

### `system.directoryPath`

Returns a directory path.

- Canonical: `awd.domain.system.directoryPath`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.directoryPath call.

```txt
system.directoryPath
```

Returns: `/opt/include`

### `system.fileExt`

Returns a file extension.

- Canonical: `awd.domain.system.fileExt`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `mimeType` | `string` | no | MIME type used to constrain generated values. |

Examples:

Shows system.fileExt when optional params are omitted.

```txt
system.fileExt()
```

Returns: `7z`

Shows system.fileExt using mimeType.

```txt
system.fileExt(mimeType="image/png")
```

Returns: `7z`

### `system.fileName`

Returns a random file name with extension.

- Canonical: `awd.domain.system.fileName`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.fileName call.

```txt
system.fileName
```

Returns: `fog_aboard.otf`

### `system.filePath`

Returns a file path.

- Canonical: `awd.domain.system.filePath`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.filePath call.

```txt
system.filePath
```

Returns: `/opt/include/down_reproachfully_besides.woff2`

### `system.fileType`

Returns a file type.

- Canonical: `awd.domain.system.fileType`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.fileType call.

```txt
system.fileType
```

Returns: `font`

### `system.mimeType`

Returns a mime-type.

- Canonical: `awd.domain.system.mimeType`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.mimeType call.

```txt
system.mimeType
```

Returns: `application/x-httpd-php`

### `system.networkInterface`

Returns a random network interface.

- Canonical: `awd.domain.system.networkInterface`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.networkInterface call.

```txt
system.networkInterface
```

Returns: `wlx042125686a3e`

### `system.semver`

Returns a semantic version.

- Canonical: `awd.domain.system.semver`
- Faker docs: [https://fakerjs.dev/api/system](https://fakerjs.dev/api/system)

No parameters.

Examples:

Shows the default system.semver call.

```txt
system.semver
```

Returns: `4.15.0`
