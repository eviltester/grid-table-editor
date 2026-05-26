const FAKER_HELPER_KEYWORD_DEFINITIONS = {
  'helpers.fake': {
    summary: 'Interpolates faker template placeholders inside a string and returns the rendered result.',
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
  'helpers.slugify': {
    summary: 'Converts a string into a URL-friendly slug.',
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

export { FAKER_HELPER_KEYWORD_DEFINITIONS };
