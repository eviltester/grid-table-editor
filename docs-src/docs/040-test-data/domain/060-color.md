---
sidebar_position: 60
title: "color Domain"
description: "Domain keyword reference for color."
---

# color Domain

The `color` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

## Methods

### `color.cmyk`

Returns a CMYK color.

- Canonical: `awd.domain.color.cmyk`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated CMYK color. |

Examples:

```txt
color.cmyk()
```

```txt
color.cmyk(format="decimal")
```

Example return values:
- `[0.42,0.72,0,0.3]`
- `[0.42,0.72,0,0.3]`

### `color.colorByCSSColorSpace`

Returns a random color based on CSS color space specified.

- Canonical: `awd.domain.color.colorByCSSColorSpace`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |
| `space` | `sRGB\|display-p3\|rec2020\|a98-rgb\|prophoto-rgb` | no | Color space to generate the color for. |

Examples:

```txt
color.colorByCSSColorSpace()
```

```txt
color.colorByCSSColorSpace(format="decimal")
```

```txt
color.colorByCSSColorSpace(space="display-p3")
```

Example return values:
- `[0.417,0.7203,0.0001]`
- `[0.417,0.7203,0.0001]`
- `[0.417,0.7203,0.0001]`

### `color.cssSupportedFunction`

Returns a random css supported color function name.

- Canonical: `awd.domain.color.cssSupportedFunction`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.cssSupportedFunction
```

Example return values:
- `hsla`

### `color.cssSupportedSpace`

Returns a random css supported color space name.

- Canonical: `awd.domain.color.cssSupportedSpace`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.cssSupportedSpace
```

Example return values:
- `rec2020`

### `color.hsl`

Returns an HSL color.

- Canonical: `awd.domain.color.hsl`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated HSL color. |
| `includeAlpha` | `boolean` | no | Adds an alpha value to the color (RGBA). |

Examples:

```txt
color.hsl
```

```txt
color.hsl(format="css")
```

```txt
color.hsl(includeAlpha=true)
```

```txt
color.hsl(format="css", includeAlpha=true)
```

Example return values:
- `[150,0.72,0]`
- `hsl(150deg 72% 0%)`
- `[150,0.72,0,0.3]`
- `hsl(150deg 72% 0% / 30)`

### `color.human`

Returns a random human-readable color name.

- Canonical: `awd.domain.color.human`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.human
```

Example return values:
- `magenta`

### `color.hwb`

Returns an HWB color.

- Canonical: `awd.domain.color.hwb`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |

Examples:

```txt
color.hwb()
```

```txt
color.hwb(format="decimal")
```

Example return values:
- `[150,0.72,0]`
- `[150,0.72,0]`

### `color.lab`

Returns a LAB (CIELAB) color.

- Canonical: `awd.domain.color.lab`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |

Examples:

```txt
color.lab()
```

```txt
color.lab(format="decimal")
```

Example return values:
- `[0.417022,44.0649,-99.9772]`
- `[0.417022,44.0649,-99.9772]`

### `color.lch`

Returns an LCH color.

- Canonical: `awd.domain.color.lch`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |

Examples:

```txt
color.lch()
```

```txt
color.lch(format="decimal")
```

Example return values:
- `[0.417022,165.7,0]`
- `[0.417022,165.7,0]`

### `color.rgb`

Returns an RGB color.

- Canonical: `awd.domain.color.rgb`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `casing` | `lower\|upper\|mixed` | no | Letter type case of the generated hex color. Only applied when 'hex' format is used. |
| `format` | `hex\|decimal\|css\|binary` | no | Format of generated RGB color. |
| `includeAlpha` | `boolean` | no | Adds an alpha value to the color (RGBA). |
| `prefix` | `string` | no | Prefix of the generated hex color. Only applied when 'hex' format is used. |

Examples:

```txt
color.rgb()
```

```txt
color.rgb(casing="upper")
```

```txt
color.rgb(format="hex")
```

```txt
color.rgb(includeAlpha=true)
```

```txt
color.rgb(prefix="#")
```

Example return values:
- `#9f0632`
- `#9F0632`
- `#9f0632`
- `#9f063247`
- `#9f0632`

### `color.space`

Returns a random color space name from the worldwide accepted color spaces.

- Canonical: `awd.domain.color.space`
- Docs: [https://anywaydata.com/docs/test-data/domain/color](https://anywaydata.com/docs/test-data/domain/color)
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.space
```

Example return values:
- `HSV`
