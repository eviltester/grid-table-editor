import { validateStringValue } from '../../../command-help/command-help-validators.js';

const MUSIC_GENRE_KEYWORD_DEFINITION = {
  keyword: 'music.genre',
  delegate: {
    type: 'faker',
    target: 'music.genre',
  },
  help: {
    summary: 'Returns a random music genre.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/music',
    fakerDocsUrl: 'https://fakerjs.dev/api/music',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'music.genre',
        sampleReturnValue: 'Hard Bop',
        description: 'Shows the default music.genre call.',
      },
    ],
    args: [],
  },
};

export { MUSIC_GENRE_KEYWORD_DEFINITION };
