import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_IMAGE_KEYWORD_DEFINITIONS = [
  {
    keyword: 'image.avatar',
    delegate: {
      type: 'faker',
      target: 'image.avatar',
    },
    help: {
      summary: 'Generates a random avatar image url.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
      fakerDocsUrl: 'https://fakerjs.dev/api/image',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'image.avatar',
          sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/0.jpg',
          description: 'Shows the default image.avatar call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
      fakerDocsUrl: 'https://fakerjs.dev/api/image',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'image.avatarGitHub',
          sampleReturnValue: 'https://avatars.githubusercontent.com/u/41702200',
          description: 'Shows the default image.avatarGitHub call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
      fakerDocsUrl: 'https://fakerjs.dev/api/image',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'image.dataUri',
          sampleReturnValue:
            'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%222881%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23063247%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%221440.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x2881%3C%2Ftext%3E%3C%2Fsvg%3E',
          description: 'Shows the default image.dataUri call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
      fakerDocsUrl: 'https://fakerjs.dev/api/image',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'image.personPortrait',
          sampleReturnValue: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/72.jpg',
          description: 'Shows the default image.personPortrait call.',
        },
      ],
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
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
      fakerDocsUrl: 'https://fakerjs.dev/api/image',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'image.url()',
          sampleReturnValue: 'https://picsum.photos/seed/i95bl/1668/2881',
          description: 'Shows image.url when optional params are omitted.',
        },
        {
          functionCall: 'image.url(height=1)',
          sampleReturnValue: 'https://picsum.photos/seed/0i95bloxp/1668/1',
          description: 'Shows image.url using height.',
        },
        {
          functionCall: 'image.url(width=1)',
          sampleReturnValue: 'https://picsum.photos/seed/0i95bloxp/1/1668',
          description: 'Shows image.url using width.',
        },
      ],
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
    keyword: 'image.urlPicsumPhotos',
    delegate: {
      type: 'faker',
      target: 'image.urlPicsumPhotos',
    },
    help: {
      summary: 'Generates a random image url provided via https://picsum.photos.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
      fakerDocsUrl: 'https://fakerjs.dev/api/image',
      validator: validateStringValue,
      returnType: 'string',
      usageExamples: [
        {
          functionCall: 'image.urlPicsumPhotos',
          sampleReturnValue: 'https://picsum.photos/seed/5blox/1668/2881?grayscale&blur=3',
          description: 'Shows the default image.urlPicsumPhotos call.',
        },
      ],
      args: [],
    },
  },
];

export { DOMAIN_FAKER_IMAGE_KEYWORD_DEFINITIONS };
