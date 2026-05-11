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
      runtimeCustomTips[key] || configuredTips[key] || `Configure ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
  }
  return tips;
}

export { OPTION_KEYS_BY_FORMAT, OPTION_TIPS_BY_FORMAT, normalizeFormat, sanitizeOptionsForFormat, getTipsForFormat };
