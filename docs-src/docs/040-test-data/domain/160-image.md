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
- `https://avatars.githubusercontent.com/u/2389220`

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
- `https://avatars.githubusercontent.com/u/22969292`

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
- `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1198.jpg`

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
- `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=`

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
- `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/99.jpg`

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
- `https://loremflickr.com/3255/509?lock=5223276893828872`

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
- `https://loremflickr.com/3966/3602?lock=6417693540486546`

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
- `https://picsum.photos/seed/UBLQun43/2068/162?blur=8`

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
- `https://via.placeholder.com/2302x1759/a80adf/2de69f.gif?text=utrimque%20summa%20dolores`
