import { validateSemverValue } from '../../../command-help/command-help-validators.js';

const SYSTEM_SEMVER_KEYWORD_DEFINITION = {
  keyword: 'system.semver',
  delegate: {
    type: 'faker',
    target: 'system.semver',
  },
  help: {
    summary: 'Returns a semantic version.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/system',
    fakerDocsUrl: 'https://fakerjs.dev/api/system',
    validator: validateSemverValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'system.semver',
        sampleReturnValue: '4.15.0',
        description: 'Shows the default system.semver call.',
      },
    ],
    args: [],
  },
};

export { SYSTEM_SEMVER_KEYWORD_DEFINITION };
