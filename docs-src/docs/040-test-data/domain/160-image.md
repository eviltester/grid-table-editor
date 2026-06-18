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
- Docs: [https://anywaydata.com/docs/test-data/domain/image](https://anywaydata.com/docs/test-data/domain/image)
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.avatar
```

Example return values:
- `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/0.jpg`

### `image.avatarGitHub`

Generates a random avatar from GitHub.

- Canonical: `awd.domain.image.avatarGitHub`
- Docs: [https://anywaydata.com/docs/test-data/domain/image](https://anywaydata.com/docs/test-data/domain/image)
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.avatarGitHub
```

Example return values:
- `https://avatars.githubusercontent.com/u/41702200`

### `image.dataUri`

Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.

- Canonical: `awd.domain.image.dataUri`
- Docs: [https://anywaydata.com/docs/test-data/domain/image](https://anywaydata.com/docs/test-data/domain/image)
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.dataUri
```

Example return values:
- `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%222881%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23063247%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%221440.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x2881%3C%2Ftext%3E%3C%2Fsvg%3E`

### `image.personPortrait`

Generates a random square portrait (avatar) of a person.

- Canonical: `awd.domain.image.personPortrait`
- Docs: [https://anywaydata.com/docs/test-data/domain/image](https://anywaydata.com/docs/test-data/domain/image)
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.personPortrait
```

Example return values:
- `https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/72.jpg`

### `image.url`

Generates a random image url.

- Canonical: `awd.domain.image.url`
- Docs: [https://anywaydata.com/docs/test-data/domain/image](https://anywaydata.com/docs/test-data/domain/image)
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

```txt
image.url(width=1)
```

Example return values:
- `https://picsum.photos/seed/i95bl/1668/2881`
- `https://picsum.photos/seed/0i95bloxp/1668/1`
- `https://picsum.photos/seed/0i95bloxp/1/1668`

### `image.urlPicsumPhotos`

Generates a random image url provided via https://picsum.photos.

- Canonical: `awd.domain.image.urlPicsumPhotos`
- Docs: [https://anywaydata.com/docs/test-data/domain/image](https://anywaydata.com/docs/test-data/domain/image)
- Faker docs: [https://fakerjs.dev/api/image](https://fakerjs.dev/api/image)

No parameters.

Examples:

```txt
image.urlPicsumPhotos
```

Example return values:
- `https://picsum.photos/seed/5blox/1668/2881?grayscale&blur=3`
