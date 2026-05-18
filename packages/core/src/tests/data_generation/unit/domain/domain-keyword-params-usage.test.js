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

  if (key === 'location.latitude.min' || key === 'location.longitude.min') return -10;
  if (key === 'location.latitude.max' || key === 'location.longitude.max') return 10;
  if (key === 'location.latitude.precision' || key === 'location.longitude.precision') return 2;

  if (key === 'number.int.min') return 1;
  if (key === 'number.int.max') return 10;
  if (key === 'number.int.multipleOf') return 1;

  if (key === 'commerce.price.dec') return 2;
  if (key === 'commerce.price.min') return 10;
  if (key === 'commerce.price.max') return 100;

  if (key === 'helpers.arrayElement.array') return ['a', 'b', 'c'];
  if (key === 'helpers.arrayElements.array') return ['a', 'b', 'c'];
  if (key === 'helpers.weightedArrayElement.array') {
    return [
      { value: 'a', weight: 1 },
      { value: 'b', weight: 1 },
    ];
  }
  if (key === 'helpers.mustache.str') return 'hello {{name}}';
  if (key === 'helpers.mustache.data') return ['name', 'value'];
  if (key === 'helpers.fromRegExp.expression') return '[a-z]{5}';

  if (argName === 'min') return 1;
  if (argName === 'max') return 5;
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
  if (keyword.keyword === 'helpers.shuffle') {
    args[0] = ['a', 'b', 'c'];
  }
  if (keyword.keyword === 'system.fileExt') {
    args[0] = 'image/png';
  }
  return args;
}

function expectsRuntimeRejection(keywordName, argName) {
  // TODO(domain-args): helpers.maybe callback cannot be safely represented in the current scalar/array-only arg schema.
  if (keywordName === 'helpers.maybe' && argName === 'callback') return false;
  // TODO(domain-args): helpers.maybe requires a callback function first; probability-only invocation is invalid with current schema.
  if (keywordName === 'helpers.maybe' && argName === 'probability') return true;
  // TODO(domain-args): helpers.multiple method currently expects a function callback, which is intentionally unsupported.
  if (keywordName === 'helpers.multiple' && argName === 'method') return true;
  // TODO(domain-args): system.fileExt currently forwards mimeType as positional arg; faker expects a different shape.
  if (keywordName === 'system.fileExt' && argName === 'mimeType') return true;
  return false;
}

function shouldSkipRuntimeExecution(keywordName, argName) {
  // TODO(domain-args): helpers.maybe callback should eventually be represented as a non-executable schema arg.
  if (keywordName === 'helpers.maybe' && argName === 'callback') return true;
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
