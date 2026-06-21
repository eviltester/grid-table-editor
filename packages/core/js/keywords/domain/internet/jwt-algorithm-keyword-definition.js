import { createStringEnumValidator } from '../../../command-help/command-help-validators.js';

const JWT_ALGORITHM_RETURN_TYPE = 'ES256|ES384|ES512|HS256|HS384|HS512|PS256|PS384|PS512|RS256|RS384|RS512|none';

const validateJwtAlgorithmValue = createStringEnumValidator(JWT_ALGORITHM_RETURN_TYPE.split('|'));

const INTERNET_JWT_ALGORITHM_KEYWORD_DEFINITION = {
  keyword: 'internet.jwtAlgorithm',
  delegate: {
    type: 'faker',
    target: 'internet.jwtAlgorithm',
  },
  help: {
    summary: 'Generates a random JWT (JSON Web Token) Algorithm.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/internet',
    fakerDocsUrl: 'https://fakerjs.dev/api/internet',
    validator: validateJwtAlgorithmValue,
    returnType: JWT_ALGORITHM_RETURN_TYPE,
    usageExamples: [
      {
        functionCall: 'internet.jwtAlgorithm',
        sampleReturnValue: 'HS512',
        description: 'Shows the default internet.jwtAlgorithm call.',
      },
    ],
    args: [],
  },
};

export { INTERNET_JWT_ALGORITHM_KEYWORD_DEFINITION };
