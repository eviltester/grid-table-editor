import { validateStringValue } from '../../../command-help/command-help-validators.js';

const PERSON_ZODIAC_SIGN_KEYWORD_DEFINITION = {
  keyword: 'person.zodiacSign',
  delegate: {
    type: 'faker',
    target: 'person.zodiacSign',
  },
  help: {
    summary: 'Returns a random zodiac sign.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/person',
    fakerDocsUrl: 'https://fakerjs.dev/api/person',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'person.zodiacSign',
        sampleReturnValue: 'Cancer',
        description: 'Shows the default person.zodiacSign call.',
      },
    ],
    args: [],
  },
};

export { PERSON_ZODIAC_SIGN_KEYWORD_DEFINITION };
