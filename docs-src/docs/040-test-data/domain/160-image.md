---
sidebar_position: 160
title: "image Domain"
description: "Domain keyword reference for image."
---

# image Domain

The `image` domain maps domain keywords to underlying faker implementations.

## Faker Documentation

- [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

## Methods

### `image.avatar`

Generates a random avatar image url.

- Canonical: `awd.domain.image.avatar`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

Shows the default image.avatar call.

```txt
image.avatar
```

Returns: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/0.jpg`

### `image.avatarGitHub`

Generates a random avatar from GitHub.

- Canonical: `awd.domain.image.avatarGitHub`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

Shows the default image.avatarGitHub call.

```txt
image.avatarGitHub
```

Returns: `https://avatars.githubusercontent.com/u/41702200`

### `image.dataUri`

Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.

- Canonical: `awd.domain.image.dataUri`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `width` | `number` | no | Width of the generated image. |
| `height` | `number` | no | Height of the generated image. |
| `color` | `string` | no | Fill color for the generated SVG image. |
| `type` | `svg-uri\|svg-base64` | no | Encoding format for the generated SVG data URI. |

Examples:

Shows the default image.dataUri call.

```txt
image.dataUri()
```

Returns: `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%222881%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23063247%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%221440.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x2881%3C%2Ftext%3E%3C%2Fsvg%3E`

Shows image.dataUri using explicit image dimensions, color, and encoding type.

```txt
image.dataUri(width=320, height=240, color="red", type="svg-base64")
```

Returns: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiLz48dGV4dCB4PSIxNjAiIHk9IjEyMCIgZm9udC1zaXplPSIyMCIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj4zMjB4MjQwPC90ZXh0Pjwvc3ZnPg==`

Shows image.dataUri using an explicit width.

```txt
image.dataUri(width=320)
```

Returns: `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22320%22%20height%3D%221668%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f06324%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22834%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E320x1668%3C%2Ftext%3E%3C%2Fsvg%3E`

Shows image.dataUri using an explicit height.

```txt
image.dataUri(height=240)
```

Returns: `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%22240%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f06324%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%22120%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x240%3C%2Ftext%3E%3C%2Fsvg%3E`

Shows image.dataUri using an explicit SVG fill color.

```txt
image.dataUri(color="red")
```

Returns: `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%222881%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22red%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%221440.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x2881%3C%2Ftext%3E%3C%2Fsvg%3E`

Shows image.dataUri using Base64 SVG encoding.

```txt
image.dataUri(type="svg-base64")
```

Returns: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSIxNjY4IiBoZWlnaHQ9IjI4ODEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwNjMyNDciLz48dGV4dCB4PSI4MzQiIHk9IjE0NDAuNSIgZm9udC1zaXplPSIyMCIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj4xNjY4eDI4ODE8L3RleHQ+PC9zdmc+`

### `image.personPortrait`

Generates a random square portrait (avatar) of a person.

- Canonical: `awd.domain.image.personPortrait`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `sex` | `female\|generic\|male` | no | Sex category used for the generated portrait. |
| `size` | `512\|256\|128\|64\|32` | no | Square image size in pixels. |

Examples:

Shows the default image.personPortrait call.

```txt
image.personPortrait()
```

Returns: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/72.jpg`

Shows image.personPortrait using sex and size options.

```txt
image.personPortrait(sex="female", size=128)
```

Returns: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/41.jpg`

Shows image.personPortrait using a sex category.

```txt
image.personPortrait(sex="female")
```

Returns: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/41.jpg`

Shows image.personPortrait using an explicit image size.

```txt
image.personPortrait(size=128)
```

Returns: `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/128/72.jpg`

### `image.url`

Generates a random image url.

- Canonical: `awd.domain.image.url`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `height` | `number` | no | The height of the image. |
| `width` | `number` | no | The width of the image. |

Examples:

Shows image.url when optional params are omitted.

```txt
image.url()
```

Returns: `https://picsum.photos/seed/i95bl/1668/2881`

Shows image.url using height.

```txt
image.url(height=1)
```

Returns: `https://picsum.photos/seed/0i95bloxp/1668/1`

Shows image.url using width.

```txt
image.url(width=1)
```

Returns: `https://picsum.photos/seed/0i95bloxp/1/1668`

### `image.urlPicsumPhotos`

Generates a random image url provided via https://picsum.photos.

- Canonical: `awd.domain.image.urlPicsumPhotos`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `width` | `number` | no | Width of the generated image URL. |
| `height` | `number` | no | Height of the generated image URL. |
| `grayscale` | `boolean` | no | Whether the generated image URL should request a grayscale image. |
| `blur` | `0\|1\|2\|3\|4\|5\|6\|7\|8\|9\|10` | no | Blur amount for the generated image URL. |

Examples:

Shows the default image.urlPicsumPhotos call.

```txt
image.urlPicsumPhotos()
```

Returns: `https://picsum.photos/seed/5blox/1668/2881?grayscale&blur=3`

Shows image.urlPicsumPhotos using dimension and filter options.

```txt
image.urlPicsumPhotos(width=320, height=240, grayscale=true, blur=3)
```

Returns: `https://picsum.photos/seed/I0i95bl/320/240?grayscale&blur=3`

Shows image.urlPicsumPhotos using an explicit width.

```txt
image.urlPicsumPhotos(width=320)
```

Returns: `https://picsum.photos/seed/95blox/320/1668`

Shows image.urlPicsumPhotos using an explicit height.

```txt
image.urlPicsumPhotos(height=240)
```

Returns: `https://picsum.photos/seed/95blox/1668/240`

Shows image.urlPicsumPhotos requesting a grayscale image.

```txt
image.urlPicsumPhotos(grayscale=true)
```

Returns: `https://picsum.photos/seed/95blox/1668/2881?grayscale`

Shows image.urlPicsumPhotos requesting a blur amount.

```txt
image.urlPicsumPhotos(blur=3)
```

Returns: `https://picsum.photos/seed/95blox/1668/2881?grayscale&blur=3`
