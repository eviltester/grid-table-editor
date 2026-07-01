const BUILT_IN_TYPE_TOKENS = new Set([
  'bigint',
  'string',
  'integer',
  'number',
  'date',
  'regexp',
  'boolean',
  'array',
  'object',
]);

function splitTypeTokens(typeName) {
  return String(typeName || '')
    .split('|')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function unquoteLiteralToken(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function getStringLiteralTypeSamples(types) {
  return types
    .filter((entry) => !BUILT_IN_TYPE_TOKENS.has(entry) && !/^[+-]?\d+(\.\d+)?$/.test(entry))
    .map(unquoteLiteralToken);
}

function sampleValueForType(typeName, { arraySample = ['x', 'y'] } = {}) {
  const types = splitTypeTokens(typeName);
  const numericLiterals = types.filter((entry) => /^[+-]?\d+(\.\d+)?$/.test(entry)).map((entry) => Number(entry));
  const stringLiterals = getStringLiteralTypeSamples(types);

  if (numericLiterals.length === types.length && numericLiterals.length > 0) {
    return numericLiterals[0];
  }
  if (stringLiterals.length > 0) return stringLiterals[0];

  if (types.includes('bigint')) return 7;
  if (types.includes('integer')) return 7;
  if (types.includes('number')) return 7;
  if (types.includes('regexp')) return '[A-Z]';
  if (types.includes('boolean')) return true;
  if (types.includes('array')) return arraySample;
  if (types.includes('object')) return { key: 'value' };
  return 'sample';
}

function sampleValueForKeywordArg(keywordName, argName, typeName) {
  const key = `${keywordName}.${argName}`;
  const type = String(typeName || '');

  if (key === 'date.between.from' || key === 'date.betweens.from') return 1577836800000;
  if (key === 'date.between.to' || key === 'date.betweens.to') return 1609372800000;
  if (key === 'date.betweens.count') return 3;
  if (key === 'date.birthdate.min') return 18;
  if (key === 'date.birthdate.max') return 65;
  if (key === 'date.birthdate.mode') return 'age';
  if (key === 'datatype.boolean.probability') return 0.5;
  if (key === 'airline.flightNumber.length') return 4;
  if (key === 'image.dataUri.type') return 'svg-base64';
  if (key === 'internet.httpStatusCode.types') return ['success'];
  if (key === 'location.zipCode.state') return 'CA';
  if (key === 'location.zipCode.format') return '#####';
  if (key === 'system.networkInterface.interfaceType') return 'en';
  if (key === 'system.networkInterface.interfaceSchema') return 'mac';
  if (key === 'location.latitude.min' || key === 'location.longitude.min') return -10;
  if (key === 'location.latitude.max' || key === 'location.longitude.max') return 10;
  if (key === 'location.latitude.precision' || key === 'location.longitude.precision') return 2;
  if (key === 'number.int.min' || key === 'number.bigInt.min') return 1;
  if (key === 'number.int.max' || key === 'number.bigInt.max') return 10;
  if (key === 'number.int.multipleOf' || key === 'number.bigInt.multipleOf') return 1;
  if (key === 'commerce.price.dec') return 2;
  if (key === 'commerce.price.min') return 10;
  if (key === 'commerce.price.max') return 100;
  if (key === 'finance.iban.countryCode') return 'GB';
  if (key === 'airline.seat.aircraftType') return 'narrowbody';
  if (key === 'internet.emoji.types') return ['smiley'];
  if (key === 'internet.jwt.header') return { alg: 'HS256', typ: 'JWT' };
  if (key === 'internet.jwt.payload') return { iss: 'Acme' };
  if (key === 'internet.ipv4.cidrBlock') return '192.168.0.0/24';
  if (key === 'internet.ipv4.network') return 'private-a';
  if (key === 'finance.bitcoinAddress.network') return 'testnet';
  if (key === 'internet.password.pattern') return '[A-Za-z0-9]';
  if (key === 'phone.number.style') return 'human';
  if (key === 'string.alpha.casing') return 'lower';
  if (key === 'color.rgb.format') return 'hex';
  if (key === 'color.cmyk.format') return 'css';
  if (key === 'color.hsl.format') return 'css';
  if (key === 'color.hwb.format') return 'css';
  if (key === 'color.lab.format') return 'css';
  if (key === 'color.lch.format') return 'css';

  if (argName === 'from') return 1577836800000;
  if (argName === 'to') return 1580428800000;
  if (argName === 'refDate') return 1716110400000;
  if (argName === 'version') return 7;
  if (argName === 'count') return 3;
  if (argName === 'min') return 1;
  if (argName === 'max') return 10;
  if (argName === 'length') return 8;
  if (argName === 'lengthMin') return 3;
  if (argName === 'lengthMax') return 6;
  if (argName === 'precision') return 2;
  if (argName === 'dec') return 2;
  if (argName === 'multipleOf') return 1;
  if (key === 'commerce.upc.prefix') return '01234';
  if (argName === 'prefix') return 'pre';
  if (argName === 'symbol') return '$';
  if (argName === 'separator') return '-';
  if (argName === 'protocol') return 'https';
  if (argName === 'countryCode') return 'GB';
  if (argName === 'mimeType') return 'image/png';
  if (argName === 'cidrBlock') return '192.168.0.0/24';
  if (argName === 'types') return ['smiley'];
  if (argName === 'header') return { alg: 'HS256', typ: 'JWT' };
  if (argName === 'payload') return { iss: 'Acme' };
  if (argName === 'pattern') return '[A-Z]';
  if (argName === 'mode') return 'age';
  if (argName === 'strategy') return 'any-length';
  if (argName === 'sex') return 'female';
  if (argName === 'style') return 'human';
  if (argName === 'exclude') return ['x', 'y'];

  if (type.includes('integer')) return 7;
  if (type.includes('number')) return 7;
  if (type.includes('regexp')) return '[A-Z]';
  if (type.includes('boolean')) return true;
  if (type.includes('array')) return ['x', 'y'];
  return sampleValueForType(type);
}

function valueToInvocationLiteral(value) {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }
  throw new Error(`Unsupported invocation literal value: ${String(value)}`);
}

export { sampleValueForKeywordArg, sampleValueForType, valueToInvocationLiteral };
