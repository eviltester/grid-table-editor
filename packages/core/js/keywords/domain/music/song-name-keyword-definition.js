import { validateStringValue } from '../../../command-help/command-help-validators.js';

const MUSIC_SONG_NAME_KEYWORD_DEFINITION = {
  keyword: 'music.songName',
  delegate: {
    type: 'faker',
    target: 'music.songName',
  },
  help: {
    summary: 'Returns a random song name.',
    docsUrl: 'https://anywaydata.com/docs/test-data/domain/music',
    fakerDocsUrl: 'https://fakerjs.dev/api/music',
    validator: validateStringValue,
    returnType: 'string',
    usageExamples: [
      {
        functionCall: 'music.songName',
        sampleReturnValue: 'Imagine',
        description: 'Shows the default music.songName call.',
      },
    ],
    args: [],
  },
};

export { MUSIC_SONG_NAME_KEYWORD_DEFINITION };
