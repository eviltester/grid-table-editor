import { validateStringValue } from '../../../command-help/command-help-validators.js';

const MUSIC_ARTIST_KEYWORD_DEFINITION = {
  keyword: 'music.artist',
  delegate: {
    type: 'faker',
    target: 'music.artist',
  },
  help: {
    summary: 'Returns a random artist name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/music',
    fakerDocsUrl: 'https://fakerjs.dev/api/music',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'music.artist',
        sampleReturnValue: 'Jon Bellion',
        description: 'Shows the default music.artist call.',
      },
    ],
    args: [],
  },
};

export { MUSIC_ARTIST_KEYWORD_DEFINITION };
