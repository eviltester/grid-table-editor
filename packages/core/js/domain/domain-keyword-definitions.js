const DOMAIN_KEYWORD_DEFINITIONS = [
  {
    keyword: 'airline.aircraftType',
    delegate: {
      type: 'faker',
      target: 'airline.aircraftType',
    },
    help: {
      summary: 'Returns a random aircraft type.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'regional',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.airline',
    delegate: {
      type: 'faker',
      target: 'airline.airline',
    },
    help: {
      summary: 'Generate a value using faker airline.airline.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '',
      returnType: 'object',
      args: [],
    },
  },
  {
    keyword: 'airline.airline.iataCode',
    delegate: {
      type: 'faker',
      target: 'airline.airline',
      resultPath: 'iataCode',
    },
    help: {
      summary: 'Generate an airline IATA code.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'AA',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.airline.name',
    delegate: {
      type: 'faker',
      target: 'airline.airline',
      resultPath: 'name',
    },
    help: {
      summary: 'Generate an airline name.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'Acme Air',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.airplane',
    delegate: {
      type: 'faker',
      target: 'airline.airplane',
    },
    help: {
      summary: 'Generate a value using faker airline.airplane.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '',
      returnType: 'object',
      args: [],
    },
  },
  {
    keyword: 'airline.airplane.iataTypeCode',
    delegate: {
      type: 'faker',
      target: 'airline.airplane',
      resultPath: 'iataTypeCode',
    },
    help: {
      summary: 'Generate an airplane IATA type code.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'A320',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.airplane.name',
    delegate: {
      type: 'faker',
      target: 'airline.airplane',
      resultPath: 'name',
    },
    help: {
      summary: 'Generate an airplane model name.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'Boeing 737',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.airport',
    delegate: {
      type: 'faker',
      target: 'airline.airport',
    },
    help: {
      summary: 'Generate a value using faker airline.airport.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '',
      returnType: 'object',
      args: [],
    },
  },
  {
    keyword: 'airline.airport.iataCode',
    delegate: {
      type: 'faker',
      target: 'airline.airport',
      resultPath: 'iataCode',
    },
    help: {
      summary: 'Generate an airport IATA code.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'LHR',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.airport.name',
    delegate: {
      type: 'faker',
      target: 'airline.airport',
      resultPath: 'name',
    },
    help: {
      summary: 'Generate an airport name.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'London Heathrow Airport',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.flightNumber',
    delegate: {
      type: 'faker',
      target: 'airline.flightNumber',
    },
    help: {
      summary: 'Returns a random flight number. Flight numbers are always 1 to 4 digits long. Sometimes they are',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '1',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.recordLocator',
    delegate: {
      type: 'faker',
      target: 'airline.recordLocator',
    },
    help: {
      summary: 'Generates a random record locator. Record locators',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: 'TCSJCN',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'airline.seat',
    delegate: {
      type: 'faker',
      target: 'airline.seat',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random seat.',
      docsUrl: 'https://fakerjs.dev/api/airline',
      example: '17F',
      returnType: 'string',
      args: [
        {
          name: 'aircraftType',
          type: 'string',
          required: false,
          description: 'The aircraft type. Can be one of narrowbody, regional, widebody.',
        },
      ],
    },
  },
  {
    keyword: 'animal.bear',
    delegate: {
      type: 'faker',
      target: 'animal.bear',
    },
    help: {
      summary: 'Returns a random bear species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Sloth bear',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.bird',
    delegate: {
      type: 'faker',
      target: 'animal.bird',
    },
    help: {
      summary: 'Returns a random bird species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Orange-crowned Warbler',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.cat',
    delegate: {
      type: 'faker',
      target: 'animal.cat',
    },
    help: {
      summary: 'Returns a random cat breed.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Russian Blue',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.cetacean',
    delegate: {
      type: 'faker',
      target: 'animal.cetacean',
    },
    help: {
      summary: 'Returns a random cetacean species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Hector’s Dolphin',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.cow',
    delegate: {
      type: 'faker',
      target: 'animal.cow',
    },
    help: {
      summary: 'Returns a random cow species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Aubrac',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.crocodilia',
    delegate: {
      type: 'faker',
      target: 'animal.crocodilia',
    },
    help: {
      summary: 'Returns a random crocodilian species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Nile Crocodile',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.dog',
    delegate: {
      type: 'faker',
      target: 'animal.dog',
    },
    help: {
      summary: 'Returns a random dog breed.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Jonangi',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.fish',
    delegate: {
      type: 'faker',
      target: 'animal.fish',
    },
    help: {
      summary: 'Returns a random fish species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Short mackerel',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.horse',
    delegate: {
      type: 'faker',
      target: 'animal.horse',
    },
    help: {
      summary: 'Returns a random horse breed.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Rottaler',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.insect',
    delegate: {
      type: 'faker',
      target: 'animal.insect',
    },
    help: {
      summary: 'Returns a random insect species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Pigeon tremex',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.lion',
    delegate: {
      type: 'faker',
      target: 'animal.lion',
    },
    help: {
      summary: 'Returns a random lion species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Masai Lion',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.petName',
    delegate: {
      type: 'faker',
      target: 'animal.petName',
    },
    help: {
      summary: 'Returns a random pet name.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Stella',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.rabbit',
    delegate: {
      type: 'faker',
      target: 'animal.rabbit',
    },
    help: {
      summary: 'Returns a random rabbit species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'Californian',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.rodent',
    delegate: {
      type: 'faker',
      target: 'animal.rodent',
    },
    help: {
      summary: 'Returns a random rodent breed.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: "Natterer's tuco-tuco",
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.snake',
    delegate: {
      type: 'faker',
      target: 'animal.snake',
    },
    help: {
      summary: 'Returns a random snake species.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'White-lipped python',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'animal.type',
    delegate: {
      type: 'faker',
      target: 'animal.type',
    },
    help: {
      summary: 'Returns a random animal type.',
      docsUrl: 'https://fakerjs.dev/api/animal',
      example: 'bear',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.author',
    delegate: {
      type: 'faker',
      target: 'book.author',
    },
    help: {
      summary: 'Returns a random author name.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Jacqueline Crooks',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.format',
    delegate: {
      type: 'faker',
      target: 'book.format',
    },
    help: {
      summary: 'Returns a random book format.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Paperback',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.genre',
    delegate: {
      type: 'faker',
      target: 'book.genre',
    },
    help: {
      summary: 'Returns a random genre.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Science Fiction',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.publisher',
    delegate: {
      type: 'faker',
      target: 'book.publisher',
    },
    help: {
      summary: 'Returns a random publisher.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Butterworth-Heinemann',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.series',
    delegate: {
      type: 'faker',
      target: 'book.series',
    },
    help: {
      summary: 'Returns a random series.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'The Inheritance Cycle',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'book.title',
    delegate: {
      type: 'faker',
      target: 'book.title',
    },
    help: {
      summary: 'Returns a random title.',
      docsUrl: 'https://fakerjs.dev/api/book',
      example: 'Animal Farm',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'color.cmyk',
    delegate: {
      type: 'faker',
      target: 'color.cmyk',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a CMYK color.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.95,0.17,0.23,1]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'Format of generated CMYK color.',
        },
      ],
    },
  },
  {
    keyword: 'color.colorByCSSColorSpace',
    delegate: {
      type: 'faker',
      target: 'color.colorByCSSColorSpace',
    },
    help: {
      summary: 'Returns a random color based on CSS color space specified.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.5811,0.0479,0.1091]',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'color.cssSupportedFunction',
    delegate: {
      type: 'faker',
      target: 'color.cssSupportedFunction',
    },
    help: {
      summary: 'Returns a random css supported color function name.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'hsla',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'color.cssSupportedSpace',
    delegate: {
      type: 'faker',
      target: 'color.cssSupportedSpace',
    },
    help: {
      summary: 'Returns a random css supported color space name.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'sRGB',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'color.hsl',
    delegate: {
      type: 'faker',
      target: 'color.hsl',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an HSL color.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[212,0.78,0.54]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'Format of generated HSL color.',
        },
        {
          name: 'includeAlpha',
          type: 'boolean',
          required: false,
          description: 'Adds an alpha value to the color (RGBA).',
        },
      ],
    },
  },
  {
    keyword: 'color.human',
    delegate: {
      type: 'faker',
      target: 'color.human',
    },
    help: {
      summary: 'Returns a random human-readable color name.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'green',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'color.hwb',
    delegate: {
      type: 'faker',
      target: 'color.hwb',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an HWB color.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[328,0.27,0.33]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'Format of generated RGB color.',
        },
      ],
    },
  },
  {
    keyword: 'color.lab',
    delegate: {
      type: 'faker',
      target: 'color.lab',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a LAB (CIELAB) color.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.071396,-55.6612,-66.7185]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'Format of generated RGB color.',
        },
      ],
    },
  },
  {
    keyword: 'color.lch',
    delegate: {
      type: 'faker',
      target: 'color.lch',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an LCH color. Even though upper bound of',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '[0.469557,212.9,204.9]',
      returnType: 'string',
      args: [
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'Format of generated RGB color.',
        },
      ],
    },
  },
  {
    keyword: 'color.rgb',
    delegate: {
      type: 'faker',
      target: 'color.rgb',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an RGB color.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: '#ee8222',
      returnType: 'string',
      args: [
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: "Letter type case of the generated hex color. Only applied when 'hex' format is used.",
        },
        {
          name: 'format',
          type: 'string',
          required: false,
          description: 'Format of generated RGB color.',
        },
        {
          name: 'includeAlpha',
          type: 'boolean',
          required: false,
          description: 'Adds an alpha value to the color (RGBA).',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: "Prefix of the generated hex color. Only applied when 'hex' format is used.",
        },
      ],
    },
  },
  {
    keyword: 'color.space',
    delegate: {
      type: 'faker',
      target: 'color.space',
    },
    help: {
      summary: 'Returns a random color space name from the worldwide accepted color spaces.',
      docsUrl: 'https://fakerjs.dev/api/color',
      example: 'HSL',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'commerce.department',
    delegate: {
      type: 'faker',
      target: 'commerce.department',
    },
    help: {
      summary: 'Returns a department inside a shop.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Tools',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'commerce.isbn',
    delegate: {
      type: 'faker',
      target: 'commerce.isbn',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random ISBN identifier.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: '978-1-996134-54-2',
      returnType: 'string',
      args: [
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'variant',
          type: 'string',
          required: false,
          description:
            'The variant of the identifier to return. Can be either 10 (10-digit format) or 13 (13-digit format).',
        },
      ],
    },
  },
  {
    keyword: 'commerce.price',
    delegate: {
      type: 'faker',
      target: 'commerce.price',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a price between min and max (inclusive).',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: '797.39',
      returnType: 'number',
      args: [
        {
          name: 'dec',
          type: 'number',
          required: false,
          description: 'The number of decimal places.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The maximum price.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The minimum price.',
        },
        {
          name: 'symbol',
          type: 'string',
          required: false,
          description: 'The currency value to use.',
        },
      ],
    },
  },
  {
    keyword: 'commerce.product',
    delegate: {
      type: 'faker',
      target: 'commerce.product',
    },
    help: {
      summary: 'Returns a short product name.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Bike',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'commerce.productAdjective',
    delegate: {
      type: 'faker',
      target: 'commerce.productAdjective',
    },
    help: {
      summary: 'Returns an adjective describing a product.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Luxurious',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'commerce.productDescription',
    delegate: {
      type: 'faker',
      target: 'commerce.productDescription',
    },
    help: {
      summary: 'Returns a product description.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'The green Hat combines Colombia aesthetics with Scandium-based durability',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'commerce.productMaterial',
    delegate: {
      type: 'faker',
      target: 'commerce.productMaterial',
    },
    help: {
      summary: 'Returns a material of a product.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Steel',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'commerce.productName',
    delegate: {
      type: 'faker',
      target: 'commerce.productName',
    },
    help: {
      summary: 'Generates a random descriptive product name.',
      docsUrl: 'https://fakerjs.dev/api/commerce',
      example: 'Soft Bronze Towels',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.buzzAdjective',
    delegate: {
      type: 'faker',
      target: 'company.buzzAdjective',
    },
    help: {
      summary: 'Returns a random buzz adjective that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'out-of-the-box',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.buzzNoun',
    delegate: {
      type: 'faker',
      target: 'company.buzzNoun',
    },
    help: {
      summary: 'Returns a random buzz noun that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'deliverables',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.buzzPhrase',
    delegate: {
      type: 'faker',
      target: 'company.buzzPhrase',
    },
    help: {
      summary: 'Generates a random buzz phrase that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'streamline cutting-edge platforms',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.buzzVerb',
    delegate: {
      type: 'faker',
      target: 'company.buzzVerb',
    },
    help: {
      summary: 'Returns a random buzz verb that can be used to demonstrate data being viewed by a manager.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'disintermediate',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhrase',
    delegate: {
      type: 'faker',
      target: 'company.catchPhrase',
    },
    help: {
      summary: 'Generates a random catch phrase that can be displayed to an end user.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'Diverse AI-powered flexibility',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseAdjective',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseAdjective',
    },
    help: {
      summary: 'Returns a random catch phrase adjective that can be displayed to an end user..',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'Distributed',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseDescriptor',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseDescriptor',
    },
    help: {
      summary: 'Returns a random catch phrase descriptor that can be displayed to an end user..',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'encompassing',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.catchPhraseNoun',
    delegate: {
      type: 'faker',
      target: 'company.catchPhraseNoun',
    },
    help: {
      summary: 'Returns a random catch phrase noun that can be displayed to an end user..',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'attitude',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'company.name',
    delegate: {
      type: 'faker',
      target: 'company.name',
    },
    help: {
      summary: 'Generates a random company name.',
      docsUrl: 'https://fakerjs.dev/api/company',
      example: 'Lang - Little',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'database.collation',
    delegate: {
      type: 'faker',
      target: 'database.collation',
    },
    help: {
      summary: 'Returns a random database collation.',
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'utf8_bin',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'database.column',
    delegate: {
      type: 'faker',
      target: 'database.column',
    },
    help: {
      summary: 'Returns a random database column name.',
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'status',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'database.engine',
    delegate: {
      type: 'faker',
      target: 'database.engine',
    },
    help: {
      summary: 'Returns a random database engine.',
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'ARCHIVE',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'database.mongodbObjectId',
    delegate: {
      type: 'faker',
      target: 'database.mongodbObjectId',
    },
    help: {
      summary: 'Returns a MongoDB ObjectId string.',
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'e80bba2ae67c0c7dcc16bd57',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'database.type',
    delegate: {
      type: 'faker',
      target: 'database.type',
    },
    help: {
      summary: 'Returns a random database column type.',
      docsUrl: 'https://fakerjs.dev/api/database',
      example: 'smallint',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'datatype.boolean',
    delegate: {
      type: 'faker',
      target: 'datatype.boolean',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns the boolean value true or false.',
      docsUrl: 'https://fakerjs.dev/api/datatype',
      example: 'true',
      returnType: 'boolean',
      args: [
        {
          name: 'probability',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'date.anytime',
    delegate: {
      type: 'faker',
      target: 'date.anytime',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date that can be either in the past or in the future.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2026-12-25T08:55:20.593Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The date to use as reference point for the newly generated date.',
        },
      ],
    },
  },
  {
    keyword: 'date.between',
    delegate: {
      type: 'faker',
      target: 'date.between',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date between the given boundaries.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '',
      returnType: 'date',
      args: [
        {
          name: 'from',
          type: 'number',
          required: false,
          description: 'The early date boundary.',
        },
        {
          name: 'to',
          type: 'number',
          required: false,
          description: 'The late date boundary.',
        },
      ],
    },
  },
  {
    keyword: 'date.betweens',
    delegate: {
      type: 'faker',
      target: 'date.betweens',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Generates random dates between the given boundaries. The dates will be returned in an array sorted in chronological order.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '',
      returnType: 'array',
      args: [
        {
          name: 'count',
          type: 'number',
          required: false,
          description: 'The number of dates to generate.',
        },
        {
          name: 'from',
          type: 'number',
          required: false,
          description: 'The early date boundary.',
        },
        {
          name: 'to',
          type: 'number',
          required: false,
          description: 'The late date boundary.',
        },
      ],
    },
  },
  {
    keyword: 'date.birthdate',
    delegate: {
      type: 'faker',
      target: 'date.birthdate',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Returns a random birthdate. By default, the birthdate is generated for an adult between 18 and 80 years old.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"1966-09-18T08:47:31.333Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The date to use as reference point for the newly generated date.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The maximum age/year to generate a birthdate for/in.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The minimum age/year to generate a birthdate for/in.',
        },
        {
          name: 'mode',
          type: 'string',
          required: false,
          description: "Either 'age' or 'year' to generate a birthdate based on the age or year range.",
        },
      ],
    },
  },
  {
    keyword: 'date.future',
    delegate: {
      type: 'faker',
      target: 'date.future',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the future.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2027-02-07T18:41:48.525Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The date to use as reference point for the newly generated date.',
        },
        {
          name: 'years',
          type: 'number',
          required: false,
          description: 'The range of years the date may be in the future.',
        },
      ],
    },
  },
  {
    keyword: 'date.month',
    delegate: {
      type: 'faker',
      target: 'date.month',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random name of a month.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: 'February',
      returnType: 'object',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description: 'Whether to return an abbreviation.',
        },
        {
          name: 'context',
          type: 'boolean',
          required: false,
          description:
            "Whether to return the name of a month in the context of a date. In the default en locale this has no effect, however, in other locales like fr or ru, this may affect grammar or capitalization, for example 'январь' with { context: false } and 'января' with { context: true } in ru.",
        },
      ],
    },
  },
  {
    keyword: 'date.past',
    delegate: {
      type: 'faker',
      target: 'date.past',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the past.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2025-07-01T11:48:55.347Z"',
      returnType: 'date',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The date to use as reference point for the newly generated date.',
        },
        {
          name: 'years',
          type: 'number',
          required: false,
          description: 'The range of years the date may be in the past.',
        },
      ],
    },
  },
  {
    keyword: 'date.recent',
    delegate: {
      type: 'faker',
      target: 'date.recent',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the recent past.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2026-04-27T23:46:16.707Z"',
      returnType: 'date',
      args: [
        {
          name: 'days',
          type: 'number',
          required: false,
          description: 'The range of days the date may be in the past.',
        },
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The date to use as reference point for the newly generated date.',
        },
      ],
    },
  },
  {
    keyword: 'date.soon',
    delegate: {
      type: 'faker',
      target: 'date.soon',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random date in the near future.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: '"2026-04-29T11:09:09.211Z"',
      returnType: 'date',
      args: [
        {
          name: 'days',
          type: 'number',
          required: false,
          description: 'The range of days the date may be in the future.',
        },
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The date to use as reference point for the newly generated date.',
        },
      ],
    },
  },
  {
    keyword: 'date.timeZone',
    delegate: {
      type: 'faker',
      target: 'date.timeZone',
    },
    help: {
      summary: 'Returns a random IANA time zone relevant to this locale.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: 'Europe/Stockholm',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'date.weekday',
    delegate: {
      type: 'faker',
      target: 'date.weekday',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random day of the week.',
      docsUrl: 'https://fakerjs.dev/api/date',
      example: 'Tuesday',
      returnType: 'object',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description: 'Whether to return an abbreviation.',
        },
        {
          name: 'context',
          type: 'boolean',
          required: false,
          description:
            "Whether to return the day of the week in the context of a date. In the default en locale this has no effect, however, in other locales like fr or ru, this may affect grammar or capitalization, for example 'Lundi' with { context: false } and 'lundi' with { context: true } in fr.",
        },
      ],
    },
  },
  {
    keyword: 'finance.accountName',
    delegate: {
      type: 'faker',
      target: 'finance.accountName',
    },
    help: {
      summary: 'Generates a random account name.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'Investment Account',
      returnType: 'integer',
      args: [],
    },
  },
  {
    keyword: 'finance.accountNumber',
    delegate: {
      type: 'faker',
      target: 'finance.accountNumber',
    },
    help: {
      summary: 'Generates a random account number.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '43208795',
      returnType: 'integer',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'finance.amount',
    delegate: {
      type: 'faker',
      target: 'finance.amount',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random amount between the given bounds (inclusive).',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '536.86',
      returnType: 'number',
      args: [
        {
          name: 'autoFormat',
          type: 'boolean',
          required: false,
          description: 'If true this method will use Number.toLocaleString(). Otherwise it will use Number.toFixed().',
        },
        {
          name: 'dec',
          type: 'number',
          required: false,
          description: 'The number of decimal places for the amount.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The upper bound for the amount.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The lower bound for the amount.',
        },
        {
          name: 'symbol',
          type: 'string',
          required: false,
          description: 'The symbol used to prefix the amount.',
        },
      ],
    },
  },
  {
    keyword: 'finance.bic',
    delegate: {
      type: 'faker',
      target: 'finance.bic',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random SWIFT/BIC code based on the ISO-9362 format.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'TXWRPYFT',
      returnType: 'string',
      args: [
        {
          name: 'includeBranchCode',
          type: 'boolean',
          required: false,
          description: 'Whether to include a three-digit branch code at the end of the generated code.',
        },
      ],
    },
  },
  {
    keyword: 'finance.bitcoinAddress',
    delegate: {
      type: 'faker',
      target: 'finance.bitcoinAddress',
    },
    help: {
      summary: 'Generates a random Bitcoin address.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '39fu5Nhnibj2xa8FPVxCbX7y4xZi5SWd',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.creditCardCVV',
    delegate: {
      type: 'faker',
      target: 'finance.creditCardCVV',
    },
    help: {
      summary: 'Generates a random credit card CVV.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '839',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.creditCardIssuer',
    delegate: {
      type: 'faker',
      target: 'finance.creditCardIssuer',
    },
    help: {
      summary: 'Returns a random credit card issuer.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'jcb',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.creditCardNumber',
    delegate: {
      type: 'faker',
      target: 'finance.creditCardNumber',
    },
    help: {
      summary: 'Generates a random credit card number.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '6449-4462-4996-7580',
      returnType: 'string',
      args: [
        {
          name: 'issuer',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'finance.currency',
    delegate: {
      type: 'faker',
      target: 'finance.currency',
    },
    help: {
      summary: 'Returns a random currency object, containing `code`, `name`, `symbol`, and `numericCode` properties.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '{"name":"Rial Omani","code":"OMR","symbol":"﷼","numericCode":"512"}',
      returnType: 'object',
      args: [],
    },
  },
  {
    keyword: 'finance.currencyCode',
    delegate: {
      type: 'faker',
      target: 'finance.currencyCode',
    },
    help: {
      summary: 'Returns a random currency code.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'ISK',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.currencyName',
    delegate: {
      type: 'faker',
      target: 'finance.currencyName',
    },
    help: {
      summary: 'Returns a random currency name.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'South Sudanese pound',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.currencyNumericCode',
    delegate: {
      type: 'faker',
      target: 'finance.currencyNumericCode',
    },
    help: {
      summary: 'Returns a random currency numeric code.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '270',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.currencySymbol',
    delegate: {
      type: 'faker',
      target: 'finance.currencySymbol',
    },
    help: {
      summary: 'Returns a random currency symbol.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '₩',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.ethereumAddress',
    delegate: {
      type: 'faker',
      target: 'finance.ethereumAddress',
    },
    help: {
      summary: 'Creates a random, non-checksum Ethereum address.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '0xf5d385aff27de9dee6eeeffd924ffd7dd2d252ca',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.iban',
    delegate: {
      type: 'faker',
      target: 'finance.iban',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random IBAN.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'CH67001759079BP5WA811',
      returnType: 'string',
      args: [
        {
          name: 'countryCode',
          type: 'string',
          required: false,
          description:
            'The country code from which you want to generate an IBAN, if none is provided a random country will be used.',
        },
        {
          name: 'formatted',
          type: 'boolean',
          required: false,
          description: 'Return a formatted version of the generated IBAN.',
        },
      ],
    },
  },
  {
    keyword: 'finance.litecoinAddress',
    delegate: {
      type: 'faker',
      target: 'finance.litecoinAddress',
    },
    help: {
      summary: 'Generates a random Litecoin address.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'M7nWopfUfSjA8cmGWvuENRLu6GU4C1iTK',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.maskedNumber',
    delegate: {
      type: 'faker',
      target: 'finance.maskedNumber',
    },
    help: {
      summary: 'Generates a random masked number.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '(...0934)',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'finance.pin',
    delegate: {
      type: 'faker',
      target: 'finance.pin',
    },
    help: {
      summary: 'Generates a random PIN number.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '1107',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'finance.routingNumber',
    delegate: {
      type: 'faker',
      target: 'finance.routingNumber',
    },
    help: {
      summary: 'Generates a random routing number.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: '933657999',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.transactionDescription',
    delegate: {
      type: 'faker',
      target: 'finance.transactionDescription',
    },
    help: {
      summary: 'Generates a random transaction description.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example:
        'Transaction alert: deposit at Jones LLC using card ending ****4221 for an amount of GIP 94.88 on account ***3694.',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'finance.transactionType',
    delegate: {
      type: 'faker',
      target: 'finance.transactionType',
    },
    help: {
      summary: 'Returns a random transaction type.',
      docsUrl: 'https://fakerjs.dev/api/finance',
      example: 'deposit',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.adjective',
    delegate: {
      type: 'faker',
      target: 'food.adjective',
    },
    help: {
      summary: 'Generates a random dish adjective.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'salty',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.description',
    delegate: {
      type: 'faker',
      target: 'food.description',
    },
    help: {
      summary: 'Generates a random dish description.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'Fresh mixed greens tossed with pimento-rubbed pigeon, bean shoots, and a light dressing.',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.dish',
    delegate: {
      type: 'faker',
      target: 'food.dish',
    },
    help: {
      summary: 'Generates a random dish name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'Chicken Fajitas',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.ethnicCategory',
    delegate: {
      type: 'faker',
      target: 'food.ethnicCategory',
    },
    help: {
      summary: "Generates a random food's ethnic category.",
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'Lithuanian',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.fruit',
    delegate: {
      type: 'faker',
      target: 'food.fruit',
    },
    help: {
      summary: 'Generates a random fruit name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'snowpea',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.ingredient',
    delegate: {
      type: 'faker',
      target: 'food.ingredient',
    },
    help: {
      summary: 'Generates a random ingredient name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'spelt',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.meat',
    delegate: {
      type: 'faker',
      target: 'food.meat',
    },
    help: {
      summary: 'Generates a random meat',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'goose',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.spice',
    delegate: {
      type: 'faker',
      target: 'food.spice',
    },
    help: {
      summary: 'Generates a random spice name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'poudre de colombo',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'food.vegetable',
    delegate: {
      type: 'faker',
      target: 'food.vegetable',
    },
    help: {
      summary: 'Generates a random vegetable name.',
      docsUrl: 'https://fakerjs.dev/api/food',
      example: 'snowpea sprouts',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'git.branch',
    delegate: {
      type: 'faker',
      target: 'git.branch',
    },
    help: {
      summary: 'Generates a random branch name.',
      docsUrl: 'https://fakerjs.dev/api/git',
      example: 'array-compress',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'git.commitDate',
    delegate: {
      type: 'faker',
      target: 'git.commitDate',
    },
    help: {
      summary: 'Generates a date string for a git commit using the same format as `git log`.',
      docsUrl: 'https://fakerjs.dev/api/git',
      example: 'Tue Apr 28 04:28:58 2026 -0600',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'git.commitEntry',
    delegate: {
      type: 'faker',
      target: 'git.commitEntry',
    },
    help: {
      summary: 'Generates a random commit entry as printed by `git log`.',
      docsUrl: 'https://fakerjs.dev/api/git',
      example: '',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'git.commitMessage',
    delegate: {
      type: 'faker',
      target: 'git.commitMessage',
    },
    help: {
      summary: 'Generates a random commit message.',
      docsUrl: 'https://fakerjs.dev/api/git',
      example: 'reboot cross-platform system',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'git.commitSha',
    delegate: {
      type: 'faker',
      target: 'git.commitSha',
    },
    help: {
      summary: 'Generates a random commit sha.',
      docsUrl: 'https://fakerjs.dev/api/git',
      example: '3418f0e64e8eae52ebd67b11d98e571fd6a81017',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.abbreviation',
    delegate: {
      type: 'faker',
      target: 'hacker.abbreviation',
    },
    help: {
      summary: 'Returns a random hacker/IT abbreviation.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'GB',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.adjective',
    delegate: {
      type: 'faker',
      target: 'hacker.adjective',
    },
    help: {
      summary: 'Returns a random hacker/IT adjective.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'bluetooth',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.ingverb',
    delegate: {
      type: 'faker',
      target: 'hacker.ingverb',
    },
    help: {
      summary: 'Returns a random hacker/IT verb for continuous actions (en: ing suffix; e.g. hacking).',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'synthesizing',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.noun',
    delegate: {
      type: 'faker',
      target: 'hacker.noun',
    },
    help: {
      summary: 'Returns a random hacker/IT noun.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'program',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.phrase',
    delegate: {
      type: 'faker',
      target: 'hacker.phrase',
    },
    help: {
      summary: 'Generates a random hacker/IT phrase.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: "compressing the application won't do anything, we need to reboot the neural JSON hard drive!",
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'hacker.verb',
    delegate: {
      type: 'faker',
      target: 'hacker.verb',
    },
    help: {
      summary: 'Returns a random hacker/IT verb.',
      docsUrl: 'https://fakerjs.dev/api/hacker',
      example: 'program',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'helpers.arrayElement',
    delegate: {
      type: 'faker',
      target: 'helpers.arrayElement',
    },
    help: {
      summary: 'Generates data using faker helpers array element.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'any',
      args: [],
    },
  },
  {
    keyword: 'helpers.arrayElements',
    delegate: {
      type: 'faker',
      target: 'helpers.arrayElements',
    },
    help: {
      summary: 'Generates data using faker helpers array elements.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'array',
      args: [],
    },
  },
  {
    keyword: 'helpers.enumValue',
    delegate: {
      type: 'faker',
      target: 'helpers.enumValue',
    },
    help: {
      summary: 'Generate a value using faker helpers.enumValue.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'any',
      args: [],
    },
  },
  {
    keyword: 'helpers.fake',
    delegate: {
      type: 'faker',
      target: 'helpers.fake',
    },
    help: {
      summary: 'Generator for combining faker methods based on a static string input.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'pattern',
          type: 'string',
          required: true,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.fromRegExp',
    delegate: {
      type: 'faker',
      target: 'helpers.fromRegExp',
    },
    help: {
      summary: 'Generates a string matching the given regex like expressions.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'pattern',
          type: 'string',
          required: true,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.maybe',
    delegate: {
      type: 'faker',
      target: 'helpers.maybe',
    },
    help: {
      summary: 'Generates data using faker helpers maybe.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'any',
      args: [
        {
          name: 'callback',
          type: 'string',
          required: false,
          description: 'The callback to that will be invoked if the probability check was successful.',
        },
        {
          name: 'probability',
          type: 'number',
          required: false,
          description: 'The probability ([0.00, 1.00]) of the callback being invoked.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.multiple',
    delegate: {
      type: 'faker',
      target: 'helpers.multiple',
    },
    help: {
      summary: 'Generates data using faker helpers multiple.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '[null,null,null]',
      returnType: 'array',
      args: [
        {
          name: 'method',
          type: 'number',
          required: false,
          description:
            'The method used to generate the values. The method will be called with (_, index), to allow using the index in the generated value e.g. as id.',
        },
        {
          name: 'count',
          type: 'number',
          required: false,
          description: 'The number or range of elements to generate.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.mustache',
    delegate: {
      type: 'faker',
      target: 'helpers.mustache',
    },
    help: {
      summary: 'Replaces the `{{placeholder}}` patterns in the given string mustache style.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'text',
          type: 'string',
          required: true,
          description: 'No description provided.',
        },
        {
          name: 'data',
          type: 'array',
          required: false,
          description:
            'The data used to populate the placeholders. This is a record where the key is the template placeholder, whereas the value is either a string or a function suitable for String.replace().',
        },
      ],
    },
  },
  {
    keyword: 'helpers.objectEntry',
    delegate: {
      type: 'faker',
      target: 'helpers.objectEntry',
    },
    help: {
      summary: 'Generate a value using faker helpers.objectEntry.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'array',
      args: [],
    },
  },
  {
    keyword: 'helpers.objectKey',
    delegate: {
      type: 'faker',
      target: 'helpers.objectKey',
    },
    help: {
      summary: 'Generate a value using faker helpers.objectKey.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'helpers.objectValue',
    delegate: {
      type: 'faker',
      target: 'helpers.objectValue',
    },
    help: {
      summary: 'Generate a value using faker helpers.objectValue.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'any',
      args: [],
    },
  },
  {
    keyword: 'helpers.rangeToNumber',
    delegate: {
      type: 'faker',
      target: 'helpers.rangeToNumber',
    },
    help: {
      summary: 'Helper method that converts the given number or range to a number.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '7358047432101701',
      returnType: 'number',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'numberOrRange',
          type: 'number',
          required: true,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.replaceCreditCardSymbols',
    delegate: {
      type: 'faker',
      target: 'helpers.replaceCreditCardSymbols',
    },
    help: {
      summary: 'Replaces the symbols and patterns in a credit card schema including Luhn checksum.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '6453-8322-1436-2543-2787',
      returnType: 'string',
      args: [
        {
          name: 'string',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'symbol',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.replaceSymbols',
    delegate: {
      type: 'faker',
      target: 'helpers.replaceSymbols',
    },
    help: {
      summary: 'Parses the given string symbol by symbols and replaces the placeholder appropriately.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'string',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.shuffle',
    delegate: {
      type: 'faker',
      target: 'helpers.shuffle',
    },
    help: {
      summary: 'Generates data using faker helpers shuffle.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'array',
      args: [
        {
          name: 'list',
          type: 'array',
          required: false,
          description: 'The array to shuffle.',
        },
        {
          name: 'inplace',
          type: 'boolean',
          required: false,
          description: 'Whether to shuffle the array in place or return a new array.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.slugify',
    delegate: {
      type: 'faker',
      target: 'helpers.slugify',
    },
    help: {
      summary: 'Slugifies the given string.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'string',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'helpers.uniqueArray',
    delegate: {
      type: 'faker',
      target: 'helpers.uniqueArray',
    },
    help: {
      summary: 'Generates data using faker helpers unique array.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '[]',
      returnType: 'array',
      args: [],
    },
  },
  {
    keyword: 'helpers.weightedArrayElement',
    delegate: {
      type: 'faker',
      target: 'helpers.weightedArrayElement',
    },
    help: {
      summary: 'Generates data using faker helpers weighted array element.',
      docsUrl: 'https://fakerjs.dev/api/helpers',
      example: '',
      returnType: 'any',
      args: [],
    },
  },
  {
    keyword: 'image.avatar',
    delegate: {
      type: 'faker',
      target: 'image.avatar',
    },
    help: {
      summary: 'Generates a random avatar image url.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://avatars.githubusercontent.com/u/2389220',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.avatarGitHub',
    delegate: {
      type: 'faker',
      target: 'image.avatarGitHub',
    },
    help: {
      summary: 'Generates a random avatar from GitHub.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://avatars.githubusercontent.com/u/22969292',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.avatarLegacy',
    delegate: {
      type: 'faker',
      target: 'image.avatarLegacy',
    },
    help: {
      summary:
        'Generates a random avatar from `https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar`.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1198.jpg',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.dataUri',
    delegate: {
      type: 'faker',
      target: 'image.dataUri',
    },
    help: {
      summary: 'Generates a random data uri containing an URL-encoded SVG image or a Base64-encoded SVG image.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: '',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.personPortrait',
    delegate: {
      type: 'faker',
      target: 'image.personPortrait',
    },
    help: {
      summary: 'Generates a random square portrait (avatar) of a person.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/99.jpg',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.url',
    delegate: {
      type: 'faker',
      target: 'image.url',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random image url.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://loremflickr.com/3255/509?lock=5223276893828872',
      returnType: 'string',
      args: [
        {
          name: 'height',
          type: 'number',
          required: false,
          description: 'The height of the image.',
        },
        {
          name: 'width',
          type: 'number',
          required: false,
          description: 'The width of the image.',
        },
      ],
    },
  },
  {
    keyword: 'image.urlLoremFlickr',
    delegate: {
      type: 'faker',
      target: 'image.urlLoremFlickr',
    },
    help: {
      summary: 'Generates a random image url provided via https://loremflickr.com.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://loremflickr.com/3966/3602?lock=6417693540486546',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.urlPicsumPhotos',
    delegate: {
      type: 'faker',
      target: 'image.urlPicsumPhotos',
    },
    help: {
      summary: 'Generates a random image url provided via https://picsum.photos.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://picsum.photos/seed/UBLQun43/2068/162?blur=8',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'image.urlPlaceholder',
    delegate: {
      type: 'faker',
      target: 'image.urlPlaceholder',
    },
    help: {
      summary: 'Generates a random image url provided via https://via.placeholder.com/.',
      docsUrl: 'https://fakerjs.dev/api/image',
      example: 'https://via.placeholder.com/2302x1759/a80adf/2de69f.gif?text=utrimque%20summa%20dolores',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.color',
    delegate: {
      type: 'faker',
      target: 'internet.color',
    },
    help: {
      summary: 'Generates a random css hex color code in aesthetically pleasing color palette.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '#290551',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.displayName',
    delegate: {
      type: 'faker',
      target: 'internet.displayName',
    },
    help: {
      summary: "Generates a display name using the given person's name as base.",
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Cordell0',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.domainName',
    delegate: {
      type: 'faker',
      target: 'internet.domainName',
    },
    help: {
      summary: 'Generates a random domain name.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'beloved-peony.org',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.domainSuffix',
    delegate: {
      type: 'faker',
      target: 'internet.domainSuffix',
    },
    help: {
      summary: 'Returns a random domain suffix.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'com',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.domainWord',
    delegate: {
      type: 'faker',
      target: 'internet.domainWord',
    },
    help: {
      summary: 'Generates a random domain word.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'inexperienced-ravioli',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.email',
    delegate: {
      type: 'faker',
      target: 'internet.email',
    },
    help: {
      summary: 'Generates data using faker internet email.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Jana91@hotmail.com',
      returnType: 'string',
      args: [
        {
          name: 'allowSpecialCharacters',
          type: 'boolean',
          required: false,
          description:
            "Whether special characters such as .!#$%&'*+-/=?^_`{|}~ should be included in the email address.",
        },
        {
          name: 'firstName',
          type: 'string',
          required: false,
          description: 'The optional first name to use.',
        },
        {
          name: 'lastName',
          type: 'string',
          required: false,
          description: 'The optional last name to use.',
        },
        {
          name: 'provider',
          type: 'string',
          required: false,
          description: 'The mail provider domain to use. If not specified, a random free mail provider will be chosen.',
        },
      ],
    },
  },
  {
    keyword: 'internet.emoji',
    delegate: {
      type: 'faker',
      target: 'internet.emoji',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random emoji.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '🤨',
      returnType: 'string',
      args: [
        {
          name: 'types',
          type: 'array',
          required: false,
          description: 'A list of the emoji types that should be used.',
        },
      ],
    },
  },
  {
    keyword: 'internet.exampleEmail',
    delegate: {
      type: 'faker',
      target: 'internet.exampleEmail',
    },
    help: {
      summary: 'Generates data using faker internet example email.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Jeremie37@example.net',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.httpMethod',
    delegate: {
      type: 'faker',
      target: 'internet.httpMethod',
    },
    help: {
      summary: 'Returns a random http method.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'PATCH',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.httpStatusCode',
    delegate: {
      type: 'faker',
      target: 'internet.httpStatusCode',
    },
    help: {
      summary: 'Generates a random HTTP status code.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '303',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.ip',
    delegate: {
      type: 'faker',
      target: 'internet.ip',
    },
    help: {
      summary: 'Generates a random IPv4 or IPv6 address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '56.23.30.52',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.ipv4',
    delegate: {
      type: 'faker',
      target: 'internet.ipv4',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random IPv4 address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'cidrBlock',
          type: 'string',
          required: false,
          description: 'The optional CIDR block to use. Must be in the format x.x.x.x/y.',
        },
        {
          name: 'network',
          type: 'string',
          required: false,
          description: 'The optional network to use. This is intended as an alias for well-known cidrBlocks.',
        },
      ],
    },
  },
  {
    keyword: 'internet.ipv6',
    delegate: {
      type: 'faker',
      target: 'internet.ipv6',
    },
    help: {
      summary: 'Generates a random IPv6 address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.jwt',
    delegate: {
      type: 'faker',
      target: 'internet.jwt',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random JWT (JSON Web Token).',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'header',
          type: 'array',
          required: false,
          description: 'The header to use for the token. If present, it will replace any default values.',
        },
        {
          name: 'payload',
          type: 'array',
          required: false,
          description: 'The payload to use for the token. If present, it will replace any default values.',
        },
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The date to use as reference point for the newly generated date.',
        },
      ],
    },
  },
  {
    keyword: 'internet.jwtAlgorithm',
    delegate: {
      type: 'faker',
      target: 'internet.jwtAlgorithm',
    },
    help: {
      summary: 'Generates a random JWT (JSON Web Token) Algorithm.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'PS384',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.mac',
    delegate: {
      type: 'faker',
      target: 'internet.mac',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random mac address.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'ae:a9:d7:ba:d2:bd',
      returnType: 'string',
      args: [
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: "The optional separator to use. Can be either ':', '-' or ''.",
        },
      ],
    },
  },
  {
    keyword: 'internet.password',
    delegate: {
      type: 'faker',
      target: 'internet.password',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Generates a random password-like string. Do not use this method for generating actual passwords for users.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'og1ejoksrfwVbIF',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'The length of the password to generate.',
        },
        {
          name: 'memorable',
          type: 'boolean',
          required: false,
          description: 'Whether the generated password should be memorable.',
        },
        {
          name: 'pattern',
          type: 'string',
          required: false,
          description: 'The pattern that all chars should match. This option will be ignored, if memorable is true.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'The prefix to use.',
        },
      ],
    },
  },
  {
    keyword: 'internet.port',
    delegate: {
      type: 'faker',
      target: 'internet.port',
    },
    help: {
      summary: 'Generates a random port number.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '24545',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.protocol',
    delegate: {
      type: 'faker',
      target: 'internet.protocol',
    },
    help: {
      summary: 'Returns a random web protocol. Either `http` or `https`.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'http',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.url',
    delegate: {
      type: 'faker',
      target: 'internet.url',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random http(s) url.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'https://brave-interior.biz/',
      returnType: 'string',
      args: [
        {
          name: 'appendSlash',
          type: 'boolean',
          required: false,
          description: 'Whether to append a slash to the end of the url (path).',
        },
        {
          name: 'protocol',
          type: 'string',
          required: false,
          description: 'The protocol to use.',
        },
      ],
    },
  },
  {
    keyword: 'internet.userAgent',
    delegate: {
      type: 'faker',
      target: 'internet.userAgent',
    },
    help: {
      summary: 'Generates a random user agent string.',
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: '',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'internet.username',
    delegate: {
      type: 'faker',
      target: 'internet.username',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: "Generates a username using the given person's name as base.",
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Deanna51',
      returnType: 'string',
      args: [
        {
          name: 'firstName',
          type: 'string',
          required: false,
          description: 'The optional first name to use.',
        },
        {
          name: 'lastName',
          type: 'string',
          required: false,
          description: 'The optional last name to use.',
        },
      ],
    },
  },
  {
    keyword: 'internet.userName',
    delegate: {
      type: 'faker',
      target: 'internet.userName',
    },
    help: {
      summary: "Generates a username using the given person's name as base.",
      docsUrl: 'https://fakerjs.dev/api/internet',
      example: 'Ana_Keebler',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'literal.value',
    delegate: {
      type: 'custom',
      target: 'literal.value',
    },
    help: {
      summary: 'Return the literal value provided by the caller.',
      docsUrl: 'https://anywaydata.com/docs/category/generating-data',
      example: 'Pending',
      returnType: 'string',
      args: [
        {
          name: 'value',
          type: 'string|number|boolean|null',
          required: true,
          description: 'Literal value to return.',
        },
      ],
    },
  },
  {
    keyword: 'location.buildingNumber',
    delegate: {
      type: 'faker',
      target: 'location.buildingNumber',
    },
    help: {
      summary: 'Generates a random building number.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '5075',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.cardinalDirection',
    delegate: {
      type: 'faker',
      target: 'location.cardinalDirection',
    },
    help: {
      summary: 'Returns a random cardinal direction (north, east, south, west).',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'East',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.city',
    delegate: {
      type: 'faker',
      target: 'location.city',
    },
    help: {
      summary: 'Generates a random localized city name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Stellachester',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.continent',
    delegate: {
      type: 'faker',
      target: 'location.continent',
    },
    help: {
      summary: 'Returns a random continent name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Asia',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.country',
    delegate: {
      type: 'faker',
      target: 'location.country',
    },
    help: {
      summary: 'Returns a random country name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Svalbard & Jan Mayen Islands',
      returnType: 'integer',
      args: [],
    },
  },
  {
    keyword: 'location.countryCode',
    delegate: {
      type: 'faker',
      target: 'location.countryCode',
    },
    help: {
      summary: 'Returns a random ISO_3166-1 country code.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'MG',
      returnType: 'integer',
      args: [],
    },
  },
  {
    keyword: 'location.county',
    delegate: {
      type: 'faker',
      target: 'location.county',
    },
    help: {
      summary:
        "Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.",
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Northamptonshire',
      returnType: 'integer',
      args: [],
    },
  },
  {
    keyword: 'location.direction',
    delegate: {
      type: 'faker',
      target: 'location.direction',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random direction (cardinal and ordinal; northwest, east, etc).',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'North',
      returnType: 'string',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description:
            'If true this will return abbreviated directions (NW, E, etc). Otherwise this will return the long name.',
        },
      ],
    },
  },
  {
    keyword: 'location.language',
    delegate: {
      type: 'faker',
      target: 'location.language',
    },
    help: {
      summary: 'Returns a random spoken language.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '{"name":"Icelandic","alpha2":"is","alpha3":"isl"}',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.latitude',
    delegate: {
      type: 'faker',
      target: 'location.latitude',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random latitude.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '51.5448',
      returnType: 'number',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The lower bound for the latitude to generate.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The upper bound for the latitude to generate.',
        },
        {
          name: 'precision',
          type: 'number',
          required: false,
          description: 'The number of decimal points of precision for the latitude.',
        },
      ],
    },
  },
  {
    keyword: 'location.longitude',
    delegate: {
      type: 'faker',
      target: 'location.longitude',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random longitude.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '92.3892',
      returnType: 'number',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'The lower bound for the longitude to generate.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'The upper bound for the longitude to generate.',
        },
        {
          name: 'precision',
          type: 'number',
          required: false,
          description: 'The number of decimal points of precision for the longitude.',
        },
      ],
    },
  },
  {
    keyword: 'location.nearbyGPSCoordinate',
    delegate: {
      type: 'faker',
      target: 'location.nearbyGPSCoordinate',
    },
    help: {
      summary: 'Generates a random GPS coordinate within the specified radius from the given coordinate.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '[58.313,9.9746]',
      returnType: 'array',
      args: [],
    },
  },
  {
    keyword: 'location.ordinalDirection',
    delegate: {
      type: 'faker',
      target: 'location.ordinalDirection',
    },
    help: {
      summary: 'Returns a random ordinal direction (northwest, southeast, etc).',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Northeast',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.secondaryAddress',
    delegate: {
      type: 'faker',
      target: 'location.secondaryAddress',
    },
    help: {
      summary: 'Generates a random localized secondary address. This refers to a specific location at a given address',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Suite 634',
      returnType: 'integer',
      args: [],
    },
  },
  {
    keyword: 'location.state',
    delegate: {
      type: 'faker',
      target: 'location.state',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        "Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.",
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Hawaii',
      returnType: 'string',
      args: [
        {
          name: 'abbreviated',
          type: 'boolean',
          required: false,
          description:
            'If true this will return abbreviated first-level administrative entity names. Otherwise this will return the long name.',
        },
      ],
    },
  },
  {
    keyword: 'location.street',
    delegate: {
      type: 'faker',
      target: 'location.street',
    },
    help: {
      summary: 'Generates a random localized street name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Viva Harbor',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.streetAddress',
    delegate: {
      type: 'faker',
      target: 'location.streetAddress',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random localized street address.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '12056 Vandervort Common',
      returnType: 'string',
      args: [
        {
          name: 'useFullAddress',
          type: 'boolean',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'boolean',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'location.timeZone',
    delegate: {
      type: 'faker',
      target: 'location.timeZone',
    },
    help: {
      summary: 'Returns a random IANA time zone name.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: 'Australia/Perth',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'location.zipCode',
    delegate: {
      type: 'faker',
      target: 'location.zipCode',
    },
    help: {
      summary: 'Generates data using faker location zip code.',
      docsUrl: 'https://fakerjs.dev/api/location',
      example: '36791',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'lorem.lines',
    delegate: {
      type: 'faker',
      target: 'lorem.lines',
    },
    help: {
      summary: "Generates the given number lines of lorem separated by `'\\n'`.",
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Illum qui ocer creptio. Antepono aro vergo voluptatem acervus compono apud.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'lineCount',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'lineCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of lines to generate.',
        },
        {
          name: 'lineCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of lines to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.paragraph',
    delegate: {
      type: 'faker',
      target: 'lorem.paragraph',
    },
    help: {
      summary: 'Generates a paragraph with the given number of sentences.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'sentenceCount',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'sentenceCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of sentences to generate.',
        },
        {
          name: 'sentenceCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of sentences to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.paragraphs',
    delegate: {
      type: 'faker',
      target: 'lorem.paragraphs',
    },
    help: {
      summary: 'Generates the given number of paragraphs.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'paragraphCount',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'paragraphCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of paragraphs to generate.',
        },
        {
          name: 'paragraphCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of paragraphs to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.sentence',
    delegate: {
      type: 'faker',
      target: 'lorem.sentence',
    },
    help: {
      summary: 'Generates a space separated list of words beginning with a capital letter and ending with a period.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Auctor cum deorsum attero cum tergo aut.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'wordCount',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'wordCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of words to generate.',
        },
        {
          name: 'wordCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of words to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.sentences',
    delegate: {
      type: 'faker',
      target: 'lorem.sentences',
    },
    help: {
      summary: 'Generates the given number of sentences.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'Vicissitudo amet candidus. Urbanus magni carbo artificiose tenus at ambulo.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'sentenceCount',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'separator',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'sentenceCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of sentences to generate.',
        },
        {
          name: 'sentenceCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of sentences to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.slug',
    delegate: {
      type: 'faker',
      target: 'lorem.slug',
    },
    help: {
      summary: 'Generates a slugified text consisting of the given number of hyphen separated words.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'dolore-accusator-atqui',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'wordCount',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'wordCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of words to generate.',
        },
        {
          name: 'wordCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of words to generate.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.text',
    delegate: {
      type: 'faker',
      target: 'lorem.text',
    },
    help: {
      summary: 'Generates a random text based on a random lorem method.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: '',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'lorem.word',
    delegate: {
      type: 'faker',
      target: 'lorem.word',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a word of a specified length.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'cumque',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Minimum word length when generating a ranged length.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Maximum word length when generating a ranged length.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'Exact word length to generate.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'lorem.words',
    delegate: {
      type: 'faker',
      target: 'lorem.words',
    },
    help: {
      summary: 'Generates a space separated list of words.',
      docsUrl: 'https://fakerjs.dev/api/lorem',
      example: 'desidero conforto decimus',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'wordCount',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'wordCountMax',
          type: 'number',
          required: false,
          description: 'The maximum number of words to generate.',
        },
        {
          name: 'wordCountMin',
          type: 'number',
          required: false,
          description: 'The minimum number of words to generate.',
        },
      ],
    },
  },
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
  {
    keyword: 'number.bigInt',
    delegate: {
      type: 'faker',
      target: 'number.bigInt',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a BigInt number.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '347465151663036',
      returnType: 'integer',
      args: [
        {
          name: 'value',
          type: 'string|number|boolean',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'number.binary',
    delegate: {
      type: 'faker',
      target: 'number.binary',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a binary string.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '0',
      returnType: 'string',
      args: [
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Upper bound for generated number.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Lower bound for generated number.',
        },
      ],
    },
  },
  {
    keyword: 'number.float',
    delegate: {
      type: 'faker',
      target: 'number.float',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Returns a single random floating-point number, by default between `0.0` and `1.0`. To change the range, pass a `min` and `max` value. To limit the number of decimal places, pass a `multipleOf` or `fractionDigits` parameter.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '0.5433707701438405',
      returnType: 'number',
      args: [
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'fractionDigits',
          type: 'number',
          required: false,
          description:
            'The maximum number of digits to appear after the decimal point, for example 2 will round to 2 decimal points. Only one of multipleOf or fractionDigits should be passed.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Upper bound for generated number, exclusive, unless multipleOf or fractionDigits are passed.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Lower bound for generated number, inclusive.',
        },
        {
          name: 'multipleOf',
          type: 'number',
          required: false,
          description:
            'The generated number will be a multiple of this parameter. Only one of multipleOf or fractionDigits should be passed.',
        },
      ],
    },
  },
  {
    keyword: 'number.hex',
    delegate: {
      type: 'faker',
      target: 'number.hex',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a lowercase hexadecimal number.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: 'd',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'number.int',
    delegate: {
      type: 'faker',
      target: 'number.int',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a single random integer between zero and the given max value or the given range.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '5190574431878510',
      returnType: 'integer',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Optional minimum integer.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Optional maximum integer.',
        },
        {
          name: 'multipleOf',
          type: 'number',
          required: false,
          description: 'Generated number will be a multiple of the given integer.',
        },
      ],
    },
  },
  {
    keyword: 'number.octal',
    delegate: {
      type: 'faker',
      target: 'number.octal',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an octal string.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: '6',
      returnType: 'string',
      args: [
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'Upper bound for generated number.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'Lower bound for generated number.',
        },
      ],
    },
  },
  {
    keyword: 'number.romanNumeral',
    delegate: {
      type: 'faker',
      target: 'number.romanNumeral',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a roman numeral in String format.',
      docsUrl: 'https://fakerjs.dev/api/number',
      example: 'XXXV',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'person.bio',
    delegate: {
      type: 'faker',
      target: 'person.bio',
    },
    help: {
      summary: 'Returns a random short biography',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'musician',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.firstName',
    delegate: {
      type: 'faker',
      target: 'person.firstName',
    },
    help: {
      summary: 'Returns a random first name.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Amelie',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
          required: false,
          description: 'The optional sex to use for first-name selection.',
        },
      ],
    },
  },
  {
    keyword: 'person.fullName',
    delegate: {
      type: 'faker',
      target: 'person.fullName',
    },
    help: {
      summary: 'Generates a random full name.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Mrs. Sheryl Zemlak DVM',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.gender',
    delegate: {
      type: 'faker',
      target: 'person.gender',
    },
    help: {
      summary: 'Returns a random gender.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Female to male',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.jobArea',
    delegate: {
      type: 'faker',
      target: 'person.jobArea',
    },
    help: {
      summary: 'Generates a random job area.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Branding',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.jobDescriptor',
    delegate: {
      type: 'faker',
      target: 'person.jobDescriptor',
    },
    help: {
      summary: 'Generates a random job descriptor.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Direct',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.jobTitle',
    delegate: {
      type: 'faker',
      target: 'person.jobTitle',
    },
    help: {
      summary: 'Generates a random job title.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Senior Identity Technician',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.jobType',
    delegate: {
      type: 'faker',
      target: 'person.jobType',
    },
    help: {
      summary: 'Generates a random job type.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Engineer',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.lastName',
    delegate: {
      type: 'faker',
      target: 'person.lastName',
    },
    help: {
      summary: 'Returns a random last name.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Bernhard',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
          required: false,
          description: 'The optional sex to use for last-name selection.',
        },
      ],
    },
  },
  {
    keyword: 'person.middleName',
    delegate: {
      type: 'faker',
      target: 'person.middleName',
    },
    help: {
      summary: 'Returns a random middle name.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Ryan',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
          required: false,
          description: 'The optional sex to use for middle-name selection.',
        },
      ],
    },
  },
  {
    keyword: 'person.prefix',
    delegate: {
      type: 'faker',
      target: 'person.prefix',
    },
    help: {
      summary: 'Returns a random person prefix.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Miss',
      returnType: 'string',
      args: [
        {
          name: 'sex',
          type: 'string',
          required: false,
          description: "The optional sex to use. Can be either 'female' or 'male'.",
        },
      ],
    },
  },
  {
    keyword: 'person.sex',
    delegate: {
      type: 'faker',
      target: 'person.sex',
    },
    help: {
      summary: 'Returns a random sex.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'male',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.sexType',
    delegate: {
      type: 'faker',
      target: 'person.sexType',
    },
    help: {
      summary: 'Returns a random sex type. The `SexType` is intended to be used in parameters and conditions.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'male',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.suffix',
    delegate: {
      type: 'faker',
      target: 'person.suffix',
    },
    help: {
      summary: 'Returns a random person suffix.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'IV',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'person.zodiacSign',
    delegate: {
      type: 'faker',
      target: 'person.zodiacSign',
    },
    help: {
      summary: 'Returns a random zodiac sign.',
      docsUrl: 'https://fakerjs.dev/api/person',
      example: 'Cancer',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'phone.imei',
    delegate: {
      type: 'faker',
      target: 'phone.imei',
    },
    help: {
      summary: 'Generates IMEI number.',
      docsUrl: 'https://fakerjs.dev/api/phone',
      example: '44-358223-971834-1',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'phone.number',
    delegate: {
      type: 'faker',
      target: 'phone.number',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a random phone number.',
      docsUrl: 'https://fakerjs.dev/api/phone',
      example: '298.756.9044',
      returnType: 'string',
      args: [
        {
          name: 'style',
          type: 'string',
          required: false,
          description:
            "Style of the generated phone number: 'human': (default) A human-input phone number, e.g. 555-770-7727 or 555.770.7727 x1234 'national': A phone number in a standardized national format, e.g. (555) 123-4567. 'international': A phone number in the E.123 international format, e.g. +15551234567",
        },
      ],
    },
  },
  {
    keyword: 'science.chemicalElement',
    delegate: {
      type: 'faker',
      target: 'science.chemicalElement',
    },
    help: {
      summary: 'Generate a value using faker science.chemicalElement.',
      docsUrl: 'https://fakerjs.dev/api/science',
      example: '',
      returnType: 'object',
      args: [],
    },
  },
  {
    keyword: 'science.chemicalElement.atomicNumber',
    delegate: {
      type: 'faker',
      target: 'science.chemicalElement',
      resultPath: 'atomicNumber',
    },
    help: {
      summary: 'Generate a chemical element atomic number.',
      docsUrl: 'https://fakerjs.dev/api/science',
      example: '8',
      returnType: 'integer',
      args: [],
    },
  },
  {
    keyword: 'science.chemicalElement.name',
    delegate: {
      type: 'faker',
      target: 'science.chemicalElement',
      resultPath: 'name',
    },
    help: {
      summary: 'Generate a chemical element name.',
      docsUrl: 'https://fakerjs.dev/api/science',
      example: 'Oxygen',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'science.chemicalElement.symbol',
    delegate: {
      type: 'faker',
      target: 'science.chemicalElement',
      resultPath: 'symbol',
    },
    help: {
      summary: 'Generate a chemical element symbol.',
      docsUrl: 'https://fakerjs.dev/api/science',
      example: 'O',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'science.unit',
    delegate: {
      type: 'faker',
      target: 'science.unit',
    },
    help: {
      summary: 'Returns a random scientific unit.',
      docsUrl: 'https://fakerjs.dev/api/science',
      example: '{"name":"farad","symbol":"F"}',
      returnType: 'object',
      args: [],
    },
  },
  {
    keyword: 'string.alpha',
    delegate: {
      type: 'faker',
      target: 'string.alpha',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generating a string consisting of letters in the English alphabet.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 'R',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: 'The casing of the characters.',
        },
        {
          name: 'exclude',
          type: 'array',
          required: false,
          description: 'An array with characters which should be excluded in the generated string.',
        },
      ],
    },
  },
  {
    keyword: 'string.alphanumeric',
    delegate: {
      type: 'faker',
      target: 'string.alphanumeric',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generating a string consisting of alpha characters and digits.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 's',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: 'The casing of the characters.',
        },
        {
          name: 'exclude',
          type: 'array',
          required: false,
          description: 'An array of characters and digits which should be excluded in the generated string.',
        },
      ],
    },
  },
  {
    keyword: 'string.binary',
    delegate: {
      type: 'faker',
      target: 'string.binary',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a binary string.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0b0',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description:
            'The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Prefix for the generated number.',
        },
      ],
    },
  },
  {
    keyword: 'string.fromCharacters',
    delegate: {
      type: 'faker',
      target: 'string.fromCharacters',
    },
    help: {
      summary: 'Generates a string from the given characters.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '',
      returnType: 'string',
      args: [
        {
          name: 'characters',
          type: 'string|array',
          required: true,
          description: 'No description provided.',
        },
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'string.hexadecimal',
    delegate: {
      type: 'faker',
      target: 'string.hexadecimal',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a hexadecimal string.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0x1',
      returnType: 'string',
      args: [
        {
          name: 'casing',
          type: 'string',
          required: false,
          description: 'Casing of the generated number.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description:
            'The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Prefix for the generated number.',
        },
      ],
    },
  },
  {
    keyword: 'string.nanoid',
    delegate: {
      type: 'faker',
      target: 'string.nanoid',
    },
    help: {
      summary: 'Generates a Nano ID.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: 'KLm49ferlh-eUmJpZdSIO',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'lengthMax',
          type: 'number',
          required: false,
          description: 'The maximum length of the Nano ID to generate.',
        },
        {
          name: 'lengthMin',
          type: 'number',
          required: false,
          description: 'The minimum length of the Nano ID to generate.',
        },
      ],
    },
  },
  {
    keyword: 'string.numeric',
    delegate: {
      type: 'faker',
      target: 'string.numeric',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Generates a given length string of digits.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '7',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'allowLeadingZeros',
          type: 'boolean',
          required: false,
          description: 'Whether leading zeros are allowed or not.',
        },
        {
          name: 'exclude',
          type: 'array',
          required: false,
          description: 'An array of digits which should be excluded in the generated string.',
        },
      ],
    },
  },
  {
    keyword: 'string.octal',
    delegate: {
      type: 'faker',
      target: 'string.octal',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns an octal string.',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0o6',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description:
            'The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.',
        },
        {
          name: 'prefix',
          type: 'string',
          required: false,
          description: 'Prefix for the generated number.',
        },
      ],
    },
  },
  {
    keyword: 'string.sample',
    delegate: {
      type: 'faker',
      target: 'string.sample',
    },
    help: {
      summary: 'Returns a string containing UTF-16 chars between 33 and 125 (`!` to `}`).',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '\\Fw;0e:G.H',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'lengthMax',
          type: 'number',
          required: false,
          description: 'The maximum length of the string to generate.',
        },
        {
          name: 'lengthMin',
          type: 'number',
          required: false,
          description: 'The minimum length of the string to generate.',
        },
      ],
    },
  },
  {
    keyword: 'string.symbol',
    delegate: {
      type: 'faker',
      target: 'string.symbol',
    },
    help: {
      summary: 'Returns a string containing only special characters from the following list:',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '.',
      returnType: 'string',
      args: [
        {
          name: 'min',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'lengthMax',
          type: 'number',
          required: false,
          description: 'The maximum length of the string to generate.',
        },
        {
          name: 'lengthMin',
          type: 'number',
          required: false,
          description: 'The minimum length of the string to generate.',
        },
      ],
    },
  },
  {
    keyword: 'string.ulid',
    delegate: {
      type: 'faker',
      target: 'string.ulid',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a ULID (Universally Unique Lexicographically Sortable Identifier).',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '01KQADM2A0728G4D2HKCPWKS6N',
      returnType: 'string',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description:
            'The date to use as reference point for the newly generated ULID encoded timestamp. The encoded timestamp is represented by the first 10 characters of the result.',
        },
      ],
    },
  },
  {
    keyword: 'string.uuid',
    delegate: {
      type: 'faker',
      target: 'string.uuid',
    },
    help: {
      summary: 'Returns a UUID v4 (Universally Unique Identifier).',
      docsUrl: 'https://fakerjs.dev/api/string',
      example: '0628ae51-7b6c-4d33-9f24-dae19fb245df',
      returnType: 'string',
      args: [
        {
          name: 'refDate',
          type: 'number',
          required: false,
          description: 'The timestamp to encode into the UUID. This parameter is only relevant for UUID v7.',
        },
        {
          name: 'version',
          type: 'string',
          required: false,
          description: 'The specific UUID version to use.',
        },
      ],
    },
  },
  {
    keyword: 'system.commonFileExt',
    delegate: {
      type: 'faker',
      target: 'system.commonFileExt',
    },
    help: {
      summary: 'Returns a commonly used file extension.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'pdf',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.commonFileName',
    delegate: {
      type: 'faker',
      target: 'system.commonFileName',
    },
    help: {
      summary: 'Returns a random file name with a given extension or a commonly used extension.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'bleak.pdf',
      returnType: 'string',
      args: [
        {
          name: 'extension',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'system.commonFileType',
    delegate: {
      type: 'faker',
      target: 'system.commonFileType',
    },
    help: {
      summary: 'Returns a commonly used file type.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'video',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.cron',
    delegate: {
      type: 'faker',
      target: 'system.cron',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random cron expression.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '* 15 * * SAT',
      returnType: 'string',
      args: [
        {
          name: 'includeNonStandard',
          type: 'boolean',
          required: false,
          description: 'Whether to include a @yearly, @monthly, @daily, etc text labels in the generated expression.',
        },
        {
          name: 'includeYear',
          type: 'boolean',
          required: false,
          description: 'Whether to include a year in the generated expression.',
        },
      ],
    },
  },
  {
    keyword: 'system.directoryPath',
    delegate: {
      type: 'faker',
      target: 'system.directoryPath',
    },
    help: {
      summary: 'Returns a directory path.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '/bin',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.fileExt',
    delegate: {
      type: 'faker',
      target: 'system.fileExt',
    },
    help: {
      summary: 'Returns a file extension.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'xsl',
      returnType: 'string',
      args: [
        {
          name: 'mimeType',
          type: 'string',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
  {
    keyword: 'system.fileName',
    delegate: {
      type: 'faker',
      target: 'system.fileName',
    },
    help: {
      summary: 'Returns a random file name with extension.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'unsightly.woff',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.filePath',
    delegate: {
      type: 'faker',
      target: 'system.filePath',
    },
    help: {
      summary: 'Returns a file path.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '/tmp/ouch.xlt',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.fileType',
    delegate: {
      type: 'faker',
      target: 'system.fileType',
    },
    help: {
      summary: 'Returns a file type.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'font',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.mimeType',
    delegate: {
      type: 'faker',
      target: 'system.mimeType',
    },
    help: {
      summary: 'Returns a mime-type.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'application/gzip',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.networkInterface',
    delegate: {
      type: 'faker',
      target: 'system.networkInterface',
    },
    help: {
      summary: 'Returns a random network interface.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: 'wlx3fba717f9f9c',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'system.semver',
    delegate: {
      type: 'faker',
      target: 'system.semver',
    },
    help: {
      summary: 'Returns a semantic version.',
      docsUrl: 'https://fakerjs.dev/api/system',
      example: '4.3.6',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.bicycle',
    delegate: {
      type: 'faker',
      target: 'vehicle.bicycle',
    },
    help: {
      summary: 'Returns a type of bicycle.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Touring Bicycle',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.color',
    delegate: {
      type: 'faker',
      target: 'vehicle.color',
    },
    help: {
      summary: 'Returns a vehicle color.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'sky blue',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.fuel',
    delegate: {
      type: 'faker',
      target: 'vehicle.fuel',
    },
    help: {
      summary: 'Returns a fuel type.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Gasoline',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.manufacturer',
    delegate: {
      type: 'faker',
      target: 'vehicle.manufacturer',
    },
    help: {
      summary: 'Returns a manufacturer name.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Hyundai',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.model',
    delegate: {
      type: 'faker',
      target: 'vehicle.model',
    },
    help: {
      summary: 'Returns a vehicle model.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Aventador',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.type',
    delegate: {
      type: 'faker',
      target: 'vehicle.type',
    },
    help: {
      summary: 'Returns a vehicle type.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Hatchback',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.vehicle',
    delegate: {
      type: 'faker',
      target: 'vehicle.vehicle',
    },
    help: {
      summary: 'Returns a random vehicle.',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'Ford CTS',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.vin',
    delegate: {
      type: 'faker',
      target: 'vehicle.vin',
    },
    help: {
      summary: 'Returns a vehicle identification number (VIN).',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: '7SJ9N0LM3LM265056',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'vehicle.vrm',
    delegate: {
      type: 'faker',
      target: 'vehicle.vrm',
    },
    help: {
      summary: 'Returns a vehicle registration number (Vehicle Registration Mark - VRM)',
      docsUrl: 'https://fakerjs.dev/api/vehicle',
      example: 'OD11RTZ',
      returnType: 'string',
      args: [],
    },
  },
  {
    keyword: 'word.adjective',
    delegate: {
      type: 'faker',
      target: 'word.adjective',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random adjective.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'heavenly',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.adverb',
    delegate: {
      type: 'faker',
      target: 'word.adverb',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random adverb.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'selfishly',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.conjunction',
    delegate: {
      type: 'faker',
      target: 'word.conjunction',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random conjunction.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'indeed',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.interjection',
    delegate: {
      type: 'faker',
      target: 'word.interjection',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random interjection.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'er',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.noun',
    delegate: {
      type: 'faker',
      target: 'word.noun',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random noun.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'cook',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.preposition',
    delegate: {
      type: 'faker',
      target: 'word.preposition',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random preposition.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'beside',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.sample',
    delegate: {
      type: 'faker',
      target: 'word.sample',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary:
        'Returns a random word, that can be an adjective, adverb, conjunction, interjection, noun, preposition, or verb.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'snoopy',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.verb',
    delegate: {
      type: 'faker',
      target: 'word.verb',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random verb.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'embalm',
      returnType: 'string',
      args: [
        {
          name: 'length',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'strategy',
          type: 'string',
          required: false,
          description:
            'The strategy to apply when no words with a matching length are found. Available error handling strategies: fail: Throws an error if no words with the given length are found. shortest: Returns any of the shortest words. closest: Returns any of the words closest to the given length. longest: Returns any of the longest words. any-length: Returns a word with any length.',
        },
      ],
    },
  },
  {
    keyword: 'word.words',
    delegate: {
      type: 'faker',
      target: 'word.words',
      argTransform: 'optionsFromHelpArgs',
    },
    help: {
      summary: 'Returns a random string containing some words separated by spaces.',
      docsUrl: 'https://fakerjs.dev/api/word',
      example: 'geez',
      returnType: 'string',
      args: [
        {
          name: 'count',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'max',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
        {
          name: 'value',
          type: 'number',
          required: false,
          description: 'No description provided.',
        },
      ],
    },
  },
];

export { DOMAIN_KEYWORD_DEFINITIONS };
