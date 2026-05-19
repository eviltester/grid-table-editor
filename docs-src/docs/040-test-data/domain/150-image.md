---
sidebar_position: 150
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

```txt
image.avatar()
```

Example return values:
- `"https://avatars.githubusercontent.com/u/4737631"`
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/74.jpg"`

### `image.avatarGitHub`

Generates a random avatar from GitHub.

- Canonical: `awd.domain.image.avatarGitHub`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.avatarGitHub()
```

Example return values:
- `"https://avatars.githubusercontent.com/u/21478609"`
- `"https://avatars.githubusercontent.com/u/94618277"`

### `image.avatarLegacy`

Generates a random avatar from `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar`.

- Canonical: `awd.domain.image.avatarLegacy`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.avatarLegacy()
```

Example return values:
- `"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/498.jpg"`
- `"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/217.jpg"`

### `image.dataUri`

Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.

- Canonical: `awd.domain.image.dataUri`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.dataUri()
```

Example return values:
- `"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%222411%22%20height%3D%222600%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23d474ad%22%2F%3E%3Ctext%20x%3D%221205.5%22%20y%3D%221300%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E2411x2600%3C%2Ftext%3E%3C%2Fsvg%3E"`
- `"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%222648%22%20height%3D%223613%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23fe202c%22%2F%3E%3Ctext%20x%3D%221324%22%20y%3D%221806.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E2648x3613%3C%2Ftext%3E%3C%2Fsvg%3E"`

### `image.personPortrait`

Generates a random square portrait (avatar) of a person.

- Canonical: `awd.domain.image.personPortrait`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.personPortrait()
```

Example return values:
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/97.jpg"`
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/72.jpg"`

### `image.url`

Generates a random image url.

- Canonical: `awd.domain.image.url`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

| Arg | Type | Required | Description |
| --- | --- | --- | --- |
| `height` | `number` | no | The height of the image. |
| `width` | `number` | no | The width of the image. |

Examples:

```txt
image.url()
```

```txt
image.url(height=1, width=1)
```

Example return values:
- `"https://loremflickr.com/2047/2524?lock=8418418111332618"`
- `"https://loremflickr.com/3726/3449?lock=1810011656215161"`

### `image.urlLoremFlickr`

Generates a random image url provided via https://loremflickr.com.

- Canonical: `awd.domain.image.urlLoremFlickr`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.urlLoremFlickr()
```

Example return values:
- `"https://loremflickr.com/3246/1034?lock=1014047844060749"`
- `"https://loremflickr.com/89/2631?lock=4768337721421349"`

### `image.urlPicsumPhotos`

Generates a random image url provided via https://picsum.photos.

- Canonical: `awd.domain.image.urlPicsumPhotos`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.urlPicsumPhotos()
```

Example return values:
- `"https://picsum.photos/seed/s2F0L/2185/1092?blur=7"`
- `"https://picsum.photos/seed/BGb8i/639/1119?blur=6"`

### `image.urlPlaceholder`

Generates a random image url provided via https://via.placeholder.com/.

- Canonical: `awd.domain.image.urlPlaceholder`
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.urlPlaceholder()
```

Example return values:
- `"https://via.placeholder.com/954x3055/45ad7e/fcd4eb.png?text=incidunt%20eos%20id"`
- `"https://via.placeholder.com/234x1659/9dd0fd/de5f36.gif?text=agnitio%20decretum%20undique"`
