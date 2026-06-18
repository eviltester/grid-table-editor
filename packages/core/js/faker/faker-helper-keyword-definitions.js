import { getDomainKeywordHelpByAlias } from '../domain/domain-keywords.js';

const FAKER_HELPERS_DOCS_URL = 'https://fakerjs.dev/api/helpers';

// Faker helper definitions live here because helpers.* remains outside the domain keyword abstraction.
// These definitions are the source of truth for helper command registration, params, examples, and help metadata.
const FAKER_HELPER_KEYWORD_DEFINITIONS = {
  'helpers.fake': {
    summary: 'Interpolates faker template placeholders inside a string and returns the rendered result.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'string',
    params: [
      {
        name: 'pattern',
        optional: false,
        type: 'string',
        description: 'Template string containing faker placeholders such as {{person.firstName}} or {{location.city}}.',
      },
    ],
    examples: ['helpers.fake("Hi, my name is {{person.firstName}} {{person.lastName}}!")'],
  },
  'helpers.mustache': {
    summary: 'Replaces {{placeholder}} tokens in a string using values from the supplied data object.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
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
    examples: ['helpers.mustache("Hello {{name}}", { name: "Ada" })'],
  },
  'helpers.fromRegExp': {
    summary: 'Generates a string that matches the supplied regular-expression-style pattern.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'string',
    params: [
      {
        name: 'pattern',
        optional: false,
        type: 'string | RegExp',
        description: 'Regular expression, or regex-like string, used to generate matching output.',
      },
    ],
    examples: ['helpers.fromRegExp("[A-Z]{2}[0-9]{2}")'],
  },
  'helpers.maybe': {
    summary: 'Calls a callback and returns its value only when faker decides the optional value should be present.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
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
    examples: ['helpers.maybe(() => "enabled")'],
  },
  'helpers.arrayElement': {
    summary: 'Returns one random element from the supplied array.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'unknown',
    params: [
      {
        name: 'array',
        optional: false,
        type: 'array',
        description: 'Array of candidate values to choose from.',
      },
    ],
    examples: ['helpers.arrayElement(["A", "B", "C"])'],
  },
  'helpers.objectKey': {
    summary: 'Returns one random key from the supplied object.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'string',
    params: [
      {
        name: 'object',
        optional: false,
        type: 'object',
        description: 'Object whose enumerable keys are used as candidate values.',
      },
    ],
    examples: ['helpers.objectKey({ red: "#f00", blue: "#00f" })'],
  },
  'helpers.objectValue': {
    summary: 'Returns one random value from the supplied object.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'unknown',
    params: [
      {
        name: 'object',
        optional: false,
        type: 'object',
        description: 'Object whose enumerable values are used as candidate values.',
      },
    ],
    examples: ['helpers.objectValue({ red: "#f00", blue: "#00f" })'],
  },
  'helpers.objectEntry': {
    summary: 'Returns one random [key, value] entry from the supplied object.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'array',
    params: [
      {
        name: 'object',
        optional: false,
        type: 'object',
        description: 'Object whose enumerable entries are used as candidate values.',
      },
    ],
    examples: ['helpers.objectEntry({ red: "#f00", blue: "#00f" })'],
  },
  'helpers.enumValue': {
    summary: 'Returns one random value from the supplied enum-like object.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'unknown',
    params: [
      {
        name: 'enumObject',
        optional: false,
        type: 'object',
        description: 'Enum-like object to sample from while ignoring numeric reverse-mapping keys.',
      },
    ],
    examples: ['helpers.enumValue({ Pending: "pending", Active: "active" })'],
  },
  'helpers.slugify': {
    summary: 'Converts a string into a URL-friendly slug.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'string',
    params: [
      {
        name: 'string',
        optional: true,
        type: 'string',
        description: 'Input text to normalize into a lowercase, hyphen-separated slug.',
      },
    ],
    examples: ['helpers.slugify("Hello World 2026")'],
  },
  'helpers.replaceSymbols': {
    summary: 'Replaces placeholder symbols such as # and ? in a string with random digits or letters.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'string',
    params: [
      {
        name: 'string',
        optional: true,
        type: 'string',
        description: 'Template string containing placeholder symbols to replace.',
      },
    ],
    examples: ['helpers.replaceSymbols("##??-##")'],
  },
  'helpers.replaceCreditCardSymbols': {
    summary: 'Replaces credit-card placeholders and computes a valid Luhn checksum for the result.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: 'demo-card-####-fake',
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
    examples: ['helpers.replaceCreditCardSymbols("1234-[4-9]-##!!-L")'],
  },
  'helpers.shuffle': {
    summary: 'Returns a shuffled copy of the supplied array.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'array',
    params: [
      {
        name: 'array',
        optional: false,
        type: 'array',
        description: 'Array of values to shuffle.',
      },
    ],
    examples: ['helpers.shuffle(["A", "B", "C"])'],
  },
  'helpers.uniqueArray': {
    summary: 'Builds an array of unique values by repeatedly sampling a source until the requested length is reached.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '[]',
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
    examples: ['helpers.uniqueArray(["red", "green", "blue"], 2)'],
  },
  'helpers.weightedArrayElement': {
    summary: 'Returns one value from a weighted array, favoring entries with higher weights.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
    returnType: 'unknown',
    params: [
      {
        name: 'array',
        optional: false,
        type: 'array',
        description: 'Array of { weight, value } objects used for weighted selection.',
      },
    ],
    examples: ['helpers.weightedArrayElement([{ weight: 5, value: "sunny" }, { weight: 1, value: "rainy" }])'],
  },
  'helpers.arrayElements': {
    summary: 'Returns multiple random elements from the supplied array.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '',
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
    examples: ['helpers.arrayElements(["A", "B", "C"], 2)'],
  },
  'helpers.rangeToNumber': {
    summary: 'Converts a number or { min, max } range into a concrete number.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '2',
    returnType: 'number',
    params: [
      {
        name: 'numberOrRange',
        optional: false,
        type: 'number | { min: number; max: number; }',
        description: 'Fixed number or range object to resolve into a single numeric value.',
      },
    ],
    examples: ['helpers.rangeToNumber({ min: 1, max: 2 })'],
  },
  'helpers.multiple': {
    summary: 'Calls a generator callback multiple times and returns the collected results as an array.',
    docsUrl: FAKER_HELPERS_DOCS_URL,
    example: '[null,null,null]',
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
    examples: ['helpers.multiple(() => faker.person.firstName(), { count: 3 })'],
  },
};

function normalizeFakerHelperKeywordHelp(definition) {
  if (!definition) {
    return undefined;
  }

  return {
    summary: String(definition.summary || '').trim(),
    params: Array.isArray(definition.params)
      ? definition.params.map((param) => ({
          name: String(param.name || '').trim(),
          optional: param.optional !== false,
          type: String(param.type || '').trim(),
          description: String(param.description || '').trim(),
          examples: Array.isArray(param.examples) ? param.examples : [],
        }))
      : [],
    docsUrl: String(definition.docsUrl || '').trim(),
    example: String(definition.example || '').trim(),
    examples: Array.isArray(definition.examples) ? definition.examples : [],
    exampleReturnValues: Array.isArray(definition.exampleReturnValues) ? definition.exampleReturnValues : [],
    returnType: String(definition.returnType || '').trim(),
  };
}

function buildFakerHelperHelpMetadata(definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  return Object.fromEntries(
    Object.entries(definitions).map(([command, definition]) => [command, normalizeFakerHelperKeywordHelp(definition)])
  );
}

function getFakerHelperKeywordHelp(commandValue, definitions = FAKER_HELPER_KEYWORD_DEFINITIONS) {
  const command = String(commandValue || '').trim();
  if (!Object.prototype.hasOwnProperty.call(definitions, command)) {
    return undefined;
  }
  return normalizeFakerHelperKeywordHelp(definitions[command]);
}

function mapDomainKeywordHelpToFakerCommandHelp(commandHelp) {
  if (!commandHelp) {
    return undefined;
  }

  return {
    summary: commandHelp.summary || '',
    params: Array.isArray(commandHelp.args)
      ? commandHelp.args.map((arg) => ({
          name: arg.name,
          optional: arg.required !== true,
          type: arg.type,
          description: arg.description || '',
          examples: Array.isArray(arg.examples) ? arg.examples : [],
        }))
      : [],
    docsUrl: commandHelp.docsUrl || '',
    example: commandHelp.example || '',
    examples: Array.isArray(commandHelp.examples) ? commandHelp.examples : [],
    exampleReturnValues: Array.isArray(commandHelp.exampleReturnValues) ? commandHelp.exampleReturnValues : [],
    returnType: commandHelp.returnType || '',
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
