import { DOMAIN_KEYWORDS, executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { faker } from '@faker-js/faker';

function setDeepMethod(root, target, fn) {
  const parts = String(target || '')
    .split('.')
    .filter((part) => part.length > 0);

  let node = root;
  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    node[part] = node[part] || {};
    node = node[part];
  }

  node[parts[parts.length - 1]] = fn;
}

function createResultForPath(resultPath) {
  const path = String(resultPath || '')
    .split('.')
    .filter((segment) => segment.length > 0);
  if (path.length === 0) {
    return 'ok';
  }

  const root = {};
  let node = root;
  for (let index = 0; index < path.length - 1; index += 1) {
    node[path[index]] = {};
    node = node[path[index]];
  }
  node[path[path.length - 1]] = 'ok';
  return root;
}

function sampleValueForType(type) {
  const allowed = String(type || '')
    .split('|')
    .map((entry) => entry.trim());

  if (allowed.includes('number')) {
    return 7;
  }
  if (allowed.includes('boolean')) {
    return true;
  }
  if (allowed.includes('array')) {
    return ['a', 'b'];
  }
  return 'sample';
}

function sampleValueForKeywordArg(keywordName, argName, typeName) {
  const key = `${keywordName}.${argName}`;
  const type = String(typeName || '');

  if (key === 'date.between.from' || key === 'date.betweens.from')
    return new Date('2020-01-01T00:00:00.000Z').getTime();
  if (key === 'date.between.to' || key === 'date.betweens.to') return new Date('2020-12-31T00:00:00.000Z').getTime();
  if (key === 'date.betweens.count') return 3;
  if (key === 'date.birthdate.min') return 18;
  if (key === 'date.birthdate.max') return 65;
  if (key === 'date.birthdate.mode') return 'age';

  if (key === 'location.latitude.min' || key === 'location.longitude.min') return -10;
  if (key === 'location.latitude.max' || key === 'location.longitude.max') return 10;
  if (key === 'location.latitude.precision' || key === 'location.longitude.precision') return 2;

  if (key === 'number.int.min') return 1;
  if (key === 'number.int.max') return 10;
  if (key === 'number.int.multipleOf') return 1;

  if (key === 'commerce.price.dec') return 2;
  if (key === 'commerce.price.min') return 10;
  if (key === 'commerce.price.max') return 100;
  if (key === 'finance.iban.countryCode') return 'GB';

  if (key === 'airline.seat.aircraftType') return 'narrowbody';
  if (key === 'internet.emoji.types') return ['smiley'];
  if (key === 'internet.ipv4.cidrBlock') return '192.168.0.0/24';
  if (key === 'internet.ipv4.network') return 'private';
  if (key === 'internet.password.pattern') return '[A-Za-z0-9]';
  if (key === 'phone.number.style') return 'human';
  if (key === 'string.alpha.casing') return 'lower';
  if (key === 'color.rgb.format') return 'hex';
  if (key === 'color.cmyk.format') return 'css';
  if (key === 'color.hsl.format') return 'css';
  if (key === 'color.hwb.format') return 'css';
  if (key === 'color.lab.format') return 'css';
  if (key === 'color.lch.format') return 'css';

  if (argName === 'min') return 1;
  if (argName === 'max') return 10;
  if (argName === 'count') return 3;
  if (argName === 'length') return 5;
  if (argName === 'lengthMin') return 3;
  if (argName === 'lengthMax') return 6;
  if (argName === 'precision') return 2;
  if (argName === 'dec') return 2;
  if (argName === 'multipleOf') return 1;
  if (argName === 'prefix') return 'pre';
  if (argName === 'symbol') return '$';
  if (argName === 'refDate') return Date.now();
  if (argName === 'from') return Date.now() - 86400000;
  if (argName === 'to') return Date.now() + 86400000;
  if (argName === 'exclude') return ['x', 'y'];

  if (type.includes('number')) return 7;
  if (type.includes('boolean')) return true;
  if (type.includes('array')) return ['a', 'b'];
  return 'sample';
}

function buildValidArgs(keyword) {
  const args = new Array(keyword.help.args.length).fill(undefined);
  for (let index = 0; index < keyword.help.args.length; index += 1) {
    const argSpec = keyword.help.args[index];
    if (argSpec.required) {
      args[index] = sampleValueForType(argSpec.type);
    }
  }
  return args;
}

function applyKeywordExecutionDefaults(keyword, args) {
  if (keyword.keyword === 'date.between') {
    args[0] = new Date('2020-01-01T00:00:00.000Z').getTime();
    args[1] = new Date('2020-12-31T00:00:00.000Z').getTime();
  }
  if (keyword.keyword === 'date.betweens') {
    args[0] = 2;
    args[1] = new Date('2020-01-01T00:00:00.000Z').getTime();
    args[2] = new Date('2020-12-31T00:00:00.000Z').getTime();
  }
  if (keyword.keyword === 'date.birthdate') {
    args[1] = 65; // max
    args[2] = 18; // min
    args[3] = 'age'; // mode
  }
  if (keyword.keyword === 'internet.ipv4') {
    args[0] = '192.168.0.0/24'; // cidrBlock
  }
  if (keyword.keyword === 'system.fileExt') {
    args[0] = 'image/png';
  }
  return args;
}

function expectsRuntimeRejection(keywordName, argName) {
  // TODO(domain-args): system.fileExt currently forwards mimeType as positional arg; faker expects a different shape.
  if (keywordName === 'system.fileExt' && argName === 'mimeType') return true;
  // TODO(domain-args): faker internet.password expects a RegExp for pattern, while current domain arg schema is string-only.
  if (keywordName === 'internet.password' && argName === 'pattern') return true;
  return false;
}

function shouldSkipRuntimeExecution(keywordName, argName) {
  void keywordName;
  void argName;
  return false;
}

describe('domain keyword parameter usage', () => {
  const fakerKeywordsWithArgs = DOMAIN_KEYWORDS.filter(
    (keyword) => keyword.delegate.type === 'faker' && Array.isArray(keyword.help.args) && keyword.help.args.length > 0
  );

  for (const keyword of fakerKeywordsWithArgs) {
    for (let argIndex = 0; argIndex < keyword.help.args.length; argIndex += 1) {
      const argSpec = keyword.help.args[argIndex];

      test(`${keyword.keyword} uses parameter "${argSpec.name}"`, () => {
        const calls = [];
        const faker = {};

        setDeepMethod(faker, keyword.delegate.target, (...receivedArgs) => {
          calls.push(receivedArgs);
          return createResultForPath(keyword.delegate.resultPath);
        });

        const args = buildValidArgs(keyword);
        const sample = sampleValueForType(argSpec.type);
        args[argIndex] = sample;

        executeDomainKeyword(keyword.keyword, { faker, args });

        expect(calls.length).toBe(1);
        const receivedArgs = calls[0];

        if (keyword.delegate.argTransform === 'optionsFromHelpArgs') {
          expect(receivedArgs.length).toBe(1);
          expect(receivedArgs[0]).toEqual(expect.objectContaining({ [argSpec.name]: sample }));
        } else {
          expect(receivedArgs[argIndex]).toEqual(sample);
        }
      });

      test(`${keyword.keyword} executes with parameter "${argSpec.name}" against faker`, () => {
        const args = applyKeywordExecutionDefaults(keyword, buildValidArgs(keyword));
        args[argIndex] = sampleValueForKeywordArg(keyword.keyword, argSpec.name, argSpec.type);

        if (shouldSkipRuntimeExecution(keyword.keyword, argSpec.name)) {
          return;
        }

        if (expectsRuntimeRejection(keyword.keyword, argSpec.name)) {
          expect(() => executeDomainKeyword(keyword.keyword, { faker, args })).toThrow();
          return;
        }

        expect(() => executeDomainKeyword(keyword.keyword, { faker, args })).not.toThrow();
        const result = executeDomainKeyword(keyword.keyword, { faker, args });
        expect(result).not.toBeUndefined();
      });
    }
  }
});
