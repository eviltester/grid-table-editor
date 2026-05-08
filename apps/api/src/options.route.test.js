import http from 'node:http';
import { app } from './index.js';

const FORMAT = 'csv';
const CUSTOM_HEADER_TIP = 'Include column headers in the first row.';

let server;
let port;

beforeAll(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  port = server.address().port;
});

afterAll(async () => {
  if (!server) {
    return;
  }
  await new Promise((resolve) => server.close(resolve));
});

function url(path) {
  return `http://127.0.0.1:${port}${path}`;
}

async function resetCsvDefaults() {
  await fetch(url(`/v1/generate/options/${FORMAT}/default`), { method: 'POST' });
}

async function resetDsvDefaults() {
  await fetch(url('/v1/generate/options/dsv/default'), { method: 'POST' });
}

test('/v1/generate/options/:format returns tips for all returned option keys', async () => {
  await resetCsvDefaults();
  const formats = [
    'csv',
    'dsv',
    'json',
    'jsonl',
    'javascript',
    'python',
    'java',
    'typescript',
    'xml',
    'sql',
    'markdown',
    'html',
    'gherkin',
    'asciitable',
    'junit4',
    'junit5',
    'junit6',
    'testng',
    'pytest',
    'jest',
    'xunit',
    'rspec',
    'phpunit',
    'kotest',
    'test-more',
  ];

  for (const format of formats) {
    const response = await fetch(url(`/v1/generate/options/${format}`));
    expect(response.status).toBe(200);
    const body = await response.json();
    const optionKeys = Object.keys(body?.options || {});
    for (const key of optionKeys) {
      expect(typeof body?.tips?.[key]).toBe('string');
      expect(body.tips[key].trim().length > 0).toBeTruthy();
    }
  }
});

test('/v1/generate/options/:format returns framework-specific setup tips', async () => {
  const jestResponse = await fetch(url('/v1/generate/options/jest'));
  expect(jestResponse.status).toBe(200);
  const jestBody = await jestResponse.json();
  expect(jestBody?.tips?.includeSetup || '').toMatch(/beforeEach/i);

  const phpunitResponse = await fetch(url('/v1/generate/options/phpunit'));
  expect(phpunitResponse.status).toBe(200);
  const phpunitBody = await phpunitResponse.json();
  expect(phpunitBody?.tips?.includeSetup || '').toMatch(/setUp/i);
});

test('/v1/generate/options/:format exposes only UI-supported option keys', async () => {
  await resetCsvDefaults();
  const expectedKeysByFormat = {
    csv: ['escapeChar', 'header', 'quoteChar', 'quotes'],
    dsv: ['delimiter', 'escapeChar', 'header', 'quoteChar', 'quotes'],
    json: ['asObject', 'asPropertyNamed', 'makeNumbersNumeric', 'prettyPrint', 'prettyPrintDelimiter'],
    jsonl: ['makeNumbersNumeric'],
    javascript: [
      'asObject',
      'asPropertyNamed',
      'makeNumbersNumeric',
      'outputAsJsonLines',
      'prettyPrint',
      'prettyPrintDelimiter',
    ],
    python: [
      'assignToVariable',
      'blankValueBehavior',
      'collectionType',
      'decimalColumnsCsv',
      'decimalTreatIntegersAsDecimal',
      'importStatements',
      'includeImports',
      'objectClassName',
      'prettyPrint',
      'prettyPrintDelimiter',
      'quoteNumbers',
      'quoteStyle',
      'useAnonymousDicts',
      'useDecimalType',
      'variableName',
    ],
    java: [
      'assignToVariable',
      'blankValueBehavior',
      'collectionType',
      'includeImports',
      'objectClassName',
      'prettyPrint',
      'prettyPrintDelimiter',
      'quoteNumbers',
      'useAnonymousMaps',
      'variableName',
    ],
    typescript: [
      'assignToVariable',
      'blankValueBehavior',
      'collectionType',
      'objectClassName',
      'prettyPrint',
      'prettyPrintDelimiter',
      'quoteNumbers',
      'useAnonymousObjects',
      'variableName',
    ],
    xml: ['attributeColumnsCsv', 'includeXmlHeader', 'itemElementName', 'rootElementName', 'xmlns'],
    sql: [
      'maxValuesPerInsert',
      'nullHandling',
      'quoteIdentifiers',
      'quoteNumeric',
      'sqlDialect',
      'tableName',
      'wrapTransaction',
    ],
    markdown: [
      'borderBars',
      'emboldenColumns',
      'emboldenHeaders',
      'emphasisColumns',
      'emphasisHeaders',
      'globalColumnAlign',
      'prettyPrint',
      'spacePadding',
      'tabPadding',
    ],
    html: ['addTbodyToTable', 'addTheadToTable', 'compact', 'prettyPrint', 'prettyPrintDelimiter'],
    gherkin: ['inCellPadding', 'leftIndent', 'prettyPrint', 'showHeadings'],
    asciitable: ['style'],
    junit4: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    junit5: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    junit6: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    testng: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    pytest: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    jest: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    xunit: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    rspec: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    phpunit: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    kotest: ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    'test-more': ['dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
  };

  for (const [format, expectedKeys] of Object.entries(expectedKeysByFormat)) {
    const response = await fetch(url(`/v1/generate/options/${format}`));
    expect(response.status).toBe(200);
    const body = await response.json();
    const keys = Object.keys(body?.options || {}).sort();
    expect(keys).toEqual([...expectedKeys].sort());
  }
});

test('/v1/generate/options/csv returns built-in defaults and built-in tips', async () => {
  await resetCsvDefaults();
  const response = await fetch(url('/v1/generate/options/csv'));
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.format).toBe('csv');
  expect(body.source).toBe('built-in-default');
  expect(body.options?.header).toBe(true);
  expect(body.options?.quotes).toBe(true);
  expect(Object.hasOwn(body.options || {}, 'delimiter')).toBe(false);
  expect(typeof body.tips?.header).toBe('string');
  expect(body.tips?.header).not.toBe(CUSTOM_HEADER_TIP);
});

test('/v1/generate/options/csv accepts posted options and tips', async () => {
  await resetCsvDefaults();
  const response = await fetch(url('/v1/generate/options/csv'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      options: { header: false },
      tips: { header: CUSTOM_HEADER_TIP },
    }),
  });
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.source).toBe('custom-default');
  expect(body.options?.header).toBe(false);
  expect(body.options?.quotes).toBe(true);
  expect(body.tips?.header).toBe(CUSTOM_HEADER_TIP);
});

test('/v1/generate/options/csv returns custom defaults after POST', async () => {
  await resetCsvDefaults();
  await fetch(url('/v1/generate/options/csv'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      options: { header: false },
      tips: { header: CUSTOM_HEADER_TIP },
    }),
  });

  const response = await fetch(url('/v1/generate/options/csv'));
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.source).toBe('custom-default');
  expect(body.options?.header).toBe(false);
  expect(body.tips?.header).toBe(CUSTOM_HEADER_TIP);
});

test('/v1/generate uses saved default options when request options are omitted', async () => {
  await resetDsvDefaults();
  await fetch(url('/v1/generate/options/dsv'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ options: { header: false } }),
  });

  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'dsv', responseFormat: 'raw' }),
  });
  expect(response.status).toBe(200);
  const body = await response.text();
  expect(body.includes('Name')).toBe(false);
  await resetDsvDefaults();
});

test('/v1/generate applies includeSetup for unit-test formats', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      textSpec: 'Name\nBob',
      rowCount: 1,
      outputFormat: 'jest',
      responseFormat: 'rendered',
      options: { options: { includeSetup: true } },
    }),
  });
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.rendered).toMatch(/beforeEach/);
  expect(body.rendered).toMatch(/expect\(/);
});

test('/v1/generate/options/csv/default resets options and tips to built-in defaults', async () => {
  await resetCsvDefaults();
  await fetch(url('/v1/generate/options/csv'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      options: { header: false },
      tips: { header: CUSTOM_HEADER_TIP },
    }),
  });

  const response = await fetch(url('/v1/generate/options/csv/default'), { method: 'POST' });
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.source).toBe('built-in-default');
  expect(body.options?.header).toBe(true);
  expect(body.tips?.header).not.toBe(CUSTOM_HEADER_TIP);
});
