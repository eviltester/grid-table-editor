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
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `string` | no | Format of generated CMYK color. |

Examples:

```txt
color.cmyk()
```

```txt
color.cmyk(format="hex")
```

Example return values:
- `[0.95,0.17,0.23,1]`

### `color.colorByCSSColorSpace`

Returns a random color based on CSS color space specified.

- Canonical: `awd.domain.color.colorByCSSColorSpace`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.colorByCSSColorSpace()
```

Example return values:
- `[0.5811,0.0479,0.1091]`

### `color.cssSupportedFunction`

Returns a random css supported color function name.

- Canonical: `awd.domain.color.cssSupportedFunction`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.cssSupportedFunction()
```

Example return values:
- `hsla`

### `color.cssSupportedSpace`

Returns a random css supported color space name.

- Canonical: `awd.domain.color.cssSupportedSpace`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.cssSupportedSpace()
```

Example return values:
- `sRGB`

### `color.hsl`

Returns an HSL color.

- Canonical: `awd.domain.color.hsl`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `string` | no | Format of generated HSL color. |
| `includeAlpha` | `boolean` | no | Adds an alpha value to the color (RGBA). |

Examples:

```txt
color.hsl()
```

```txt
color.hsl(format="hex", includeAlpha=true)
```

Example return values:
- `[212,0.78,0.54]`

### `color.human`

Returns a random human-readable color name.

- Canonical: `awd.domain.color.human`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.human()
```

Example return values:
- `green`

### `color.hwb`

Returns an HWB color.

- Canonical: `awd.domain.color.hwb`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `string` | no | Format of generated RGB color. |

Examples:

```txt
color.hwb()
```

```txt
color.hwb(format="hex")
```

Example return values:
- `[328,0.27,0.33]`

### `color.lab`

Returns a LAB (CIELAB) color.

- Canonical: `awd.domain.color.lab`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `string` | no | Format of generated RGB color. |

Examples:

```txt
color.lab()
```

```txt
color.lab(format="hex")
```

Example return values:
- `[0.071396,-55.6612,-66.7185]`

### `color.lch`

Returns an LCH color.

- Canonical: `awd.domain.color.lch`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `string` | no | Format of generated RGB color. |

Examples:

```txt
color.lch()
```

```txt
color.lch(format="hex")
```

Example return values:
- `[0.469557,212.9,204.9]`

### `color.rgb`

Returns an RGB color.

- Canonical: `awd.domain.color.rgb`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `casing` | `string` | no | Letter type case of the generated hex color. Only applied when 'hex' format is used. |
| `format` | `string` | no | Format of generated RGB color. |
| `includeAlpha` | `boolean` | no | Adds an alpha value to the color (RGBA). |
| `prefix` | `string` | no | Prefix of the generated hex color. Only applied when 'hex' format is used. |

Examples:

```txt
color.rgb()
```

```txt
color.rgb(casing="lower", format="hex", includeAlpha=true, prefix="#")
```

Example return values:
- `#ee8222`

### `color.space`

Returns a random color space name from the worldwide accepted color spaces.

- Canonical: `awd.domain.color.space`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

```txt
color.space()
```

Example return values:
- `HSL`
