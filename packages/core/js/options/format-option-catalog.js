const OPTION_KEYS_BY_FORMAT = {
  csv: ['quotes', 'header', 'quoteChar', 'escapeChar'],
  dsv: ['delimiter', 'quotes', 'header', 'quoteChar', 'escapeChar'],
  json: ['makeNumbersNumeric', 'prettyPrint', 'asObject', 'asPropertyNamed', 'prettyPrintDelimiter'],
  jsonl: ['makeNumbersNumeric'],
  xml: ['rootElementName', 'itemElementName', 'attributeColumnsCsv', 'includeXmlHeader', 'xmlns'],
  sql: [
    'tableName',
    'maxValuesPerInsert',
    'quoteNumeric',
    'sqlDialect',
    'quoteIdentifiers',
    'nullHandling',
    'wrapTransaction',
  ],
  markdown: [
    'spacePadding',
    'tabPadding',
    'borderBars',
    'emboldenHeaders',
    'emphasisHeaders',
    'emboldenColumns',
    'emphasisColumns',
    'prettyPrint',
    'globalColumnAlign',
  ],
  html: ['compact', 'prettyPrint', 'prettyPrintDelimiter', 'addTheadToTable', 'addTbodyToTable'],
  javascript: [
    'makeNumbersNumeric',
    'prettyPrint',
    'asObject',
    'asPropertyNamed',
    'outputAsJsonLines',
    'prettyPrintDelimiter',
  ],
  python: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'useDecimalType',
    'decimalColumnsCsv',
    'decimalTreatIntegersAsDecimal',
    'blankValueBehavior',
    'quoteStyle',
    'prettyPrint',
    'prettyPrintDelimiter',
    'includeImports',
    'importStatements',
    'useAnonymousDicts',
    'objectClassName',
  ],
  java: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'useAnonymousMaps',
    'objectClassName',
    'blankValueBehavior',
    'includeImports',
    'prettyPrint',
    'prettyPrintDelimiter',
  ],
  typescript: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'useAnonymousObjects',
    'objectClassName',
    'blankValueBehavior',
    'prettyPrint',
    'prettyPrintDelimiter',
  ],
  csharp: [
    'collectionType',
    'collectionTargetType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'dictionaryValueType',
    'useAnonymousObjects',
    'objectClassName',
    'prettyPrint',
    'prettyPrintDelimiter',
  ],
  kotlin: [
    'collectionType',
    'assignToVariable',
    'mutableAssignment',
    'variableName',
    'quoteNumbers',
    'useAnonymousObjects',
    'useMutableCollections',
    'objectClassName',
    'prettyPrint',
    'prettyPrintDelimiter',
    'trailingComma',
  ],
  perl: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'hashKeyStyle',
    'useAnonymousObjects',
    'objectClassName',
    'objectInstantiationStyle',
    'prettyPrint',
    'prettyPrintDelimiter',
  ],
  php: [
    'collectionType',
    'includePhpTag',
    'preferShortArraySyntax',
    'assignToVariable',
    'variableName',
    'quoteNumbers',
    'objectRepresentation',
    'objectClassName',
    'arrayKeyQuoteStyle',
    'blankValueBehavior',
    'coerceBooleanLiterals',
    'coerceNullLiteral',
    'phpCompatibility',
    'classPropertyTyping',
    'useConstructorPromotion',
    'constructorArgStyle',
    'prettyPrint',
    'prettyPrintDelimiter',
  ],
  ruby: [
    'collectionType',
    'assignToVariable',
    'variableName',
    'outputWrapper',
    'quoteNumbers',
    'hashKeyStyle',
    'useAnonymousObjects',
    'objectClassName',
    'objectRepresentation',
    'fieldNameStyle',
    'prettyPrint',
    'hashPrettyStyle',
    'prettyPrintDelimiter',
  ],
  gherkin: ['showHeadings', 'leftIndent', 'inCellPadding', 'prettyPrint'],
  asciitable: ['style'],
  junit4: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  junit5: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  junit6: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  testng: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  pytest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  unittest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  nose2: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  jest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  vitest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  mocha: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  xunit: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  nunit: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  mstest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  rspec: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  minitest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  phpunit: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  pest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  kotest: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'junit5-kotlin': ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  spek: ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'test-more': ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
  'test2-suite': ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'],
};

const OPTION_TIPS_BY_FORMAT = {
  csv: {
    quotes: 'Wrap fields in quote characters when exporting CSV.',
    header: 'Include the column header row as the first line of output.',
    quoteChar: 'Character used to quote string values, for example double quote.',
    escapeChar: 'Character used to escape quote characters inside field values.',
  },
  dsv: {
    delimiter: 'Choose the delimiter character used between values in each row.',
    quotes: 'Wrap fields in quote characters when exporting delimited data.',
    header: 'Include the header row as the first line of output.',
    quoteChar: 'Character used to quote string values.',
    escapeChar: 'Character used to escape quote characters inside field values.',
  },
  xml: {
    rootElementName: 'XML root tag name.',
    itemElementName: 'Per-row XML tag name.',
    attributeColumnsCsv: 'Comma-separated columns to render as XML attributes on each item tag.',
    includeXmlHeader: 'Include XML declaration header.',
    xmlns: 'Namespace URI, rendered as xmlns attribute on the root tag.',
  },
  junit4: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @Before setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method, inline, or csv source.',
  },
  junit5: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @BeforeEach setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method, inline, or csv source.',
  },
  junit6: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @BeforeEach setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method, inline, or csv source.',
  },
  testng: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include @BeforeMethod setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider/method or inline.',
  },
  pytest: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include pytest fixture scaffold and wire it into the test signature.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider function or inline rows.',
  },
  jest: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include beforeEach setup scaffold in generated suite.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: provider function or inline rows.',
  },
  xunit: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include constructor setup scaffold in generated class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: MemberData provider or InlineData.',
  },
  rspec: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include before block scaffold in generated spec.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: rows constant iteration.',
  },
  phpunit: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include setUp() scaffold in generated test class.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: data provider rows.',
  },
  kotest: {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include beforeTest setup scaffold in generated spec.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: rows collection iteration.',
  },
  'test-more': {
    suiteName: 'Name of generated test suite/class.',
    testNamePrefix: 'Prefix used for generated test method names.',
    includeSetup: 'Include setup variable scaffold in generated script.',
    prettyPrint: 'Format generated output for readability.',
    dataSourceStrategy: 'Data-driven strategy: row hash iteration.',
  },
};

const COMMON_OPTION_TIPS_BY_KEY = {
  delimiter: 'Delimiter character used between values in each row.',
  quotes: 'Wrap fields in quote characters in the output.',
  header: 'Include the column header row as the first line of output.',
  quoteChar: 'Character used to quote string values.',
  escapeChar: 'Character used to escape quote characters inside values.',
  makeNumbersNumeric: 'When checked, numeric-looking values are emitted as numeric literals instead of quoted strings.',
  prettyPrint: 'Format generated output with indentation and line breaks for readability.',
  asObject: 'Emit output as an object keyed by row index or identifier rather than a plain array.',
  asPropertyNamed: 'Property name to use when wrapping output in an object.',
  prettyPrintDelimiter: 'Indentation characters used when pretty print is enabled.',
  outputAsJsonLines: 'Emit one JSON object per line (JSON Lines) instead of a JSON array.',
  rootElementName: 'Name of the root XML element.',
  itemElementName: 'Name of the XML element used for each row.',
  attributeColumnsCsv: 'Comma-separated list of columns to emit as XML attributes.',
  includeXmlHeader: 'Include the XML declaration header at the top of output.',
  xmlns: 'Namespace URI rendered as the xmlns attribute on the root element.',
  tableName: 'Table name used in generated SQL INSERT statements.',
  maxValuesPerInsert: 'Maximum number of row value tuples included per INSERT statement.',
  quoteNumeric: 'Quote numeric-looking values in SQL output.',
  sqlDialect: 'SQL dialect rules used when generating statements.',
  quoteIdentifiers: 'Quote table and column identifiers in SQL output.',
  nullHandling: 'Controls how null-like and blank values are represented in SQL.',
  wrapTransaction: 'Wrap generated SQL statements in a transaction block.',
  spacePadding: 'Number of spaces used for markdown table cell padding.',
  tabPadding: 'Use tab-based padding for markdown table rendering.',
  borderBars: 'Include leading and trailing pipe characters in markdown rows.',
  emboldenHeaders: 'Render header cells in bold markdown.',
  emphasisHeaders: 'Render header cells with emphasis markers.',
  emboldenColumns: 'Render data cells in bold markdown.',
  emphasisColumns: 'Render data cells with emphasis markers.',
  globalColumnAlign: 'Default markdown column alignment applied across all columns.',
  compact: 'Emit compact output with minimal whitespace.',
  addTheadToTable: 'Wrap HTML header row in a <thead> section.',
  addTbodyToTable: 'Wrap HTML data rows in a <tbody> section.',
  collectionType: 'Collection shape used for the top-level generated rows.',
  assignToVariable: 'Assign generated output to a named variable.',
  variableName: 'Variable name used when assignment is enabled.',
  quoteNumbers: 'When checked, numeric-looking values are output as quoted strings.',
  useDecimalType: 'When checked, decimal-looking numeric values are output as Decimal values.',
  decimalColumnsCsv: 'Comma-separated list of columns forced to Decimal output.',
  decimalTreatIntegersAsDecimal: 'Treat integer-looking values as Decimal when decimal mode is enabled.',
  blankValueBehavior:
    'Controls whether blank values are emitted as empty strings, nulls, or language-specific defaults.',
  quoteStyle: 'String quoting style used in generated output.',
  includeImports: 'Include import/using statements required by generated output.',
  importStatements: 'Custom import statements to include at the top of generated output.',
  useAnonymousDicts: 'Use dictionary/map objects instead of named class instances.',
  useAnonymousMaps: 'Use map objects instead of named class instances.',
  useAnonymousObjects: 'Use anonymous objects instead of named class instances where supported.',
  objectClassName: 'Class or object type name used for generated object instances.',
  collectionTargetType: 'Target collection interface/type used for collection declarations.',
  dictionaryValueType: 'Value type used for dictionary/map values in generated output.',
  mutableAssignment: 'Use mutable variable declaration instead of immutable declaration.',
  useMutableCollections: 'Use mutable collection constructors in generated output.',
  trailingComma: 'Include trailing commas in multi-line generated structures when supported.',
  hashKeyStyle: 'Style used for hash/map keys, such as quoted strings or bare/symbol keys.',
  objectInstantiationStyle: 'Style used to instantiate objects, for example constructor or bless-based forms.',
  includePhpTag: 'Include the opening PHP tag at the top of generated output.',
  preferShortArraySyntax: 'Prefer short array syntax when the target language supports it.',
  objectRepresentation: 'Representation used for objects, such as maps, stdClass, classes, structs, or data objects.',
  arrayKeyQuoteStyle: 'Controls whether array/hash keys are quoted or unquoted.',
  coerceBooleanLiterals: 'Convert boolean-like string literals into boolean values in generated output.',
  coerceNullLiteral: 'Convert null-like string literals into null values in generated output.',
  phpCompatibility: 'Target PHP compatibility level for generated syntax.',
  classPropertyTyping: 'Controls whether generated class properties include type declarations.',
  useConstructorPromotion: 'Use constructor property promotion where supported by the target runtime.',
  constructorArgStyle: 'Argument passing style used in generated constructor calls.',
  outputWrapper: 'Wrapper style used around generated output, such as plain assignment or test helper wrappers.',
  fieldNameStyle: 'Field naming convention used in generated object keys/properties.',
  hashPrettyStyle: 'Pretty-print style for hash/map structures.',
  showHeadings: 'Include heading lines in generated Gherkin output.',
  leftIndent: 'Left indentation prefix applied to generated Gherkin lines.',
  inCellPadding: 'Padding applied inside Gherkin table cells.',
  style: 'ASCII table style preset used when rendering borders and separators.',
  suiteName: 'Name of the generated test suite/class/module.',
  testNamePrefix: 'Prefix used for generated test case names.',
  includeSetup: 'Include setup scaffold code in the generated test output.',
  dataSourceStrategy: 'Data-source strategy used to feed generated rows into tests.',
};

function normalizeFormat(format) {
  return String(format || '').toLowerCase();
}

function toOptionsObject(payload) {
  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    payload.options &&
    typeof payload.options === 'object'
  ) {
    return payload.options;
  }
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    return payload;
  }
  return {};
}

function sanitizeOptionsForFormat(format, payload) {
  const keys = OPTION_KEYS_BY_FORMAT[normalizeFormat(format)] || [];
  const sourceOptions = toOptionsObject(payload);
  const filteredOptions = {};
  for (const key of keys) {
    if (sourceOptions[key] !== undefined) {
      filteredOptions[key] = sourceOptions[key];
    }
  }
  return filteredOptions;
}

function getTipsForFormat(format, { customTips } = {}) {
  const normalised = normalizeFormat(format);
  const keys = OPTION_KEYS_BY_FORMAT[normalised] || [];
  const configuredTips = OPTION_TIPS_BY_FORMAT[normalised] || {};
  const runtimeCustomTips = customTips || {};
  const tips = {};
  for (const key of keys) {
    tips[key] =
      runtimeCustomTips[key] ??
      configuredTips[key] ??
      COMMON_OPTION_TIPS_BY_KEY[key] ??
      `Configure ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
  }
  return tips;
}

export {
  OPTION_KEYS_BY_FORMAT,
  OPTION_TIPS_BY_FORMAT,
  COMMON_OPTION_TIPS_BY_KEY,
  normalizeFormat,
  sanitizeOptionsForFormat,
  getTipsForFormat,
};
