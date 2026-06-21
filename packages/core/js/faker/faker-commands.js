import { FAKER_HELPER_KEYWORD_DEFINITIONS } from './faker-helper-keyword-definitions.js';

const HELPER_FAKER_COMMANDS = Object.keys(FAKER_HELPER_KEYWORD_DEFINITIONS);

const KNOWN_FAKER_COMMANDS = [
  'RegEx',

  // v10.4.0
  //"_randomizer.next","_randomizer.seed",
  'datatype.boolean',
  'date.month',
  'date.weekday',
  'date.timeZone',
  'date.anytime',
  'date.past',
  'date.future',
  'date.between',
  'date.betweens',
  'date.recent',
  'date.soon',
  'date.birthdate',
  // Some helpers work just fine. Keep helper registration sourced from helper definitions.
  ...HELPER_FAKER_COMMANDS,
  'number.int',
  'number.float',
  'number.binary',
  'number.octal',
  'number.hex',
  'number.bigInt',
  'number.romanNumeral',
  'string.fromCharacters',
  'string.alpha',
  'string.alphanumeric',
  'string.binary',
  'string.octal',
  'string.hexadecimal',
  'string.numeric',
  'string.sample',
  'string.uuid',
  'string.ulid',
  'string.nanoid',
  'string.symbol',
  'airline.airport.name',
  'airline.airport.iataCode',
  'airline.airline.name',
  'airline.airline.iataCode',
  'airline.airplane.name',
  'airline.airplane.iataTypeCode',
  'airline.recordLocator',
  'airline.seat',
  'airline.aircraftType',
  'airline.flightNumber',
  'animal.dog',
  'animal.cat',
  'animal.snake',
  'animal.bear',
  'animal.lion',
  'animal.cetacean',
  'animal.horse',
  'animal.bird',
  'animal.cow',
  'animal.fish',
  'animal.crocodilia',
  'animal.insect',
  'animal.rabbit',
  'animal.rodent',
  'animal.type',
  'animal.petName',
  'book.author',
  'book.format',
  'book.genre',
  'book.publisher',
  'book.series',
  'book.title',
  'color.human',
  'color.space',
  'color.cssSupportedFunction',
  'color.cssSupportedSpace',
  'color.rgb',
  'color.cmyk',
  'color.hsl',
  'color.hwb',
  'color.lab',
  'color.lch',
  'color.colorByCSSColorSpace',
  'commerce.department',
  'commerce.productName',
  'commerce.price',
  'commerce.productAdjective',
  'commerce.productMaterial',
  'commerce.product',
  'commerce.productDescription',
  'commerce.isbn',
  'commerce.upc',
  'company.name',
  'company.catchPhrase',
  'company.buzzPhrase',
  'company.catchPhraseAdjective',
  'company.catchPhraseDescriptor',
  'company.catchPhraseNoun',
  'company.buzzAdjective',
  'company.buzzVerb',
  'company.buzzNoun',
  'database.column',
  'database.type',
  'database.collation',
  'database.engine',
  'database.mongodbObjectId',
  'finance.accountNumber',
  'finance.accountName',
  'finance.routingNumber',
  'finance.amount',
  'finance.transactionType',
  'finance.currency',
  'finance.currencyCode',
  'finance.currencyName',
  'finance.currencySymbol',
  'finance.currencyNumericCode',
  'finance.bitcoinAddress',
  'finance.litecoinAddress',
  'finance.creditCardNumber',
  'finance.creditCardCVV',
  'finance.creditCardIssuer',
  'finance.pin',
  'finance.ethereumAddress',
  'finance.iban',
  'finance.bic',
  'finance.transactionDescription',
  'food.adjective',
  'food.description',
  'food.dish',
  'food.ethnicCategory',
  'food.fruit',
  'food.ingredient',
  'food.meat',
  'food.spice',
  'food.vegetable',
  'git.branch',
  'git.commitEntry',
  'git.commitMessage',
  'git.commitDate',
  'git.commitSha',
  'hacker.abbreviation',
  'hacker.adjective',
  'hacker.noun',
  'hacker.verb',
  'hacker.ingverb',
  'hacker.phrase',
  'image.avatar',
  'image.avatarGitHub',
  'image.personPortrait',
  'image.url',
  'image.urlPicsumPhotos',
  'image.dataUri',
  'internet.email',
  'internet.exampleEmail',
  'internet.username',
  'internet.displayName',
  'internet.protocol',
  'internet.httpMethod',
  'internet.httpStatusCode',
  'internet.url',
  'internet.domainName',
  'internet.domainSuffix',
  'internet.domainWord',
  'internet.ip',
  'internet.ipv4',
  'internet.ipv6',
  'internet.port',
  'internet.userAgent',
  'internet.mac',
  'internet.password',
  'internet.emoji',
  'internet.jwtAlgorithm',
  'internet.jwt',
  'location.zipCode',
  'location.city',
  'location.buildingNumber',
  'location.street',
  'location.streetAddress',
  'location.secondaryAddress',
  'location.county',
  'location.country',
  'location.continent',
  'location.countryCode',
  'location.state',
  'location.latitude',
  'location.longitude',
  'location.direction',
  'location.cardinalDirection',
  'location.ordinalDirection',
  'location.nearbyGPSCoordinate',
  'location.timeZone',
  'location.language',
  'lorem.word',
  'lorem.words',
  'lorem.sentence',
  'lorem.slug',
  'lorem.sentences',
  'lorem.paragraph',
  'lorem.paragraphs',
  'lorem.text',
  'lorem.lines',
  'music.album',
  'music.artist',
  'music.genre',
  'music.songName',
  'person.firstName',
  'person.lastName',
  'person.middleName',
  'person.fullName',
  'person.gender',
  'person.sex',
  'person.sexType',
  'person.bio',
  'person.prefix',
  'person.suffix',
  'person.jobTitle',
  'person.jobDescriptor',
  'person.jobArea',
  'person.jobType',
  'person.zodiacSign',
  'phone.number',
  'phone.imei',
  'science.chemicalElement.symbol',
  'science.chemicalElement.name',
  'science.chemicalElement.atomicNumber',
  'science.unit',
  'system.fileName',
  'system.commonFileName',
  'system.mimeType',
  'system.commonFileType',
  'system.commonFileExt',
  'system.fileType',
  'system.fileExt',
  'system.directoryPath',
  'system.filePath',
  'system.semver',
  'system.networkInterface',
  'system.cron',
  'vehicle.vehicle',
  'vehicle.manufacturer',
  'vehicle.model',
  'vehicle.type',
  'vehicle.fuel',
  'vehicle.vin',
  'vehicle.color',
  'vehicle.vrm',
  'vehicle.bicycle',
  'word.adjective',
  'word.adverb',
  'word.conjunction',
  'word.interjection',
  'word.noun',
  'word.preposition',
  'word.verb',
  'word.sample',
  'word.words',
];

const FORBIDDEN_FAKER_COMMANDS = [
  'helpers.objectKey',
  'helpers.objectValue',
  'helpers.objectEntry',
  'helpers.enumValue',
];

function compareAlphabetically(left, right) {
  return left.localeCompare(right);
}

function getKnownFakerCommandsAlphabetical() {
  return [...KNOWN_FAKER_COMMANDS].sort(compareAlphabetically);
}

function getKnownFakerCommandsLongestFirst() {
  return [...KNOWN_FAKER_COMMANDS].sort(
    (left, right) => right.length - left.length || compareAlphabetically(left, right)
  );
}

function getAllowedFakerCommandsAlphabetical() {
  const forbidden = new Set(FORBIDDEN_FAKER_COMMANDS);
  return getKnownFakerCommandsAlphabetical().filter((command) => !forbidden.has(command));
}

function getAllowedFakerCommandsLongestFirst() {
  const forbidden = new Set(FORBIDDEN_FAKER_COMMANDS);
  return getKnownFakerCommandsLongestFirst().filter((command) => !forbidden.has(command));
}

function isForbiddenFakerCommand(command) {
  return FORBIDDEN_FAKER_COMMANDS.includes(String(command || '').trim());
}

function normalizeFakerCommandCandidate(commandValue) {
  const command = String(commandValue || '').trim();
  if (!command) {
    return '';
  }

  if (command.startsWith('faker.')) {
    return command.slice('faker.'.length);
  }

  return command;
}

function extractFakerCommandCandidate(ruleSpec) {
  const normalizedSpec = normalizeFakerCommandCandidate(ruleSpec);
  if (!normalizedSpec) {
    return '';
  }

  const parenIndex = normalizedSpec.indexOf('(');
  const command = parenIndex >= 0 ? normalizedSpec.slice(0, parenIndex) : normalizedSpec;
  return String(command || '').trim();
}

function isKnownFakerCommand(command) {
  return KNOWN_FAKER_COMMANDS.includes(normalizeFakerCommandCandidate(command));
}

export {
  KNOWN_FAKER_COMMANDS,
  FORBIDDEN_FAKER_COMMANDS,
  getKnownFakerCommandsAlphabetical,
  getKnownFakerCommandsLongestFirst,
  getAllowedFakerCommandsAlphabetical,
  getAllowedFakerCommandsLongestFirst,
  isForbiddenFakerCommand,
  normalizeFakerCommandCandidate,
  extractFakerCommandCandidate,
  isKnownFakerCommand,
};
