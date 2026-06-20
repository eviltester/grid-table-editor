import { validateStringValue } from '../../../command-help/command-help-validators.js';

const MUSIC_ALBUM_KEYWORD_DEFINITION = {
  keyword: 'music.album',
  delegate: {
    type: 'faker',
    target: 'music.album',
  },
  help: {
    summary: 'Returns a random album name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/music',
    fakerDocsUrl: 'https://fakerjs.dev/api/music',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'music.album',
        sampleReturnValue: 'I Never Loved A Man The Way I Love You',
        description: 'Shows the default music.album call.',
      },
    ],
    args: [],
  },
};

export { MUSIC_ALBUM_KEYWORD_DEFINITION };
