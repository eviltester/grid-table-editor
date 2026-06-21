import { Faker, faker as baseFaker } from '@faker-js/faker';
import {
  executeDomainKeyword,
  DOMAIN_KEYWORDS,
  DOMAIN_KEYWORD_DEFINITIONS,
  getDomainKeywordHelpByAlias,
} from '../../../js/domain/domain-keywords.js';
import { parseKeywordInvocation } from '../../../js/domain/domain-keyword-parser.js';
import { KNOWN_FAKER_COMMANDS, isForbiddenFakerCommand } from '../../../js/faker/faker-commands.js';
import {
  getFakerCommandHelp,
  FAKER_HELPER_KEYWORD_DEFINITIONS,
} from '../../../js/faker/faker-helper-keyword-definitions.js';
import { FakerCommand } from '../../../js/data_generation/faker/fakerCommand.js';
import { DomainKeywordInvocationParser } from '../../../js/domain/parser/DomainKeywordInvocationParser.js';

const DOMAIN_INVOCATION_PARSER = new DomainKeywordInvocationParser();
const SEEDED_EXAMPLE_FAKER_SEED = 1;
const SEEDED_EXAMPLE_REF_DATE = new Date('2026-06-18T15:55:20.000Z');
const SEEDED_EXAMPLE_MATH_RANDOM = 0.5;

function createExampleFaker() {
  const faker = new Faker({ locale: baseFaker.rawDefinitions });
  faker.seed(SEEDED_EXAMPLE_FAKER_SEED);
  faker.setDefaultRefDate(SEEDED_EXAMPLE_REF_DATE);
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
  Math.random = () => SEEDED_EXAMPLE_MATH_RANDOM;
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
      runStartedAt: SEEDED_EXAMPLE_REF_DATE,
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

function buildCommandCases() {
  const fakerCases = buildFakerCommandCases();
  const domainCases = buildDomainCommandCases();
  return {
    fakerCases,
    domainCases,
    commandCases: [...fakerCases, ...domainCases],
  };
}

export {
  DOMAIN_INVOCATION_PARSER,
  SEEDED_EXAMPLE_FAKER_SEED,
  SEEDED_EXAMPLE_MATH_RANDOM,
  SEEDED_EXAMPLE_REF_DATE,
  buildCommandCases,
  buildValidationContext,
  executeDomainExample,
  executeFakerExample,
  getHelperExampleArgCount,
  getOptionalCompanionNames,
  isForbiddenFakerCommand,
  isRequiredParam,
  normalizeExampleValue,
};
