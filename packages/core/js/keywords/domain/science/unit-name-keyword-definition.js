import { validateStringValue } from '../../../command-help/command-help-validators.js';

const SCIENCE_UNIT_NAME_KEYWORD_DEFINITION = {
  keyword: 'science.unit.name',
  delegate: {
    type: 'faker',
    target: 'science.unit',
    resultPath: 'name',
  },
  help: {
    summary: 'Generate a scientific unit name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/science',
    fakerDocsUrl: 'https://fakerjs.dev/api/science',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'science.unit.name',
        sampleReturnValue: 'watt',
        description: 'Shows the default science.unit.name call.',
      },
    ],
    args: [],
  },
};

export { SCIENCE_UNIT_NAME_KEYWORD_DEFINITION };
