import { validateFromCharactersStringValue } from '../../../command-help/command-help-validators.js';
import { createPositiveIntegerArgsValidator } from '../shared/common-arg-validators.js';

const validateStringFromCharactersArgs = createPositiveIntegerArgsValidator(['length']);

const STRING_FROM_CHARACTERS_KEYWORD_DEFINITION = {
  keyword: 'string.fromCharacters',
  delegate: {
    type: 'faker',
    target: 'string.fromCharacters',
  },
  help: {
    summary: 'Generates a string from the given characters.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/string',
    fakerDocsUrl: 'https://fakerjs.dev/api/string',
    validator: validateFromCharactersStringValue,
    argsValidator: validateStringFromCharactersArgs,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'string.fromCharacters(characters="ABC123")',
        sampleReturnValue: 'C',
        description: 'Shows string.fromCharacters with only the required characters argument.',
      },
      {
        functionCall: 'string.fromCharacters(characters=["A", "B", "C"], length=4)',
        sampleReturnValue: 'BCAA',
        description: 'Shows string.fromCharacters in use.',
      },
      {
        functionCall: 'string.fromCharacters(characters="ABC123", length=4)',
        sampleReturnValue: 'C2AB',
        description: 'Shows string.fromCharacters using length.',
      },
    ],
    args: [
      {
        name: 'characters',
        type: 'string|array',
        required: true,
        description: 'Character set (string or array) used when generating output.',
        examples: ['ABC123'],
      },
      {
        name: 'length',
        type: 'integer',
        required: false,
        description: 'Desired length of the generated value.',
        examples: [4],
      },
    ],
  },
};

export { STRING_FROM_CHARACTERS_KEYWORD_DEFINITION };
