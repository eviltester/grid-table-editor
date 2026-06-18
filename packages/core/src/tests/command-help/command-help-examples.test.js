import { Faker, faker as baseFaker } from '@faker-js/faker';
import { validateCommandHelpValue } from '../../../js/command-help/command-help-contract.js';
import {
  executeDomainKeyword,
  DOMAIN_KEYWORDS,
  DOMAIN_KEYWORD_DEFINITIONS,
  getDomainKeywordHelpByAlias,
} from '../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../js/domain/domain-keyword-parser.js';
import { KNOWN_FAKER_COMMANDS } from '../../../js/faker/faker-commands.js';
import { isForbiddenFakerCommand } from '../../../js/faker/faker-commands.js';
import { getFakerCommandHelp } from '../../../js/faker/faker-helper-keyword-definitions.js';
import { FAKER_HELPER_KEYWORD_DEFINITIONS } from '../../../js/faker/faker-helper-keyword-definitions.js';
import { FakerCommand } from '../../../js/data_generation/faker/fakerCommand.js';
import { DomainKeywordInvocationParser } from '../../../js/domain/parser/DomainKeywordInvocationParser.js';

const DOMAIN_INVOCATION_PARSER = new DomainKeywordInvocationParser();
const EXAMPLE_SEED = 1;
const EXAMPLE_REF_DATE = new Date('2026-06-18T15:55:20.000Z');
const EXAMPLE_MATH_RANDOM = 0.5;

function createExampleFaker() {
  const faker = new Faker({ locale: baseFaker.rawDefinitions });
  faker.seed(EXAMPLE_SEED);
  faker.setDefaultRefDate(EXAMPLE_REF_DATE);
  return faker;
}

function isRequiredParam(param) {
  return param?.required === true || param?.optional === false;
}

function splitTopLevelArguments(argsText = '') {
  const args = [];
  let current = '';
  let depth = 0;
  let quote = '';
  let escaping = false;

  for (const character of String(argsText || '')) {
    if (escaping) {
      current += character;
      escaping = false;
      continue;
    }

    if (quote) {
      current += character;
      if (character === '\\') {
        escaping = true;
        continue;
      }
      if (character === quote) {
        quote = '';
      }
      continue;
    }

    if (character === '"' || character === "'") {
      quote = character;
      current += character;
      continue;
    }

    if (character === '(' || character === '[' || character === '{') {
      depth += 1;
      current += character;
      continue;
    }

    if (character === ')' || character === ']' || character === '}') {
      depth = Math.max(0, depth - 1);
      current += character;
      continue;
    }

    if (character === ',' && depth === 0) {
      if (current.trim()) {
        args.push(current.trim());
      }
      current = '';
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    args.push(current.trim());
  }

  return args;
}

function getHelperExampleArgCount(functionCall) {
  const trimmed = String(functionCall || '').trim();
  const openParenIndex = trimmed.indexOf('(');
  if (openParenIndex === -1) {
    return 0;
  }

  const inner = trimmed.slice(openParenIndex + 1, -1).trim();
  if (!inner) {
    return 0;
  }

  return splitTopLevelArguments(inner).length;
}

function extractInvocationParams(functionCall) {
  const trimmed = String(functionCall || '').trim();
  const openParenIndex = trimmed.indexOf('(');
  if (openParenIndex === -1) {
    return '';
  }
  return trimmed.slice(openParenIndex);
}

function getOptionalCompanionNames(params = [], targetParam = {}) {
  const paramsByName = new Map(params.map((param) => [param.name, param]));
  const companionNames = [];

  if (targetParam?.name === 'min' && !isRequiredParam(paramsByName.get('max'))) {
    companionNames.push('max');
  }
  if (targetParam?.name === 'inputFormat' && !isRequiredParam(paramsByName.get('start'))) {
    companionNames.push('start');
  }

  return companionNames.filter(Boolean);
}

function normalizeExampleValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'bigint') {
    return {
      __type: 'bigint',
      value: value.toString(),
    };
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeExampleValue(entry));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, normalizeExampleValue(entry)]));
  }

  return value;
}

function withDeterministicMathRandom(callback) {
  const originalRandom = Math.random;
  Math.random = () => EXAMPLE_MATH_RANDOM;
  try {
    return callback();
  } finally {
    Math.random = originalRandom;
  }
}

function executeFakerExample(functionCall) {
  return withDeterministicMathRandom(() => {
    const faker = createExampleFaker();
    const command = new FakerCommand(functionCall, { unsafeFakerExpressions: true });
    const parseResult = command.parse();
    expect(parseResult.isError).toBe(false);

    const compileResult = command.compile(faker);
    expect(compileResult?.isError || false).toBe(false);

    const executionResult = command.execute(faker);
    expect(executionResult.isError).toBe(false);
    return executionResult.data;
  });
}

function executeDomainExample(functionCall) {
  return withDeterministicMathRandom(() => {
    const faker = createExampleFaker();
    const parsed = parseKeywordInvocation(functionCall);
    expect(parsed.errors || []).toEqual([]);
    return executeDomainKeyword(parsed.keyword, {
      faker,
      args: parsed.args,
      runStartedAt: EXAMPLE_REF_DATE,
    });
  });
}

function buildFakerCommandCases() {
  const domainDefinitionByKeyword = new Map(
    DOMAIN_KEYWORD_DEFINITIONS.map((definition) => [definition.keyword, definition])
  );

  return KNOWN_FAKER_COMMANDS.filter((command) => command !== 'RegEx').map((command) => {
    const help = getFakerCommandHelp(command);
    const sourceDefinition =
      FAKER_HELPER_KEYWORD_DEFINITIONS[command] || domainDefinitionByKeyword.get(command) || null;

    return {
      catalog: 'faker',
      command,
      help,
      sourceDefinition,
      sourceValidator: sourceDefinition?.validator || sourceDefinition?.help?.validator,
      params: Array.isArray(help?.params) ? help.params : [],
    };
  });
}

function buildDomainCommandCases() {
  const definitionByKeyword = new Map(DOMAIN_KEYWORD_DEFINITIONS.map((definition) => [definition.keyword, definition]));

  return DOMAIN_KEYWORDS.map((entry) => ({
    catalog: 'domain',
    command: entry.keyword,
    help: getDomainKeywordHelpByAlias(entry.keyword),
    sourceDefinition: definitionByKeyword.get(entry.keyword) || null,
    sourceValidator: definitionByKeyword.get(entry.keyword)?.help?.validator,
    params: Array.isArray(entry.help?.args) ? entry.help.args : [],
  }));
}

function buildValidationContext(entry, usageExample) {
  const fieldDefinition = {
    sourceType: entry.catalog,
    command: entry.command,
    params: extractInvocationParams(usageExample.functionCall),
    ruleSpec: usageExample.functionCall,
  };

  const context = {
    catalog: entry.catalog,
    command: entry.command,
    functionCall: usageExample.functionCall,
    ruleSpec: usageExample.functionCall,
    fieldDefinition,
    help: entry.help,
    sourceDefinition: entry.sourceDefinition,
  };

  if (!entry.command.startsWith('helpers.')) {
    const parsed = parseKeywordInvocation(usageExample.functionCall);
    expect(parsed.errors || []).toEqual([]);
    context.args = parsed.args;
    context.parsedArgs = parsed.args;
  }

  return context;
}

describe('command help usage examples', () => {
  const fakerCases = buildFakerCommandCases();
  const domainCases = buildDomainCommandCases();
  const commandCases = [...fakerCases, ...domainCases];

  test('all commands expose at least one structured usage example', () => {
    const missing = commandCases
      .filter((entry) => !Array.isArray(entry.help?.usageExamples) || entry.help.usageExamples.length === 0)
      .map((entry) => `${entry.catalog}:${entry.command}`);

    expect(missing).toEqual([]);
  });

  test('commands expose at least one usage example per optional param, plus a zero-arg example when all params are optional', () => {
    const missingCoverage = commandCases
      .map((entry) => {
        const optionalCount = entry.params.filter((param) => !isRequiredParam(param)).length;
        const allParamsOptional = entry.params.length > 0 && optionalCount === entry.params.length;
        const minimumExampleCount = Math.max(1, optionalCount + (allParamsOptional ? 1 : 0));
        return {
          ...entry,
          optionalCount,
          minimumExampleCount,
        };
      })
      .filter((entry) => (entry.help?.usageExamples?.length || 0) < entry.minimumExampleCount)
      .map((entry) => ({
        command: `${entry.catalog}:${entry.command}`,
        optionalParamCount: entry.optionalCount,
        minimumExampleCount: entry.minimumExampleCount,
        usageExampleCount: entry.help?.usageExamples?.length || 0,
      }));

    expect(missingCoverage).toEqual([]);
  });

  test('each optional parameter has a focused usage example and all-optional commands include a zero-arg example', () => {
    const failures = commandCases.flatMap((entry) => {
      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      const optionalParams = entry.params
        .map((param, index) => ({ ...param, index }))
        .filter((param) => !isRequiredParam(param));
      const requiredParamNames = new Set(entry.params.filter(isRequiredParam).map((param) => param.name));
      const lastRequiredIndex = entry.params.reduce(
        (current, param, index) => (isRequiredParam(param) ? index : current),
        -1
      );
      const entryFailures = [];

      if (entry.params.length > 0 && optionalParams.length === entry.params.length) {
        const hasZeroArgExample = usageExamples.some((usageExample) => {
          if (entry.command.startsWith('helpers.')) {
            return getHelperExampleArgCount(usageExample.functionCall) === 0;
          }
          const parsed = DOMAIN_INVOCATION_PARSER.parse(usageExample.functionCall);
          return parsed.ok && (parsed.arguments || []).length === 0;
        });

        if (!hasZeroArgExample) {
          entryFailures.push({
            command: `${entry.catalog}:${entry.command}`,
            reason: 'missing zero-arg example for all-optional params',
          });
        }
      }

      for (const optionalParam of optionalParams) {
        if (entry.command.startsWith('helpers.')) {
          const requiredArgCount = Math.max(optionalParam.index + 1, lastRequiredIndex + 1);
          const hasFocusedExample = usageExamples.some(
            (usageExample) => getHelperExampleArgCount(usageExample.functionCall) === requiredArgCount
          );

          if (!hasFocusedExample) {
            entryFailures.push({
              command: `${entry.catalog}:${entry.command}`,
              param: optionalParam.name,
              reason: `missing focused positional example with ${requiredArgCount} argument(s)`,
            });
          }

          continue;
        }

        const hasFocusedExample = usageExamples.some((usageExample) => {
          const parsed = DOMAIN_INVOCATION_PARSER.parse(usageExample.functionCall);
          if (!parsed.ok || parsed.keyword !== entry.command) {
            return false;
          }

          const namedArgs = (parsed.arguments || [])
            .filter((argument) => argument.kind === 'named')
            .map((arg) => arg.name);
          if (!namedArgs.includes(optionalParam.name)) {
            return false;
          }

          const optionalArgNames = namedArgs.filter((name) => !requiredParamNames.has(name));
          const allowedOptionalArgNames = new Set([
            optionalParam.name,
            ...getOptionalCompanionNames(entry.params, optionalParam),
          ]);

          return optionalArgNames.every((name) => allowedOptionalArgNames.has(name));
        });

        if (!hasFocusedExample) {
          entryFailures.push({
            command: `${entry.catalog}:${entry.command}`,
            param: optionalParam.name,
            reason: 'missing focused named example for optional param',
          });
        }
      }

      return entryFailures;
    });

    expect(failures).toEqual([]);
  });

  test('all structured usage examples include functionCall, sampleReturnValue, and description', () => {
    const invalidExamples = commandCases.flatMap((entry) => {
      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      return usageExamples
        .map((usageExample, index) => {
          const hasFunctionCall =
            typeof usageExample?.functionCall === 'string' && usageExample.functionCall.trim().length > 0;
          const hasDescription =
            typeof usageExample?.description === 'string' && usageExample.description.trim().length > 0;
          const hasSampleReturnValue = Object.prototype.hasOwnProperty.call(usageExample || {}, 'sampleReturnValue');
          if (
            hasFunctionCall &&
            hasDescription &&
            hasSampleReturnValue &&
            typeof usageExample.sampleReturnValue !== 'undefined'
          ) {
            return null;
          }
          return {
            command: `${entry.catalog}:${entry.command}`,
            exampleIndex: index + 1,
            usageExample,
          };
        })
        .filter(Boolean);
    });

    expect(invalidExamples).toEqual([]);
  });

  test('runtime command help objects do not expose legacy example fields', () => {
    const legacyFieldFailures = commandCases
      .map((entry) => ({
        command: `${entry.catalog}:${entry.command}`,
        legacyFields: ['example', 'examples', 'exampleReturnValues'].filter((fieldName) =>
          Object.prototype.hasOwnProperty.call(entry.help || {}, fieldName)
        ),
      }))
      .filter((entry) => entry.legacyFields.length > 0);

    expect(legacyFieldFailures).toEqual([]);
  });

  test('non-helper command help examples use domain named-parameter syntax', () => {
    const invalidExamples = commandCases.flatMap((entry) => {
      if (entry.command.startsWith('helpers.')) {
        return [];
      }

      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      return usageExamples
        .map((usageExample, index) => {
          const parsed = DOMAIN_INVOCATION_PARSER.parse(usageExample.functionCall);
          const hasOnlyNamedArgs = (parsed.arguments || []).every((argument) => argument.kind === 'named');
          if (parsed.ok && parsed.keyword === entry.command && hasOnlyNamedArgs) {
            return null;
          }
          return {
            command: `${entry.catalog}:${entry.command}`,
            exampleIndex: index + 1,
            functionCall: usageExample.functionCall,
          };
        })
        .filter(Boolean);
    });

    expect(invalidExamples).toEqual([]);
  });

  test('faker-style usage examples remain scoped to helpers only', () => {
    const invalidExamples = fakerCases.flatMap((entry) => {
      const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
      return usageExamples
        .filter((usageExample) => {
          const functionCall = String(usageExample.functionCall || '').trim();
          return functionCall !== entry.command && !functionCall.startsWith(`${entry.command}(`);
        })
        .map((usageExample) => ({
          command: entry.command,
          functionCall: usageExample.functionCall,
        }));
    });

    expect(invalidExamples).toEqual([]);
  });

  for (const entry of commandCases) {
    if (entry.catalog === 'faker' && isForbiddenFakerCommand(entry.command)) {
      continue;
    }
    const usageExamples = Array.isArray(entry.help?.usageExamples) ? entry.help.usageExamples : [];
    for (const [index, usageExample] of usageExamples.entries()) {
      test(`${entry.catalog}:${entry.command} example ${index + 1} executes and validates`, () => {
        const validator = entry.sourceValidator;
        expect(validator).toBeDefined();
        expect(typeof validator).toBe('function');
        const validationContext = buildValidationContext(entry, usageExample);

        const actualValue =
          entry.catalog === 'faker' && entry.command.startsWith('helpers.')
            ? executeFakerExample(usageExample.functionCall)
            : executeDomainExample(usageExample.functionCall);

        expect(validateCommandHelpValue(validator, actualValue, validationContext)).toBe(true);
        expect(validateCommandHelpValue(validator, usageExample.sampleReturnValue, validationContext)).toBe(true);
        expect(normalizeExampleValue(usageExample.sampleReturnValue)).toEqual(normalizeExampleValue(actualValue));
      });
    }
  }
});
