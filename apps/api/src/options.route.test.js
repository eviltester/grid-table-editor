import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { app } from './index.js';

const FORMAT = 'csv';
const CUSTOM_HEADER_TIP = 'Include column headers in the first row.';

let server;
let port;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  port = server.address().port;
});

test.after(async () => {
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
    assert.equal(response.status, 200);
    const body = await response.json();
    const optionKeys = Object.keys(body?.options?.options || {});
    for (const key of optionKeys) {
      assert.equal(typeof body?.tips?.[key], 'string');
      assert.ok(body.tips[key].trim().length > 0);
    }
  }
});

test('/v1/generate/options/:format returns framework-specific assertion/setup tips', async () => {
  const jestResponse = await fetch(url('/v1/generate/options/jest'));
  assert.equal(jestResponse.status, 200);
  const jestBody = await jestResponse.json();
  assert.match(jestBody?.tips?.assertionStyle || '', /toStrictEqual|toEqual/);
  assert.match(jestBody?.tips?.includeSetup || '', /beforeEach/i);

  const phpunitResponse = await fetch(url('/v1/generate/options/phpunit'));
  assert.equal(phpunitResponse.status, 200);
  const phpunitBody = await phpunitResponse.json();
  assert.match(phpunitBody?.tips?.assertionStyle || '', /assertSame|assertEquals/);
  assert.match(phpunitBody?.tips?.includeSetup || '', /setUp/i);
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
    junit4: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    junit5: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    junit6: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    testng: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    pytest: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    jest: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    xunit: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    rspec: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    phpunit: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    kotest: ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
    'test-more': ['assertionStyle', 'dataSourceStrategy', 'includeSetup', 'prettyPrint', 'suiteName', 'testNamePrefix'],
  };

  for (const [format, expectedKeys] of Object.entries(expectedKeysByFormat)) {
    const response = await fetch(url(`/v1/generate/options/${format}`));
    assert.equal(response.status, 200);
    const body = await response.json();
    const keys = Object.keys(body?.options?.options || {}).sort();
    assert.deepEqual(keys, [...expectedKeys].sort());
  }
});

test('/v1/generate/options/csv returns built-in defaults and built-in tips', async () => {
  await resetCsvDefaults();
  const response = await fetch(url('/v1/generate/options/csv'));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.format, 'csv');
  assert.equal(body.source, 'built-in-default');
  assert.equal(body.options?.options?.header, true);
  assert.equal(body.options?.options?.quotes, true);
  assert.equal(Object.hasOwn(body.options?.options || {}, 'delimiter'), false);
  assert.equal(typeof body.tips?.header, 'string');
  assert.notEqual(body.tips?.header, CUSTOM_HEADER_TIP);
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
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.source, 'custom-default');
  assert.equal(body.options?.options?.header, false);
  assert.equal(body.options?.options?.quotes, true);
  assert.equal(body.tips?.header, CUSTOM_HEADER_TIP);
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
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.source, 'custom-default');
  assert.equal(body.options?.options?.header, false);
  assert.equal(body.tips?.header, CUSTOM_HEADER_TIP);
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
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.equal(body.includes('Name'), false);
  await resetDsvDefaults();
});

test('/v1/generate applies includeSetup and assertionStyle for unit-test formats', async () => {
  const response = await fetch(url('/v1/generate'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      textSpec: 'Name\nBob',
      rowCount: 1,
      outputFormat: 'jest',
      responseFormat: 'rendered',
      options: { options: { includeSetup: true, assertionStyle: 'basic' } },
    }),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.match(body.rendered, /beforeEach/);
  assert.match(body.rendered, /toEqual/);
  assert.equal(body.rendered.includes('toStrictEqual'), false);
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
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.source, 'built-in-default');
  assert.equal(body.options?.options?.header, true);
  assert.notEqual(body.tips?.header, CUSTOM_HEADER_TIP);
});
