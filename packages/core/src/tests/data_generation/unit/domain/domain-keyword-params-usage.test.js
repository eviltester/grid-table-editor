import { DOMAIN_KEYWORDS, executeDomainKeyword } from '../../../../../js/domain/domain-keywords.js';
import { faker } from '@faker-js/faker';
import { assertDomainKeywordResult } from './domain-result-assertions.test-helper.js';
import { sampleValueForKeywordArg, sampleValueForType } from './domain-keyword-sample-values.test-helper.js';

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

function expectedDelegatedArgValue(argSpec, sample) {
  if (
    String(argSpec?.type || '')
      .split('|')
      .map((entry) => entry.trim())
      .includes('regexp')
  ) {
    return new RegExp(sample);
  }
  return sample;
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

function expectedLoremCountArgs(argName, sample) {
  if (argName === 'separator') {
    return [undefined, sample];
  }
  if (argName === 'max' || /CountMax$/.test(argName)) {
    return [{ min: 1, max: sample }];
  }
  if (argName === 'min' || /CountMin$/.test(argName) || /Count$/.test(argName)) {
    return [sample];
  }
  return [];
}

function expectsRuntimeRejection(keywordName, argName) {
  void keywordName;
  void argName;
  return false;
}

function shouldSkipRuntimeExecution(argSpec) {
  return argSpec?.usageExampleSupported === false;
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

        const args = applyKeywordExecutionDefaults(keyword, buildValidArgs(keyword));
        const sample = sampleValueForKeywordArg(keyword.keyword, argSpec.name, argSpec.type);
        args[argIndex] = sample;

        executeDomainKeyword(keyword.keyword, { faker, args });

        expect(calls.length).toBe(1);
        const receivedArgs = calls[0];

        if (keyword.delegate.argTransform === 'optionsFromHelpArgs') {
          expect(receivedArgs.length).toBe(1);
          expect(receivedArgs[0]).toEqual(
            expect.objectContaining({ [argSpec.name]: expectedDelegatedArgValue(argSpec, sample) })
          );
        } else if (keyword.delegate.argTransform === 'loremCountFromHelpArgs') {
          expect(receivedArgs).toEqual(expectedLoremCountArgs(argSpec.name, sample));
        } else {
          expect(receivedArgs[argIndex]).toEqual(sample);
        }
      });

      test(`${keyword.keyword} executes with parameter "${argSpec.name}" against faker`, () => {
        const args = applyKeywordExecutionDefaults(keyword, buildValidArgs(keyword));
        args[argIndex] = sampleValueForKeywordArg(keyword.keyword, argSpec.name, argSpec.type);

        if (shouldSkipRuntimeExecution(argSpec)) {
          return;
        }

        if (expectsRuntimeRejection(keyword.keyword, argSpec.name)) {
          expect(() => executeDomainKeyword(keyword.keyword, { faker, args })).toThrow();
          return;
        }

        let result;
        expect(() => {
          result = executeDomainKeyword(keyword.keyword, { faker, args });
        }).not.toThrow();
        assertDomainKeywordResult(keyword, result);
      });
    }
  }
});
