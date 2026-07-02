import { validateStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateImageUrlArgs = createPositiveIntegerArgsValidator(['height', 'width']);

const IMAGE_URL_KEYWORD_DEFINITION = {
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
    argsValidator: validateImageUrlArgs,
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
};

export { IMAGE_URL_KEYWORD_DEFINITION };
