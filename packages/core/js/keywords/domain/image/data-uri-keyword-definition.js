import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_DATA_URI_KEYWORD_DEFINITION = {
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
};

export { IMAGE_DATA_URI_KEYWORD_DEFINITION };
