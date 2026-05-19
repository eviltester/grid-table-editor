---
sidebar_position: 50
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
- `[0.57,0.01,0.18,0.59]`
- `[0.56,0.85,0.64,0.2]`

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
- `[0.292,0.4075,0.5189]`
- `[0.0782,0.9207,0.6424]`

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
- `"color"`
- `"rgba"`

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
- `"rec2020"`

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
- `[109,0.86,0.08]`
- `[215,0.5,0.99]`

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
- `"orange"`
- `"black"`

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
- `[324,0.03,0.76]`
- `[80,0.93,0.73]`

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
- `[0.408016,47.4015,-64.2527]`
- `[0.935836,-55.9594,38.016]`

### `color.lch`

Returns a random LCH color value.

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
- `[0.770606,67.4,171.2]`
- `[0.241599,78.8,2.4]`

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
- `"#d9a378"`
- `"#d8cd14"`

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
- `"Pantone Matching System (PMS)"`
- `"ProPhoto RGB Color Space"`
