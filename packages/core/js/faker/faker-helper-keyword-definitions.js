import { getDomainKeywordHelpByAlias } from '../domain/domain-keywords.js';
import { normalizeUsageExamples } from '../command-help/command-help-contract.js';
import {
  validateAnyValue,
  validateArrayValue,
  validateNumberValue,
  validateStringValue,
} from '../command-help/command-help-validators.js';

const FAKER_HELPERS_DOCS_URL = 'https://fakerjs.dev/api/helpers';

// Faker helper definitions live here because helpers.* remains outside the domain keyword abstraction.
// These definitions are the source of truth for helper command registration, params, examples, and help metadata.
const FAKER_HELPER_KEYWORD_DEFINITIONS = {
  'helpers.fake': {
    summary: 'Interpolates faker template placeholders inside a string and returns the rendered result.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateStringValue,
    returnType: 'string',
    params: [
      {
        name: 'pattern',
        optional: false,
        type: 'string',
        description: 'Template string containing faker placeholders such as {{person.firstName}} or {{location.city}}.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")',
        sampleReturnValue: 'Hi, my name is Aaliyah Bosco!',
        description: 'Shows helpers.fake in use.',
      },
    ],
  },
  'helpers.mustache': {
    summary: 'Replaces {{placeholder}} tokens in a string using values from the supplied data object.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateStringValue,
    returnType: 'string',
    params: [
      {
        name: 'text',
        optional: false,
        type: 'string',
        description: 'Template text containing mustache placeholders such as {{name}}.',
      },
      {
        name: 'data',
        optional: false,
        type: 'object',
        description: 'Object that provides replacement values for the placeholders used in the text.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.mustache("Hello {{name}}", { name: "Ada" })',
        sampleReturnValue: 'Hello Ada',
        description: 'Shows helpers.mustache in use.',
      },
    ],
  },
  'helpers.fromRegExp': {
    summary: 'Generates a string that matches the supplied regular-expression-style pattern.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateStringValue,
    returnType: 'string',
    params: [
      {
        name: 'pattern',
        optional: false,
        type: 'string | RegExp',
        description: 'Regular expression, or regex-like string, used to generate matching output.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.fromRegExp("[A-Z]{2}[0-9]{2}")',
        sampleReturnValue: 'KS03',
        description: 'Shows helpers.fromRegExp in use.',
      },
    ],
  },
  'helpers.maybe': {
    summary: 'Calls a callback and returns its value only when faker decides the optional value should be present.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateAnyValue,
    returnType: 'unknown',
    params: [
      {
        name: 'callback',
        optional: false,
        type: '() => unknown',
        description: 'Callback used to generate the value when the optional branch is chosen.',
      },
      {
        name: 'options',
        optional: true,
        type: 'object',
        description: 'Optional configuration controlling probability and fallback behavior.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.maybe(() => "enabled")',
        sampleReturnValue: 'enabled',
        description: 'Shows helpers.maybe using only the callback argument.',
      },
      {
        functionCall: 'helpers.maybe(() => "enabled", { probability: 1 })',
        sampleReturnValue: 'enabled',
        description: 'Shows helpers.maybe forcing the callback branch with an options object.',
      },
    ],
  },
  'helpers.arrayElement': {
    summary: 'Returns one random element from the supplied array.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateAnyValue,
    returnType: 'unknown',
    params: [
      {
        name: 'array',
        optional: false,
        type: 'array',
        description: 'Array of candidate values to choose from.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.arrayElement(["A", "B", "C"])',
        sampleReturnValue: 'B',
        description: 'Shows helpers.arrayElement in use.',
      },
    ],
  },
  'helpers.objectKey': {
    summary: 'Returns one random key from the supplied object.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateStringValue,
    returnType: 'string',
    params: [
      {
        name: 'object',
        optional: false,
        type: 'object',
        description: 'Object whose enumerable keys are used as candidate values.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.objectKey({ red: "#f00", blue: "#00f" })',
        sampleReturnValue: 'red',
        description: 'Shows helpers.objectKey in use.',
      },
    ],
  },
  'helpers.objectValue': {
    summary: 'Returns one random value from the supplied object.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateAnyValue,
    returnType: 'unknown',
    params: [
      {
        name: 'object',
        optional: false,
        type: 'object',
        description: 'Object whose enumerable values are used as candidate values.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.objectValue({ red: "#f00", blue: "#00f" })',
        sampleReturnValue: '#f00',
        description: 'Shows helpers.objectValue in use.',
      },
    ],
  },
  'helpers.objectEntry': {
    summary: 'Returns one random [key, value] entry from the supplied object.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateArrayValue,
    returnType: 'array',
    params: [
      {
        name: 'object',
        optional: false,
        type: 'object',
        description: 'Object whose enumerable entries are used as candidate values.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.objectEntry({ red: "#f00", blue: "#00f" })',
        sampleReturnValue: ['red', '#f00'],
        description: 'Shows helpers.objectEntry in use.',
      },
    ],
  },
  'helpers.enumValue': {
    summary: 'Returns one random value from the supplied enum-like object.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateAnyValue,
    returnType: 'unknown',
    params: [
      {
        name: 'enumObject',
        optional: false,
        type: 'object',
        description: 'Enum-like object to sample from while ignoring numeric reverse-mapping keys.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.enumValue({ Pending: "pending", Active: "active" })',
        sampleReturnValue: 'pending',
        description: 'Shows helpers.enumValue in use.',
      },
    ],
  },
  'helpers.slugify': {
    summary: 'Converts a string into a URL-friendly slug.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateStringValue,
    returnType: 'string',
    params: [
      {
        name: 'string',
        optional: true,
        type: 'string',
        description: 'Input text to normalize into a lowercase, hyphen-separated slug.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.slugify("Hello World 2026")',
        sampleReturnValue: 'Hello-World-2026',
        description: 'Shows helpers.slugify in use.',
      },
      {
        functionCall: 'helpers.slugify()',
        sampleReturnValue: '',
        description: 'Shows helpers.slugify when optional params are omitted.',
      },
    ],
  },
  'helpers.replaceSymbols': {
    summary: 'Replaces placeholder symbols such as # and ? in a string with random digits or letters.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateStringValue,
    returnType: 'string',
    params: [
      {
        name: 'string',
        optional: true,
        type: 'string',
        description: 'Template string containing placeholder symbols to replace.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.replaceSymbols("##??-##")',
        sampleReturnValue: '47AH-10',
        description: 'Shows helpers.replaceSymbols in use.',
      },
      {
        functionCall: 'helpers.replaceSymbols()',
        sampleReturnValue: '',
        description: 'Shows helpers.replaceSymbols when optional params are omitted.',
      },
    ],
  },
  'helpers.replaceCreditCardSymbols': {
    summary: 'Replaces credit-card placeholders and computes a valid Luhn checksum for the result.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateStringValue,
    returnType: 'string',
    params: [
      {
        name: 'string',
        optional: true,
        type: 'string',
        description: 'Credit card template containing placeholder symbols such as #, !, and L.',
      },
      {
        name: 'symbol',
        optional: true,
        type: 'string',
        description: 'Replacement symbol to use for digit placeholders instead of the default #.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.replaceCreditCardSymbols()',
        sampleReturnValue: '6453-4703-1013-3546-2807',
        description: 'Shows helpers.replaceCreditCardSymbols with all optional params omitted.',
      },
      {
        functionCall: 'helpers.replaceCreditCardSymbols("1234-[4-9]-##!!-L")',
        sampleReturnValue: '1234-6-7043-6',
        description: 'Shows helpers.replaceCreditCardSymbols using the default placeholder symbols.',
      },
      {
        functionCall: 'helpers.replaceCreditCardSymbols("1234-****-****-L", "*")',
        sampleReturnValue: '1234-4703-1013-1',
        description: 'Shows helpers.replaceCreditCardSymbols using a custom digit placeholder symbol.',
      },
    ],
  },
  'helpers.shuffle': {
    summary: 'Returns a shuffled copy of the supplied array.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateArrayValue,
    returnType: 'array',
    params: [
      {
        name: 'array',
        optional: false,
        type: 'array',
        description: 'Array of values to shuffle.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.shuffle(["A", "B", "C"])',
        sampleReturnValue: ['A', 'C', 'B'],
        description: 'Shows helpers.shuffle in use.',
      },
    ],
  },
  'helpers.uniqueArray': {
    summary: 'Builds an array of unique values by repeatedly sampling a source until the requested length is reached.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateArrayValue,
    returnType: 'array',
    params: [
      {
        name: 'source',
        optional: false,
        type: 'array | () => unknown',
        description: 'Array of possible values or a callback used to generate candidate values.',
      },
      {
        name: 'length',
        optional: false,
        type: 'number',
        description: 'Number of unique values to return.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.uniqueArray(["red", "green", "blue"], 2)',
        sampleReturnValue: ['red', 'blue'],
        description: 'Shows helpers.uniqueArray in use.',
      },
    ],
  },
  'helpers.weightedArrayElement': {
    summary: 'Returns one value from a weighted array, favoring entries with higher weights.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateAnyValue,
    returnType: 'unknown',
    params: [
      {
        name: 'array',
        optional: false,
        type: 'array',
        description: 'Array of { weight, value } objects used for weighted selection.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])',
        sampleReturnValue: 'sunny',
        description: 'Shows helpers.weightedArrayElement in use.',
      },
    ],
  },
  'helpers.arrayElements': {
    summary: 'Returns multiple random elements from the supplied array.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateArrayValue,
    returnType: 'array',
    params: [
      {
        name: 'array',
        optional: false,
        type: 'array',
        description: 'Array of candidate values to sample from.',
      },
      {
        name: 'count',
        optional: true,
        type: 'number | { min: number; max: number; }',
        description: 'Exact number of items to return, or a min/max range for the returned item count.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.arrayElements(["A", "B", "C"])',
        sampleReturnValue: ['A', 'C'],
        description: 'Shows helpers.arrayElements with only the required array argument.',
      },
      {
        functionCall: 'helpers.arrayElements(["A", "B", "C"], 2)',
        sampleReturnValue: ['C', 'B'],
        description: 'Shows helpers.arrayElements in use.',
      },
      {
        functionCall: 'helpers.arrayElements(["A","B","C"], 5)',
        sampleReturnValue: ['A', 'C', 'B'],
        description: 'Shows helpers.arrayElements using count.',
      },
    ],
  },
  'helpers.rangeToNumber': {
    summary: 'Converts a number or { min, max } range into a concrete number.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateNumberValue,
    returnType: 'number',
    params: [
      {
        name: 'numberOrRange',
        optional: false,
        type: 'number | { min: number; max: number; }',
        description: 'Fixed number or range object to resolve into a single numeric value.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.rangeToNumber({ min: 1, max: 2 })',
        sampleReturnValue: 1,
        description: 'Shows helpers.rangeToNumber in use.',
      },
    ],
  },
  'helpers.multiple': {
    summary: 'Calls a generator callback multiple times and returns the collected results as an array.',
    docsUrl: 'https://fakerjs.dev/api/helpers',
    validator: validateArrayValue,
    returnType: 'array',
    params: [
      {
        name: 'method',
        optional: false,
        type: '() => unknown',
        description: 'Callback used to generate each array entry.',
      },
      {
        name: 'options',
        optional: true,
        type: 'number | object',
        description: 'Exact count or configuration controlling how many values to generate.',
      },
    ],
    usageExamples: [
      {
        functionCall: 'helpers.multiple(() => "sample", { count: 3 })',
        sampleReturnValue: ['sample', 'sample', 'sample'],
        description: 'Shows helpers.multiple collecting three callback results with an explicit count.',
      },
      {
        functionCall: 'helpers.multiple(() => "sample")',
        sampleReturnValue: ['sample', 'sample', 'sample'],
        description: 'Shows helpers.multiple using the default repetition count.',
      },
    ],
  },
};

function normalizeFakerHelperKeywordHelp(definition) {
  if (!definition) {
    return undefined;
  }

  const normalizedParams = Array.isArray(definition.params)
    ? definition.params.map((param) => ({
        name: String(param.name || '').trim(),
        optional: param.optional !== false,
        type: String(param.type || '').trim(),
        description: String(param.description || '').trim(),
        examples: Array.isArray(param.examples) ? param.examples : [],
      }))
    : [];
  const returnType = String(definition.returnType || '').trim();
  const usageExamples = normalizeUsageExamples({
    command: definition.command || '',
    returnType,
    usageExamples: definition.usageExamples,
  });

  return {
    summary: String(definition.summary || '').trim(),
    params: normalizedParams,
    docsUrl: String(definition.docsUrl || '').trim(),
    fakerDocsUrl: String(definition.fakerDocsUrl || '').trim(),
    usageExamples,
    validator: definition.validator,
    returnType,
  };
}

function buildFakerHelperHelpMetadata(definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  return Object.fromEntries(
    Object.entries(definitions).map(([command, definition]) => [
      command,
      normalizeFakerHelperKeywordHelp({ ...definition, command }),
    ])
  );
}

function getFakerHelperKeywordHelp(commandValue, definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  const command = String(commandValue || '').trim();
  if (!Object.prototype.hasOwnProperty.call(definitions, command)) {
    return undefined;
  }
  return normalizeFakerHelperKeywordHelp({ ...definitions[command], command });
}

function mapDomainKeywordHelpToFakerCommandHelp(commandHelp) {
  if (!commandHelp) {
    return undefined;
  }

  const params = Array.isArray(commandHelp.args)
    ? commandHelp.args.map((arg) => ({
        name: arg.name,
        optional: arg.required !== true,
        type: arg.type,
        description: arg.description || '',
        examples: Array.isArray(arg.examples) ? arg.examples : [],
      }))
    : [];
  const returnType = commandHelp.returnType || '';
  const usageExamples = normalizeUsageExamples({
    command: commandHelp.keyword,
    returnType,
    usageExamples: commandHelp.usageExamples,
  });

  return {
    summary: commandHelp.summary || '',
    params,
    docsUrl: commandHelp.docsUrl || '',
    fakerDocsUrl: commandHelp.fakerDocsUrl || '',
    usageExamples,
    validator: commandHelp.validator,
    returnType,
  };
}

function getFakerCommandHelp(commandValue, definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  const command = String(commandValue || '').trim();
  const helperHelp = getFakerHelperKeywordHelp(command, definitions);
  if (helperHelp) {
    return helperHelp;
  }
  return mapDomainKeywordHelpToFakerCommandHelp(getDomainKeywordHelpByAlias(command));
}

export {
  FAKER_HELPERS_DOCS_URL,
  FAKER_HELPER_KEYWORD_DEFINITIONS,
  buildFakerHelperHelpMetadata,
  getFakerCommandHelp,
  getFakerHelperKeywordHelp,
  mapDomainKeywordHelpToFakerCommandHelp,
  normalizeFakerHelperKeywordHelp,
};
