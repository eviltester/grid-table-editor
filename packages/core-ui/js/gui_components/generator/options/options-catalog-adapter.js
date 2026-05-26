import { OPTION_KEYS_BY_FORMAT, normalizeFormat, sanitizeOptionsForFormat } from '@anywaydata/core';

const TEST_FRAMEWORK_KEYS = ['suiteName', 'testNamePrefix', 'includeSetup', 'prettyPrint', 'dataSourceStrategy'];

const TEST_FRAMEWORK_GROUPS = {
  java: ['junit4', 'junit5', 'junit6', 'testng'],
  python: ['pytest', 'unittest', 'nose2'],
  javascript: ['jest', 'vitest', 'mocha'],
  csharp: ['xunit', 'nunit', 'mstest'],
  ruby: ['rspec', 'minitest'],
  php: ['phpunit', 'pest'],
  kotlin: ['kotest', 'junit5-kotlin', 'spek'],
  perl: ['test-more', 'test2-suite'],
};

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

const CODE_LANGUAGE_SUBTASKS = [
  { id: 'csharp', label: 'C#', type: 'csharp' },
  { id: 'java', label: 'Java', type: 'java' },
  { id: 'javascript', label: 'JavaScript', type: 'javascript' },
  { id: 'kotlin', label: 'Kotlin', type: 'kotlin' },
  { id: 'perl', label: 'Perl', type: 'perl' },
  { id: 'php', label: 'PHP', type: 'php' },
  { id: 'python', label: 'Python', type: 'python' },
  { id: 'ruby', label: 'Ruby', type: 'ruby' },
  { id: 'typescript', label: 'TypeScript', type: 'typescript' },
];

const UNIT_TEST_LANGUAGE_CONFIG = [
  { id: 'csharp-ut', label: 'C#', group: 'csharp', defaultType: 'xunit' },
  { id: 'java-ut', label: 'Java', group: 'java', defaultType: 'junit5' },
  { id: 'javascript-ut', label: 'JavaScript', group: 'javascript', defaultType: 'jest' },
  { id: 'kotlin-ut', label: 'Kotlin', group: 'kotlin', defaultType: 'kotest' },
  { id: 'perl-ut', label: 'Perl', group: 'perl', defaultType: 'test-more' },
  { id: 'php-ut', label: 'PHP', group: 'php', defaultType: 'phpunit' },
  { id: 'python-ut', label: 'Python', group: 'python', defaultType: 'pytest' },
  { id: 'ruby-ut', label: 'Ruby', group: 'ruby', defaultType: 'rspec' },
  { id: 'typescript-ut', label: 'TypeScript', group: 'javascript', defaultType: 'jest' },
];

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

function getCodeLanguageSubtasks() {
  return CODE_LANGUAGE_SUBTASKS.map((subtask) => ({ ...subtask }));
}

function getUnitTestLanguageSubtasks() {
  return UNIT_TEST_LANGUAGE_CONFIG.map((config) => {
    const types = TEST_FRAMEWORK_GROUPS[config.group] || [];
    return {
      id: config.id,
      label: config.label,
      type: types.includes(config.defaultType) ? config.defaultType : types[0],
      types: [...types],
    };
  });
}

export {
  TEST_FRAMEWORK_GROUPS,
  getCodeLanguageSubtasks,
  getTestFrameworkFormats,
  getTestFrameworkLabel,
  getUnitTestLanguageSubtasks,
  sanitizeUiOptionsForFormat,
};
