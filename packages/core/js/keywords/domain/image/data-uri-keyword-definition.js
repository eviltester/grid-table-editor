import { validateStringValue } from '../../../command-help/command-help-validators.js';

const IMAGE_DATA_URI_KEYWORD_DEFINITION = {
  keyword: 'image.dataUri',
  delegate: {
    type: 'faker',
    target: 'image.dataUri',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/image',
    fakerDocsUrl: 'https://fakerjs.dev/api/image',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'image.dataUri()',
        sampleReturnValue:
          'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%222881%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23063247%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%221440.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x2881%3C%2Ftext%3E%3C%2Fsvg%3E',
        description: 'Shows the default image.dataUri call.',
      },
      {
        functionCall: 'image.dataUri(width=320, height=240, color="red", type="svg-base64")',
        sampleReturnValue:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSIzMjAiIGhlaWdodD0iMjQwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZWQiLz48dGV4dCB4PSIxNjAiIHk9IjEyMCIgZm9udC1zaXplPSIyMCIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj4zMjB4MjQwPC90ZXh0Pjwvc3ZnPg==',
        description: 'Shows image.dataUri using explicit image dimensions, color, and encoding type.',
      },
      {
        functionCall: 'image.dataUri(width=320)',
        sampleReturnValue:
          'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%22320%22%20height%3D%221668%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f06324%22%2F%3E%3Ctext%20x%3D%22160%22%20y%3D%22834%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E320x1668%3C%2Ftext%3E%3C%2Fsvg%3E',
        description: 'Shows image.dataUri using an explicit width.',
      },
      {
        functionCall: 'image.dataUri(height=240)',
        sampleReturnValue:
          'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%22240%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23f06324%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%22120%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x240%3C%2Ftext%3E%3C%2Fsvg%3E',
        description: 'Shows image.dataUri using an explicit height.',
      },
      {
        functionCall: 'image.dataUri(color="red")',
        sampleReturnValue:
          'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20baseProfile%3D%22full%22%20width%3D%221668%22%20height%3D%222881%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22red%22%2F%3E%3Ctext%20x%3D%22834%22%20y%3D%221440.5%22%20font-size%3D%2220%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22white%22%3E1668x2881%3C%2Ftext%3E%3C%2Fsvg%3E',
        description: 'Shows image.dataUri using an explicit SVG fill color.',
      },
      {
        functionCall: 'image.dataUri(type="svg-base64")',
        sampleReturnValue:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiIHdpZHRoPSIxNjY4IiBoZWlnaHQ9IjI4ODEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwNjMyNDciLz48dGV4dCB4PSI4MzQiIHk9IjE0NDAuNSIgZm9udC1zaXplPSIyMCIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj4xNjY4eDI4ODE8L3RleHQ+PC9zdmc+',
        description: 'Shows image.dataUri using Base64 SVG encoding.',
      },
    ],
    args: [
      {
        name: 'width',
        type: 'number',
        required: false,
        description: 'Width of the generated image.',
        examples: [320],
      },
      {
        name: 'height',
        type: 'number',
        required: false,
        description: 'Height of the generated image.',
        examples: [240],
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        description: 'Fill color for the generated SVG image.',
        examples: ['red'],
      },
      {
        name: 'type',
        type: 'svg-uri|svg-base64',
        required: false,
        description: 'Encoding format for the generated SVG data URI.',
        examples: ['svg-base64'],
      },
    ],
  },
};

export { IMAGE_DATA_URI_KEYWORD_DEFINITION };
