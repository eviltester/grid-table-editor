import { OPTION_KEYS_BY_FORMAT, normalizeFormat, sanitizeOptionsForFormat } from '@anywaydata/core';

const TEST_FRAMEWORK_KEYS = ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'];

const TEST_FRAMEWORK_LABELS = {
  junit4: 'JUnit4',
  junit5: 'JUnit5',
  junit6: 'JUnit6',
  testng: 'TestNG',
  pytest: 'PyTest',
  unittest: 'unittest',
  nose2: 'nose2',
  jest: 'Jest',
  vitest: 'Vitest',
  mocha: 'Mocha',
  xunit: 'xUnit',
  nunit: 'NUnit',
  mstest: 'MSTest',
  rspec: 'RSpec',
  minitest: 'Minitest',
  phpunit: 'PHPUnit',
  pest: 'Pest',
  kotest: 'Kotest',
  'junit5-kotlin': 'JUnit5 Kotlin',
  spek: 'Spek',
  'test-more': 'Test::More',
  'test2-suite': 'Test2::Suite',
};

function getTestFrameworkFormats() {
  return Object.keys(OPTION_KEYS_BY_FORMAT).filter((format) =>
    TEST_FRAMEWORK_KEYS.every((key) => OPTION_KEYS_BY_FORMAT[format]?.includes(key))
  );
}

function getTestFrameworkLabel(format) {
  return TEST_FRAMEWORK_LABELS[format] || format;
}

function sanitizeUiOptionsForFormat(format, options) {
  const normalized = normalizeFormat(format);
  const sanitized = sanitizeOptionsForFormat(normalized, options);
  return { outputFormat: normalized, options: sanitized };
}

export { getTestFrameworkFormats, getTestFrameworkLabel, sanitizeUiOptionsForFormat };
