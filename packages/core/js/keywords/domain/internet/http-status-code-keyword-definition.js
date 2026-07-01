import { validateNumberValue } from '../../../command-help/command-help-validators.js';

const HTTP_STATUS_CODE_TYPES = ['informational', 'success', 'redirection', 'clientError', 'serverError'];

function validateHttpStatusCodeTypes(_args = [], context = {}) {
  const types = context?.argsByName?.types;
  if (typeof types === 'undefined') {
    return { ok: true };
  }
  if (!Array.isArray(types)) {
    return { ok: true };
  }

  const invalidType = types.find((type) => !HTTP_STATUS_CODE_TYPES.includes(type));
  if (typeof invalidType !== 'undefined') {
    return {
      ok: false,
      error: `Invalid keyword arguments: argument "types" contains unsupported value "${String(
        invalidType
      )}". Allowed values are ${HTTP_STATUS_CODE_TYPES.join(', ')}`,
    };
  }

  return { ok: true };
}

const INTERNET_HTTP_STATUS_CODE_KEYWORD_DEFINITION = {
  keyword: 'internet.httpStatusCode',
  delegate: {
    type: 'faker',
    target: 'internet.httpStatusCode',
    argTransform: 'optionsFromHelpArgs',
  },
  help: {
    summary: 'Generates a random HTTP status code.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateNumberValue,
    argsValidator: validateHttpStatusCodeTypes,
    returnType: 'number',
    usageExamples: [
      {
        functionCall: 'internet.httpStatusCode()',
        sampleReturnValue: 306,
        description: 'Shows the default internet.httpStatusCode call.',
      },
      {
        functionCall: 'internet.httpStatusCode(types=["success"])',
        sampleReturnValue: 204,
        description: 'Shows internet.httpStatusCode constrained to success status codes.',
      },
    ],
    args: [
      {
        name: 'types',
        type: 'array',
        required: false,
        description:
          'HTTP status categories to choose from. Allowed categories are informational, success, redirection, clientError, and serverError.',
        examples: [['success']],
      },
    ],
  },
};

export { INTERNET_HTTP_STATUS_CODE_KEYWORD_DEFINITION };
