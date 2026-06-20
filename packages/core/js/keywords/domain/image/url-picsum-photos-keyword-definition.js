import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_URL_PICSUM_PHOTOS_KEYWORD_DEFINITION = {
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
};

export { IMAGE_URL_PICSUM_PHOTOS_KEYWORD_DEFINITION };
