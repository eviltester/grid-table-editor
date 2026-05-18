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
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/72.jpg"`
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/1.jpg"`

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
- `"https://avatars.githubusercontent.com/u/50978225"`
- `"https://avatars.githubusercontent.com/u/50925812"`

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
- `"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/750.jpg"`
- `"https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/624.jpg"`

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
- `"data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%222531%22%20height%3D%221448%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23903f6f%22%2F%3E%3Ctext%20x%3D%221265.5%22%20y%3D%22724%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E2531x1448%3C%2Ftext%3E%3C%2Fsvg%3E"`
- `"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSI5OTciIGhlaWdodD0iNTAyIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYmU0YjNiIi8+PHRleHQgeD0iNDk4LjUiIHk9IjI1MSIgZm9udC1zaXplPSIyMCIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj45OTd4NTAyPC90ZXh0Pjwvc3ZnPg=="`

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
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/36.jpg"`
- `"https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/67.jpg"`

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
- `"https://loremflickr.com/292/3978?lock=1608768283317386"`
- `"https://loremflickr.com/1134/3925?lock=593683193772099"`

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
- `"https://loremflickr.com/407/974?lock=6183851182833613"`
- `"https://loremflickr.com/3491/2022?lock=33951642992663"`

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
- `"https://picsum.photos/seed/Zs3K8/3727/3780?grayscale&blur=2"`
- `"https://picsum.photos/seed/Dl6Lj/2621/1142"`

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
- `"https://via.placeholder.com/1331x2264/fcbacf/6f71c5.png?text=cerno%20conicio%20adeo"`
- `"https://via.placeholder.com/2483x3275/8fa3fd/2fd0f1.png?text=tertius%20excepturi%20pecus"`
