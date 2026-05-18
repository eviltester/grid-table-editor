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
- `[0.04,0.79,0.02,0.1]`
- `[0,0.95,0.34,0.49]`

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
- `[0.4597,0.4882,0.8589]`
- `[0.124,0.545,0.2428]`

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
- `"hsl"`
- `"hwb"`

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
- `"prophoto-rgb"`
- `"a98-rgb"`

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
color.hsl(format="hex")
```

Example return values:
- `[244,0.85,0.85]`
- `[0,0.57,0.82]`

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
- `"green"`
- `"grey"`

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
- `[346,0.21,0.92]`
- `[67,0.53,0.34]`

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
- `[0.134278,56.4849,-34.2824]`
- `[0.48796,4.4509,1.0012]`

### `color.lch`

Returns an LCH color. Even though upper bound of

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
- `[0.033562,182.1,62.3]`
- `[0.114017,49.4,39.6]`

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
color.rgb(casing="lower")
```

Example return values:
- `"#0a5ce1"`
- `"#3a8c74"`

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
- `"xvYCC"`
- `"CIELAB"`
