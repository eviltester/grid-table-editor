import { EnumParser } from '../data_generation/utils/enumParser.js';

const STRING_COMMANDS_ALLOWING_EMPTY_INPUT_OUTPUT = new Set([
  'helpers.fake',
  'helpers.mustache',
  'helpers.fromregexp',
  'helpers.slugify',
  'helpers.replacesymbols',
  'helpers.replacecreditcardsymbols',
]);

const ZERO_LENGTH_STRING_PARAM_NAMES = new Set([
  'count',
  'length',
  'lineCount',
  'lineCountMax',
  'lineCountMin',
  'max',
  'min',
  'paragraphCount',
  'paragraphCountMax',
  'paragraphCountMin',
  'sentenceCount',
  'sentenceCountMax',
  'sentenceCountMin',
  'wordCount',
  'wordCountMax',
  'wordCountMin',
]);

const UUID_VARIANTS = new Set(['8', '9', 'a', 'b']);
const IATA_AIRLINE_CODE_REGEX = /^[A-Z0-9]{2}$/u;
const IATA_AIRPORT_CODE_REGEX = /^[A-Z]{3}$/u;
const IATA_AIRCRAFT_TYPE_CODE_REGEX = /^[A-Z0-9]{3}$/u;
const FLIGHT_NUMBER_REGEX = /^\d{1,4}$/u;
const AIRLINE_RECORD_LOCATOR_REGEX = /^[A-Z0-9]{6}$/u;
const AIRLINE_SEAT_REGEX = /^[1-9]\d{0,2}[A-Z]{1,2}$/u;
const MONGODB_OBJECT_ID_REGEX = /^[0-9a-f]{24}$/iu;
const BIC_REGEX = /^[A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?$/u;
const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/u;
const CURRENCY_NUMERIC_CODE_REGEX = /^\d{3}$/u;
const ETHEREUM_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/iu;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const EXAMPLE_EMAIL_REGEX = /^[^\s@]+@example\.(?:com|net|org)$/iu;
const JWT_REGEX = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u;
const MIME_TYPE_REGEX = /^[A-Za-z0-9!#$&^_.+-]+\/[A-Za-z0-9!#$&^_.+-]+$/u;
const SEMVER_REGEX =
  /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const ULID_REGEX = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/u;
const NANOID_REGEX = /^[A-Za-z0-9_-]+$/u;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/iu;
const BASE58_REGEX_SOURCE = '[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]';
const BECH32_REGEX_SOURCE = '[ac-hj-np-z02-9]';
const BITCOIN_PATTERNS = {
  mainnet: {
    legacy: new RegExp(`^1${BASE58_REGEX_SOURCE}{25,34}$`, 'u'),
    segwit: new RegExp(`^3${BASE58_REGEX_SOURCE}{25,34}$`, 'u'),
    bech32: new RegExp(`^bc1${BECH32_REGEX_SOURCE}{11,71}$`, 'u'),
    taproot: new RegExp(`^bc1p${BECH32_REGEX_SOURCE}{8,71}$`, 'u'),
  },
  testnet: {
    legacy: new RegExp(`^[mn]${BASE58_REGEX_SOURCE}{25,34}$`, 'u'),
    segwit: new RegExp(`^2${BASE58_REGEX_SOURCE}{25,34}$`, 'u'),
    bech32: new RegExp(`^tb1${BECH32_REGEX_SOURCE}{11,71}$`, 'u'),
    taproot: new RegExp(`^tb1p${BECH32_REGEX_SOURCE}{8,71}$`, 'u'),
  },
};
const LITECOIN_PATTERNS = [
  new RegExp(`^[LM3]${BASE58_REGEX_SOURCE}{25,34}$`, 'u'),
  new RegExp(`^ltc1${BECH32_REGEX_SOURCE}{8,71}$`, 'u'),
];
const MAC_PATTERNS = {
  ':': /^[0-9a-f]{2}(?::[0-9a-f]{2}){5}$/iu,
  '-': /^[0-9a-f]{2}(?:-[0-9a-f]{2}){5}$/iu,
  '': /^[0-9a-f]{12}$/iu,
};
const CRON_NON_STANDARD_REGEX = /^@(annually|yearly|monthly|weekly|daily|hourly|reboot)$/u;
const CRON_FIELD_REGEX = /^[\dA-Z*/?,#L-]+$/iu;

let cachedTimeZones = null;

function validateAnyValue() {
  return true;
}

function normalizeAllowedValues(allowedValues = []) {
  return Array.isArray(allowedValues)
    ? allowedValues
        .map((entry) => String(entry))
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
    : [];
}

function createStringEnumValidator(allowedValues = []) {
  const normalizedAllowedValues = normalizeAllowedValues(allowedValues);

  return (value) => typeof value === 'string' && normalizedAllowedValues.includes(value);
}

function createRegexValidator(regex) {
  return (value, context = {}) => validateStringValue(value, context) && regex.test(value);
}

function createPredicateValidator(predicate) {
  return (value, context = {}) => validateStringValue(value, context) && predicate(value, context) === true;
}

function getNormalizedContextCommand(context = {}) {
  return String(context?.command ?? context?.fieldDefinition?.command ?? '')
    .trim()
    .toLowerCase();
}

function getContextParamSpecs(context = {}) {
  if (Array.isArray(context?.help?.args)) {
    return context.help.args;
  }
  if (Array.isArray(context?.help?.params)) {
    return context.help.params;
  }
  return [];
}

function getContextNamedArgs(context = {}) {
  const specs = getContextParamSpecs(context);
  const args = getContextArgs(context);

  return Object.fromEntries(
    specs.map((spec, index) => [String(spec?.name ?? '').trim(), args[index]]).filter(([name]) => name.length > 0)
  );
}

function isExplicitZeroLengthStringConfig(context = {}) {
  const args = getContextArgs(context);
  const specs = getContextParamSpecs(context);

  return specs.some((spec, index) => {
    const paramName = String(spec?.name ?? '').trim();
    if (!ZERO_LENGTH_STRING_PARAM_NAMES.has(paramName)) {
      return false;
    }
    return Object.is(args[index], 0);
  });
}

function isEmptyStringAllowedByHelperInput(context = {}) {
  const command = getNormalizedContextCommand(context);
  if (!STRING_COMMANDS_ALLOWING_EMPTY_INPUT_OUTPUT.has(command)) {
    return false;
  }

  const functionCall = String(
    context?.functionCall ?? context?.ruleSpec ?? context?.fieldDefinition?.ruleSpec ?? ''
  ).trim();
  if (!functionCall) {
    return false;
  }

  const normalizedFunctionCall = functionCall.toLowerCase();

  if (normalizedFunctionCall === `${command}()`) {
    return true;
  }

  return new RegExp(`^${command.replace('.', '\\.')}\\(\\s*""\\s*(?:,|\\))`, 'i').test(functionCall);
}

function isEmptyStringAllowedByContext(context = {}) {
  return isExplicitZeroLengthStringConfig(context) || isEmptyStringAllowedByHelperInput(context);
}

function validateStringValue(value, context = {}) {
  if (typeof value !== 'string') {
    return false;
  }

  if (value.length > 0) {
    return true;
  }

  return isEmptyStringAllowedByContext(context);
}

function validateNumberValue(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function validateIntegerValue(value) {
  return typeof value === 'bigint' || Number.isInteger(value);
}

function validateBooleanValue(value) {
  return typeof value === 'boolean';
}

function validateArrayValue(value) {
  return Array.isArray(value);
}

function validateObjectValue(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateDateValue(value) {
  if (value instanceof Date) {
    return !Number.isNaN(value.valueOf());
  }
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function validateArrayOrStringValue(value) {
  return validateArrayValue(value) || validateStringValue(value);
}

function validateStringOrNumberValue(value) {
  return validateStringValue(value) || validateNumberValue(value);
}

function validateStringOrNumberOrBooleanValue(value) {
  return validateStringValue(value) || validateNumberValue(value) || validateBooleanValue(value);
}

function getContextArgs(context = {}) {
  if (Array.isArray(context?.args)) {
    return context.args;
  }
  if (Array.isArray(context?.parsedArgs)) {
    return context.parsedArgs;
  }
  return [];
}

function getFieldDefinitionFromContext(context = {}) {
  if (context?.fieldDefinition && typeof context.fieldDefinition === 'object') {
    return context.fieldDefinition;
  }
  return {};
}

function getNormalizedStringLengthBounds(lengthValue, { minimum = 1 } = {}) {
  if (typeof lengthValue === 'number' && Number.isFinite(lengthValue)) {
    const normalized = Math.max(0, Math.trunc(lengthValue));
    return { min: normalized, max: normalized };
  }

  if (Array.isArray(lengthValue)) {
    const numericValues = lengthValue
      .map((entry) => (typeof entry === 'number' && Number.isFinite(entry) ? Math.trunc(entry) : null))
      .filter((entry) => entry !== null);
    if (numericValues.length > 0) {
      return {
        min: Math.max(0, Math.min(...numericValues)),
        max: Math.max(0, Math.max(...numericValues)),
      };
    }
  }

  if (lengthValue && typeof lengthValue === 'object') {
    const min =
      typeof lengthValue.min === 'number' && Number.isFinite(lengthValue.min) ? Math.trunc(lengthValue.min) : null;
    const max =
      typeof lengthValue.max === 'number' && Number.isFinite(lengthValue.max) ? Math.trunc(lengthValue.max) : null;

    if (min !== null || max !== null) {
      const resolvedMin = Math.max(0, Math.min(min ?? max ?? minimum, max ?? min ?? minimum));
      const resolvedMax = Math.max(0, Math.max(min ?? minimum, max ?? minimum));
      return { min: resolvedMin, max: resolvedMax };
    }
  }

  return { min: minimum, max: Number.POSITIVE_INFINITY };
}

function validateExactOrRangedLength(value, lengthValue, options = {}) {
  const { min, max } = getNormalizedStringLengthBounds(lengthValue, options);
  return value.length >= min && value.length <= max;
}

function normalizeDigits(value) {
  return String(value ?? '').replace(/\D+/gu, '');
}

function passesLuhnCheck(value) {
  const digits = normalizeDigits(value);
  if (!/^\d+$/u.test(digits) || digits.length === 0) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function getIbanModulo97(value) {
  const rearranged = `${value.slice(4)}${value.slice(0, 4)}`;
  let remainder = 0;

  for (const character of rearranged) {
    const codePoint = character.codePointAt(0);
    const chunk = /[A-Z]/u.test(character) ? String(codePoint - 55) : character;
    for (const digit of chunk) {
      remainder = (remainder * 10 + Number(digit)) % 97;
    }
  }

  return remainder;
}

function passesIbanCheck(value) {
  const normalized = String(value ?? '')
    .replace(/\s+/gu, '')
    .toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/u.test(normalized)) {
    return false;
  }
  return getIbanModulo97(normalized) === 1;
}

function passesIsbn10Check(value) {
  const normalized = String(value ?? '')
    .replace(/[-\s]/gu, '')
    .toUpperCase();
  if (!/^\d{9}[\dX]$/u.test(normalized)) {
    return false;
  }

  const checksum = normalized
    .split('')
    .reduce((sum, character, index) => sum + (10 - index) * (character === 'X' ? 10 : Number(character)), 0);

  return checksum % 11 === 0;
}

function passesIsbn13Check(value) {
  const normalized = String(value ?? '').replace(/[-\s]/gu, '');
  if (!/^\d{13}$/u.test(normalized)) {
    return false;
  }

  const checksum = normalized
    .slice(0, -1)
    .split('')
    .reduce((sum, character, index) => sum + Number(character) * (index % 2 === 0 ? 1 : 3), 0);
  const expectedCheckDigit = (10 - (checksum % 10)) % 10;

  return expectedCheckDigit === Number(normalized.at(-1));
}

function passesUpcCheck(value) {
  const normalized = normalizeDigits(value);
  if (!/^\d{12}$/u.test(normalized)) {
    return false;
  }

  const digits = normalized.split('').map((digit) => Number(digit));
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8] + digits[10];
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7] + digits[9];
  const expectedCheckDigit = (10 - ((oddSum * 3 + evenSum) % 10)) % 10;

  return expectedCheckDigit === digits[11];
}

function passesRoutingNumberCheck(value) {
  const normalized = normalizeDigits(value);
  if (!/^\d{9}$/u.test(normalized)) {
    return false;
  }

  const digits = normalized.split('').map((digit) => Number(digit));
  const checksum =
    3 * (digits[0] + digits[3] + digits[6]) +
    7 * (digits[1] + digits[4] + digits[7]) +
    (digits[2] + digits[5] + digits[8]);

  return checksum % 10 === 0;
}

function getExpectedUuidVersion(context = {}) {
  const namedArgs = getContextNamedArgs(context);
  if (namedArgs.version === 4 || namedArgs.version === 7) {
    return String(namedArgs.version);
  }
  if (typeof namedArgs.refDate !== 'undefined') {
    return '7';
  }
  return null;
}

function getAllowedTimeZones() {
  if (cachedTimeZones !== null) {
    return cachedTimeZones;
  }

  if (typeof Intl.supportedValuesOf === 'function') {
    cachedTimeZones = new Set(Intl.supportedValuesOf('timeZone'));
    return cachedTimeZones;
  }

  cachedTimeZones = new Set();
  return cachedTimeZones;
}

function matchesAnyPattern(value, patterns = []) {
  return patterns.some((pattern) => pattern.test(value));
}

function isValidIPv4Address(value) {
  const candidate = String(value ?? '').trim();
  if (!candidate) {
    return false;
  }

  try {
    const url = new URL(`http://${candidate}/`);
    return url.hostname === candidate && candidate.split('.').length === 4;
  } catch {
    return false;
  }
}

function isValidIPv6Address(value) {
  const candidate = String(value ?? '').trim();
  if (!candidate || !candidate.includes(':')) {
    return false;
  }

  try {
    // URL parsing gives us a browser-safe IPv6 validity check.
    // Valid inputs are normalized, so we only need parse success here.
    new URL(`http://[${candidate}]/`);
    return true;
  } catch {
    return false;
  }
}

function getContextRuleSpec(context = {}) {
  const fieldDefinition = getFieldDefinitionFromContext(context);
  const candidates = [context?.ruleSpec, fieldDefinition?.ruleSpec, context?.functionCall];

  for (const candidate of candidates) {
    const value = String(candidate ?? '').trim();
    if (value.length > 0) {
      return value;
    }
  }

  const command = String(fieldDefinition?.command ?? context?.command ?? '').trim();
  const params = String(fieldDefinition?.params ?? '').trim();
  if (!command) {
    return '';
  }
  if (!params) {
    return `${command}()`;
  }
  if (command.toLowerCase() === 'datatype.enum') {
    return `datatype.enum(${params.replace(/^\(|\)$/g, '').trim()})`;
  }
  return `${command}${params}`;
}

function getCounterStringRangeFromContext(context = {}) {
  const args = getContextArgs(context);

  const hasMin = typeof args[0] !== 'undefined';
  const hasMax = typeof args[1] !== 'undefined';
  const minArg = hasMin ? args[0] : 1;
  const maxArg = hasMax ? args[1] : hasMin ? minArg : 25;

  const lowest = Math.max(1, Math.min(minArg, maxArg));
  const highest = Math.max(1, Math.max(minArg, maxArg));

  return { lowest, highest };
}

function validateCounterStringValue(value, context = {}) {
  if (!validateStringValue(value)) {
    return false;
  }

  const { lowest, highest } = getCounterStringRangeFromContext(context);
  return value.length >= lowest && value.length <= highest;
}

function validateLiteralValue(value, context = {}) {
  const args = getContextArgs(context);
  const expected = typeof args[0] === 'undefined' ? '' : args[0];
  return Object.is(value, expected);
}

const validateMongoObjectIdValue = createRegexValidator(MONGODB_OBJECT_ID_REGEX);
const validateBicValue = createRegexValidator(BIC_REGEX);
const validateCurrencyCodeValue = createRegexValidator(CURRENCY_CODE_REGEX);
const validateCurrencyNumericCodeValue = createRegexValidator(CURRENCY_NUMERIC_CODE_REGEX);
const validateEthereumAddressValue = createRegexValidator(ETHEREUM_ADDRESS_REGEX);
const validateEmailValue = createRegexValidator(EMAIL_REGEX);
const validateExampleEmailValue = createRegexValidator(EXAMPLE_EMAIL_REGEX);
const validateJwtValue = createRegexValidator(JWT_REGEX);
const validateMimeTypeValue = createRegexValidator(MIME_TYPE_REGEX);
const validateSemverValue = createRegexValidator(SEMVER_REGEX);
const validateAirlineIataCodeValue = createRegexValidator(IATA_AIRLINE_CODE_REGEX);
const validateAirportIataCodeValue = createRegexValidator(IATA_AIRPORT_CODE_REGEX);
const validateAircraftIataTypeCodeValue = createRegexValidator(IATA_AIRCRAFT_TYPE_CODE_REGEX);
const validateFlightNumberValue = createRegexValidator(FLIGHT_NUMBER_REGEX);
const validateAirlineRecordLocatorValue = createRegexValidator(AIRLINE_RECORD_LOCATOR_REGEX);
const validateAirlineSeatValue = createRegexValidator(AIRLINE_SEAT_REGEX);

const validateBitcoinAddressValue = createPredicateValidator((value, context = {}) => {
  const { network = 'mainnet', type } = getContextNamedArgs(context);
  const normalizedNetwork = network === 'testnet' ? 'testnet' : 'mainnet';

  if (typeof type === 'string' && BITCOIN_PATTERNS[normalizedNetwork][type]) {
    return BITCOIN_PATTERNS[normalizedNetwork][type].test(value);
  }

  return matchesAnyPattern(value, Object.values(BITCOIN_PATTERNS[normalizedNetwork]));
});

const validateLitecoinAddressValue = createPredicateValidator((value) => matchesAnyPattern(value, LITECOIN_PATTERNS));

const validateCreditCardCvvValue = createPredicateValidator((value) => /^\d{3,4}$/u.test(value));

const validateCreditCardNumberValue = createPredicateValidator((value) => {
  const digits = normalizeDigits(value);
  return digits.length >= 12 && digits.length <= 19 && passesLuhnCheck(digits);
});

const validateIbanValue = createPredicateValidator((value, context = {}) => {
  const namedArgs = getContextNamedArgs(context);
  const normalized = String(value ?? '')
    .replace(/\s+/gu, '')
    .toUpperCase();

  if (namedArgs.countryCode && !normalized.startsWith(String(namedArgs.countryCode).toUpperCase())) {
    return false;
  }

  return passesIbanCheck(normalized);
});

const validateRoutingNumberValue = createPredicateValidator((value) => passesRoutingNumberCheck(value));

const validateCountryCodeValue = createPredicateValidator((value, context = {}) => {
  const { variant = 'alpha-2' } = getContextNamedArgs(context);

  if (variant === 'alpha-3') {
    return /^[A-Z]{3}$/u.test(value);
  }
  if (variant === 'numeric') {
    return /^\d{3}$/u.test(value);
  }
  return /^[A-Z]{2}$/u.test(value);
});

const validateTimeZoneValue = createPredicateValidator((value) => {
  const allowedTimeZones = getAllowedTimeZones();
  if (allowedTimeZones.size > 0) {
    return allowedTimeZones.has(value);
  }
  return /^[A-Za-z_]+(?:\/[A-Za-z0-9_+-]+)+$/u.test(value);
});

const validateIpValue = createPredicateValidator((value) => isValidIPv4Address(value) || isValidIPv6Address(value));
const validateIpv4Value = createPredicateValidator((value) => isValidIPv4Address(value));
const validateIpv6Value = createPredicateValidator((value) => isValidIPv6Address(value));

const validateMacAddressValue = createPredicateValidator((value, context = {}) => {
  const { separator = ':' } = getContextNamedArgs(context);
  const normalizedSeparator = MAC_PATTERNS[String(separator)] ? String(separator) : ':';
  return MAC_PATTERNS[normalizedSeparator].test(value);
});

const validateUrlValue = createPredicateValidator((value, context = {}) => {
  try {
    const url = new URL(value);
    const { protocol } = getContextNamedArgs(context);
    if (protocol && `${protocol}:` !== url.protocol) {
      return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
});

const validateBinaryStringValue = createPredicateValidator((value, context = {}) => {
  const { length, prefix = '0b' } = getContextNamedArgs(context);
  if (!value.startsWith(String(prefix))) {
    return false;
  }

  const body = value.slice(String(prefix).length);
  return /^[01]+$/u.test(body) && validateExactOrRangedLength(body, length);
});

const validateHexadecimalStringValue = createPredicateValidator((value, context = {}) => {
  const { casing = 'mixed', length, prefix = '0x' } = getContextNamedArgs(context);
  if (!value.startsWith(String(prefix))) {
    return false;
  }

  const body = value.slice(String(prefix).length);
  if (body.length === 0 || !validateExactOrRangedLength(body, length)) {
    return false;
  }

  if (casing === 'upper') {
    return /^[0-9A-F]+$/u.test(body);
  }
  if (casing === 'lower') {
    return /^[0-9a-f]+$/u.test(body);
  }
  return /^[0-9A-Fa-f]+$/u.test(body);
});

const validateNumericStringValue = createPredicateValidator((value, context = {}) => {
  const { allowLeadingZeros = false, length } = getContextNamedArgs(context);

  if (!/^\d+$/u.test(value) || !validateExactOrRangedLength(value, length)) {
    return false;
  }

  return allowLeadingZeros === true || value.length <= 1 || !value.startsWith('0');
});

const validateOctalStringValue = createPredicateValidator((value, context = {}) => {
  const { length, prefix = '0o' } = getContextNamedArgs(context);
  if (!value.startsWith(String(prefix))) {
    return false;
  }

  const body = value.slice(String(prefix).length);
  return /^[0-7]+$/u.test(body) && validateExactOrRangedLength(body, length);
});

const validateNanoIdValue = createPredicateValidator((value, context = {}) => {
  const { length = 21 } = getContextNamedArgs(context);
  return NANOID_REGEX.test(value) && validateExactOrRangedLength(value, length, { minimum: 1 });
});

const validateUlidValue = createPredicateValidator((value) => ULID_REGEX.test(value));

const validateUuidValue = createPredicateValidator((value, context = {}) => {
  const match = value.match(UUID_REGEX);
  if (!match || !UUID_VARIANTS.has(match[2].toLowerCase())) {
    return false;
  }

  const expectedVersion = getExpectedUuidVersion(context);
  if (!expectedVersion) {
    return true;
  }

  return match[1] === expectedVersion;
});

const validateIsbnValue = createPredicateValidator((value, context = {}) => {
  const { variant } = getContextNamedArgs(context);
  if (variant === 10) {
    return passesIsbn10Check(value);
  }
  if (variant === 13) {
    return passesIsbn13Check(value);
  }
  return passesIsbn10Check(value) || passesIsbn13Check(value);
});

const validateUpcValue = createPredicateValidator((value) => passesUpcCheck(value));

const validateImeiValue = createPredicateValidator((value) => {
  const digits = normalizeDigits(value);
  return digits.length === 15 && passesLuhnCheck(digits);
});

const validateVinValue = createPredicateValidator((value) => /^[A-HJ-NPR-Z0-9]{17}$/u.test(value));

const validateVrmValue = createPredicateValidator((value) => /^[A-Z]{2}\d{2}[A-Z]{3}$/u.test(value));

const validateAccountNumberValue = createPredicateValidator((value, context = {}) => {
  const { length } = getContextNamedArgs(context);
  return /^\d+$/u.test(value) && validateExactOrRangedLength(value, length);
});

const validatePinValue = createPredicateValidator((value, context = {}) => {
  const { length = 4 } = getContextNamedArgs(context);
  return /^\d+$/u.test(value) && validateExactOrRangedLength(value, length);
});

const validateCronValue = createPredicateValidator((value) => {
  if (CRON_NON_STANDARD_REGEX.test(value)) {
    return true;
  }

  const fields = value.trim().split(/\s+/u);
  if (fields.length !== 5 && fields.length !== 6) {
    return false;
  }

  return fields.every((field) => CRON_FIELD_REGEX.test(field));
});

function extractEnumValuesFromContext(context = {}) {
  const fieldDefinition = getFieldDefinitionFromContext(context);
  const explicitEnumValues = Array.isArray(context?.enumValues) ? context.enumValues : [];
  if (explicitEnumValues.length > 0) {
    return explicitEnumValues.map((entry) => String(entry));
  }

  const candidates = [getContextRuleSpec(context)];
  const sourceType = String(fieldDefinition?.sourceType ?? '')
    .trim()
    .toLowerCase();
  const command = String(fieldDefinition?.command ?? '')
    .trim()
    .toLowerCase();
  const params = String(fieldDefinition?.params ?? '').trim();
  const value = String(fieldDefinition?.value ?? '').trim();

  if (sourceType === 'enum' && value.length > 0) {
    candidates.push(`enum(${value.replace(/^\(|\)$/g, '').trim()})`);
    candidates.push(value);
  }
  if (command === 'datatype.enum' && params.length > 0) {
    candidates.push(`datatype.enum(${params.replace(/^\(|\)$/g, '').trim()})`);
    candidates.push(params);
  }

  for (const candidate of candidates) {
    const ruleSpec = String(candidate ?? '').trim();
    if (!ruleSpec) {
      continue;
    }
    try {
      return EnumParser.extractEnumValues(ruleSpec).map((entry) => String(entry));
    } catch {
      // Keep looking until a valid enum source is found.
    }
  }

  return [];
}

function validateEnumMemberValue(value, context = {}) {
  const enumValues = extractEnumValuesFromContext(context);
  if (enumValues.length === 0) {
    return false;
  }

  const candidate = typeof value === 'string' ? value : String(value);
  return enumValues.includes(candidate);
}

export {
  createPredicateValidator,
  createRegexValidator,
  createStringEnumValidator,
  validateAccountNumberValue,
  validateAircraftIataTypeCodeValue,
  validateAirlineIataCodeValue,
  validateAirlineRecordLocatorValue,
  validateAirlineSeatValue,
  validateAnyValue,
  validateArrayOrStringValue,
  validateArrayValue,
  validateAirportIataCodeValue,
  validateBicValue,
  validateBinaryStringValue,
  validateBooleanValue,
  validateBitcoinAddressValue,
  validateCountryCodeValue,
  validateCounterStringValue,
  validateCreditCardCvvValue,
  validateCreditCardNumberValue,
  validateCronValue,
  validateCurrencyCodeValue,
  validateCurrencyNumericCodeValue,
  validateDateValue,
  validateEmailValue,
  validateEnumMemberValue,
  validateEthereumAddressValue,
  validateExampleEmailValue,
  validateFlightNumberValue,
  validateHexadecimalStringValue,
  validateIbanValue,
  validateImeiValue,
  validateIntegerValue,
  validateIpValue,
  validateIpv4Value,
  validateIpv6Value,
  validateIsbnValue,
  validateJwtValue,
  validateLitecoinAddressValue,
  validateLiteralValue,
  validateMacAddressValue,
  validateMimeTypeValue,
  validateMongoObjectIdValue,
  validateNanoIdValue,
  validateNumberValue,
  validateNumericStringValue,
  validateObjectValue,
  validateOctalStringValue,
  validatePinValue,
  validateRoutingNumberValue,
  validateSemverValue,
  validateStringOrNumberOrBooleanValue,
  validateStringOrNumberValue,
  validateStringValue,
  validateTimeZoneValue,
  validateUlidValue,
  validateUpcValue,
  validateUrlValue,
  validateUuidValue,
  validateVinValue,
  validateVrmValue,
};
