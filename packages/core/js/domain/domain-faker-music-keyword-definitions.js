import { validateStringValue } from '../command-help/command-help-validators.js';

const DOMAIN_FAKER_MUSIC_KEYWORD_DEFINITIONS = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

export { DOMAIN_FAKER_MUSIC_KEYWORD_DEFINITIONS };
