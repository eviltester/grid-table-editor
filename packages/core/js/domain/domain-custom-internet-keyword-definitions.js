import { createPredicateValidator } from '../command-help/command-help-validators.js';
import { INTERNET_HTTP_METHOD_RETURN_TYPE, getInternetHttpMethodPool } from './internet-http-method.js';

const validateHttpMethodValue = createPredicateValidator((value, context = {}) => {
  const args = Array.isArray(context?.args)
    ? context.args
    : Array.isArray(context?.parsedArgs)
      ? context.parsedArgs
      : [];
  const availableMethods = getInternetHttpMethodPool({
    commonOnly: args[0] === true,
    excludes: typeof args[1] === 'undefined' ? '' : args[1],
  });

  return availableMethods.includes(String(value ?? '').trim());
});

const DOMAIN_CUSTOM_INTERNET_KEYWORD_DEFINITIONS = [
  {
    keyword: 'internet.httpMethod',
    delegate: {
      type: 'custom',
      target: 'internet.httpMethod',
    },
    help: {
      summary:
        'Returns a random HTTP request method from an AnywayData-defined pool of GET, HEAD, POST, PUT, DELETE, PATCH, OPTIONS, TRACE, and CONNECT, with optional filtering for common methods and exclusions.',
      docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
      fakerDocsUrl: '',
      validator: validateHttpMethodValue,
      returnType: INTERNET_HTTP_METHOD_RETURN_TYPE,
      usageExamples: [
        {
          functionCall: 'internet.httpMethod()',
          sampleReturnValue: 'PUT',
          description: 'Shows internet.httpMethod choosing from the full HTTP method set by default.',
        },
        {
          functionCall: 'internet.httpMethod(commonOnly=true)',
          sampleReturnValue: 'POST',
          description: 'Shows internet.httpMethod restricted to the common request methods.',
        },
        {
          functionCall: 'internet.httpMethod(excludes="patch, TRACE")',
          sampleReturnValue: 'POST',
          description:
            'Shows internet.httpMethod trimming spaces, normalizing case, and excluding methods from the full set.',
        },
      ],
      args: [
        {
          name: 'commonOnly',
          type: 'boolean',
          required: false,
          description: 'When true, limits generation to GET, HEAD, POST, PUT, and DELETE. Defaults to false.',
          examples: [true],
        },
        {
          name: 'excludes',
          type: 'string',
          required: false,
          description:
            'Comma-separated HTTP methods to remove from the candidate set. Values are case-insensitive, surrounding spaces are trimmed, and generation throws if exclusions remove every available method.',
          examples: ['patch, TRACE'],
        },
      ],
    },
  },
];

export { DOMAIN_CUSTOM_INTERNET_KEYWORD_DEFINITIONS };
