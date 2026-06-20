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
| `format` | `decimal\|css\|binary` | no | Format of generated CMYK color. |

Examples:

Shows color.cmyk when optional params are omitted.

```txt
color.cmyk()
```

Returns: `[0.42,0.72,0,0.3]`

Shows color.cmyk using format.

```txt
color.cmyk(format="decimal")
```

Returns: `[0.42,0.72,0,0.3]`

### `color.colorByCSSColorSpace`

Returns a random color based on CSS color space specified.

- Canonical: `awd.domain.color.colorByCSSColorSpace`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |
| `space` | `sRGB\|display-p3\|rec2020\|a98-rgb\|prophoto-rgb` | no | Color space to generate the color for. |

Examples:

Shows color.colorByCSSColorSpace when optional params are omitted.

```txt
color.colorByCSSColorSpace()
```

Returns: `[0.417,0.7203,0.0001]`

Shows color.colorByCSSColorSpace using format.

```txt
color.colorByCSSColorSpace(format="decimal")
```

Returns: `[0.417,0.7203,0.0001]`

Shows color.colorByCSSColorSpace using space.

```txt
color.colorByCSSColorSpace(space="display-p3")
```

Returns: `[0.417,0.7203,0.0001]`

### `color.cssSupportedFunction`

Returns a random css supported color function name.

- Canonical: `awd.domain.color.cssSupportedFunction`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

Shows the default color.cssSupportedFunction call.

```txt
color.cssSupportedFunction
```

Returns: `hsla`

### `color.cssSupportedSpace`

Returns a random css supported color space name.

- Canonical: `awd.domain.color.cssSupportedSpace`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

Shows the default color.cssSupportedSpace call.

```txt
color.cssSupportedSpace
```

Returns: `rec2020`

### `color.hsl`

Returns an HSL color.

- Canonical: `awd.domain.color.hsl`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated HSL color. |
| `includeAlpha` | `boolean` | no | Adds an alpha value to the color (RGBA). |

Examples:

Shows color.hsl returning the default tuple output.

```txt
color.hsl
```

Returns: `[150,0.72,0]`

Shows color.hsl returning CSS text without alpha.

```txt
color.hsl(format="css")
```

Returns: `hsl(150deg 72% 0%)`

Shows color.hsl including alpha while keeping the tuple-style output.

```txt
color.hsl(includeAlpha=true)
```

Returns: `[150,0.72,0,0.3]`

Shows color.hsl returning CSS text with alpha included.

```txt
color.hsl(format="css", includeAlpha=true)
```

Returns: `hsl(150deg 72% 0% / 30)`

### `color.human`

Returns a random human-readable color name.

- Canonical: `awd.domain.color.human`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

Shows the default color.human call.

```txt
color.human
```

Returns: `magenta`

### `color.hwb`

Returns an HWB color.

- Canonical: `awd.domain.color.hwb`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |

Examples:

Shows color.hwb when optional params are omitted.

```txt
color.hwb()
```

Returns: `[150,0.72,0]`

Shows color.hwb using format.

```txt
color.hwb(format="decimal")
```

Returns: `[150,0.72,0]`

### `color.lab`

Returns a LAB (CIELAB) color.

- Canonical: `awd.domain.color.lab`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |

Examples:

Shows color.lab when optional params are omitted.

```txt
color.lab()
```

Returns: `[0.417022,44.0649,-99.9772]`

Shows color.lab using format.

```txt
color.lab(format="decimal")
```

Returns: `[0.417022,44.0649,-99.9772]`

### `color.lch`

Returns an LCH color.

- Canonical: `awd.domain.color.lch`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `decimal\|css\|binary` | no | Format of generated RGB color. |

Examples:

Shows color.lch when optional params are omitted.

```txt
color.lch()
```

Returns: `[0.417022,165.7,0]`

Shows color.lch using format.

```txt
color.lch(format="decimal")
```

Returns: `[0.417022,165.7,0]`

### `color.rgb`

Returns an RGB color.

- Canonical: `awd.domain.color.rgb`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `casing` | `lower\|upper\|mixed` | no | Letter type case of the generated hex color. Only applied when 'hex' format is used. |
| `format` | `hex\|decimal\|css\|binary` | no | Format of generated RGB color. |
| `includeAlpha` | `boolean` | no | Adds an alpha value to the color (RGBA). |
| `prefix` | `string` | no | Prefix of the generated hex color. Only applied when 'hex' format is used. |

Examples:

Shows color.rgb when optional params are omitted.

```txt
color.rgb()
```

Returns: `#9f0632`

Shows color.rgb using casing.

```txt
color.rgb(casing="upper")
```

Returns: `#9F0632`

Shows color.rgb using format.

```txt
color.rgb(format="hex")
```

Returns: `#9f0632`

Shows color.rgb using includeAlpha.

```txt
color.rgb(includeAlpha=true)
```

Returns: `#9f063247`

Shows color.rgb using prefix.

```txt
color.rgb(prefix="#")
```

Returns: `#9f0632`

### `color.space`

Returns a random color space name from the worldwide accepted color spaces.

- Canonical: `awd.domain.color.space`
- Faker docs: [https://fakerjs.dev/api/color](https://fakerjs.dev/api/color)

No parameters.

Examples:

Shows the default color.space call.

```txt
color.space
```

Returns: `HSV`
