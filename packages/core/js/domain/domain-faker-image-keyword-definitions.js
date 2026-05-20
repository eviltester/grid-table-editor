const DOMAIN_FAKER_IMAGE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'image.avatar',
    delegate: {
      type: 'faker',
      target: 'image.avatar',
    },
    help: {
      summary: 'Generates a random avatar image url.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://avatars.githubusercontent.com/u/2389220',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.avatarGitHub',
    delegate: {
      type: 'faker',
      target: 'image.avatarGitHub',
    },
    help: {
      summary: 'Generates a random avatar from GitHub.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://avatars.githubusercontent.com/u/22969292',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.avatarLegacy',
    delegate: {
      type: 'faker',
      target: 'image.avatarLegacy',
    },
    help: {
      summary:
        'Generates a random avatar from `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar`.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1198.jpg',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.dataUri',
    delegate: {
      type: 'faker',
      target: 'image.dataUri',
    },
    help: {
      summary: 'Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.personPortrait',
    delegate: {
      type: 'faker',
      target: 'image.personPortrait',
    },
    help: {
      summary: 'Generates a random square portrait (avatar) of a person.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/99.jpg',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.url',
    delegate: {
      type: 'faker',
      target: 'image.url',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random image url.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://loremflickr.com/3255/509?lock=5223276893828872',
      returnType: 'string',
      args: [
        {
          name: 'height',
          type: 'number',
          required: false,
          description: 'The height of the image.',
        },
        {
          name: 'width',
          type: 'number',
          required: false,
          description: 'The width of the image.',
        },
      ],
    },
  },
  {
    keyword: 'image.urlLoremFlickr',
    delegate: {
      type: 'faker',
      target: 'image.urlLoremFlickr',
    },
    help: {
      summary: 'Generates a random image url provided via https://loremflickr.com.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://loremflickr.com/3966/3602?lock=6417693540486546',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.urlPicsumPhotos',
    delegate: {
      type: 'faker',
      target: 'image.urlPicsumPhotos',
    },
    help: {
      summary: 'Generates a random image url provided via https://picsum.photos.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://picsum.photos/seed/UBLQun43/2068/162?blur=8',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.urlPlaceholder',
    delegate: {
      type: 'faker',
      target: 'image.urlPlaceholder',
    },
    help: {
      summary: 'Generates a random image url provided via https://via.placeholder.com/.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://via.placeholder.com/2302x1759/a80adf/2de69f.gif?text=utrimque%20summa%20dolores',
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_IMAGE_KEYWORD_DEFINITIONS };
