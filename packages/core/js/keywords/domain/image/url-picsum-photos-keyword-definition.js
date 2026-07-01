import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_URL_PICSUM_PHOTOS_KEYWORD_DEFINITION = {
  keyword: 'image.urlPicsumPhotos',
  delegate: {
    type: 'faker',
    target: 'image.urlPicsumPhotos',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random image url provided via https://picsum.photos.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
    fakerDocsUrl: 'https://fakerjs.dev/api/image',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'image.urlPicsumPhotos()',
        sampleReturnValue: 'https://picsum.photos/seed/5blox/1668/2881?grayscale&blur=3',
        description: 'Shows the default image.urlPicsumPhotos call.',
      },
      {
        functionCall: 'image.urlPicsumPhotos(width=320, height=240, grayscale=true, blur=3)',
        sampleReturnValue: 'https://picsum.photos/seed/I0i95bl/320/240?grayscale&blur=3',
        description: 'Shows image.urlPicsumPhotos using dimension and filter options.',
      },
      {
        functionCall: 'image.urlPicsumPhotos(width=320)',
        sampleReturnValue: 'https://picsum.photos/seed/95blox/320/1668',
        description: 'Shows image.urlPicsumPhotos using an explicit width.',
      },
      {
        functionCall: 'image.urlPicsumPhotos(height=240)',
        sampleReturnValue: 'https://picsum.photos/seed/95blox/1668/240',
        description: 'Shows image.urlPicsumPhotos using an explicit height.',
      },
      {
        functionCall: 'image.urlPicsumPhotos(grayscale=true)',
        sampleReturnValue: 'https://picsum.photos/seed/95blox/1668/2881?grayscale',
        description: 'Shows image.urlPicsumPhotos requesting a grayscale image.',
      },
      {
        functionCall: 'image.urlPicsumPhotos(blur=3)',
        sampleReturnValue: 'https://picsum.photos/seed/95blox/1668/2881?grayscale&blur=3',
        description: 'Shows image.urlPicsumPhotos requesting a blur amount.',
      },
    ],
    args: [
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Width of the generated image URL.',
        examples: [320],
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Height of the generated image URL.',
        examples: [240],
      },
      {
        name: 'grayscale',
        type: 'boolean',
        required: false,
        description: 'Whether the generated image URL should request a grayscale image.',
        examples: [true],
      },
      {
        name: 'blur',
        type: '0|1|2|3|4|5|6|7|8|9|10',
        required: false,
        description: 'Blur amount for the generated image URL.',
        examples: [3],
      },
    ],
  },
};

export { IMAGE_URL_PICSUM_PHOTOS_KEYWORD_DEFINITION };
