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

```txt
image.avatar()
```

Example return values:
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/10.jpg"`
- `"https://avatars.githubusercontent.com/u/92788467"`

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
- `"https://avatars.githubusercontent.com/u/87085544"`
- `"https://avatars.githubusercontent.com/u/70392723"`

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
- `"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/571.jpg"`
- `"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1048.jpg"`

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
- `"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%223272%22%20height%3D%223331%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%236ac7c3%22%2F%3E%3Ctext%20x%3D%221636%22%20y%3D%221665.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E3272x3331%3C%2Ftext%3E%3C%2Fsvg%3E"`
- `"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSIzNzAyIiBoZWlnaHQ9IjI1NSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2JlOGJkNSIvPjx0ZXh0IHg9IjE4NTEiIHk9IjEyNy41IiBmb250LXNpemU9IjIwIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPjM3MDJ4MjU1PC90ZXh0Pjwvc3ZnPg=="`

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
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/50.jpg"`
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/64.jpg"`

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
image.url(height=1)
```

Example return values:
- `"https://loremflickr.com/1318/2577?lock=4954463868061197"`
- `"https://loremflickr.com/3072/399?lock=2937365668960761"`

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
- `"https://loremflickr.com/2541/3330?lock=1374262279106892"`
- `"https://loremflickr.com/2401/2830?lock=3324842400749392"`

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
- `"https://picsum.photos/seed/eiamFvOpB/1469/1512?blur=10"`
- `"https://picsum.photos/seed/qfhChKpB4/3352/404?blur=1"`

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
- `"https://via.placeholder.com/3430x581/eaae60/bc5fc0.jpeg?text=depono%20adnuo%20crastinus"`
- `"https://via.placeholder.com/1110x1785/fc2ffd/3c77e0.webp?text=appositus%20tempore%20non"`
