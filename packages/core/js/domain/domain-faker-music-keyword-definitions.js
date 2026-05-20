const DOMAIN_FAKER_MUSIC_KEYWORD_DEFINITIONS = [
  {
    keyword: 'music.album',
    delegate: {
      type: 'faker',
      target: 'music.album',
    },
    help: {
      summary: 'Returns a random album name.',
      docsUrl: 'https://fakerjs.dev/api/music',
      example: 'R&G (Rhythm & Gangsta): The Masterpiece',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/music',
      example: 'Chuck Berry',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/music',
      example: 'Mainstream Jazz',
      returnType: 'string',
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
      docsUrl: 'https://fakerjs.dev/api/music',
      example: "I'm Sorry",
      returnType: 'string',
      args: [],
    },
  },
];

export { DOMAIN_FAKER_MUSIC_KEYWORD_DEFINITIONS };
