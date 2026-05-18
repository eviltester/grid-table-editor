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
- `[0.1,0.9,0.93,0.64]`
- `[0.04,0.12,0.08,0.42]`

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
- `[0.4815,0.1635,0.5668]`
- `[0.2589,0.7491,0.2178]`

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
- `"hwb"`
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
- `"prophoto-rgb"`
- `"prophoto-rgb"`

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
- `[341,0.5,0.84]`
- `[298,0.36,0.6]`

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
- `"maroon"`
- `"violet"`

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
- `[65,0.7,0.92]`
- `[54,0.58,0.39]`

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
- `[0.438621,65.7586,-1.9963]`
- `[0.229125,27.2715,-19.9315]`

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
- `[0.544119,189.6,105]`
- `[0.591094,193.5,159.6]`

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
- `"#64be3a"`
- `"#31ebfe"`

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
- `"Rec. 2100"`
- `"LCh"`
