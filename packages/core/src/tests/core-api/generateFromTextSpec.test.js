import { generateFromTextSpec, validateSafeFakerRules, SUPPORTED_FORMATS } from '../../index.js';
import { PairwiseTestDataGenerator } from '../../../js/data_generation/n-wise/pairwiseTestDataGenerator.js';
import {
  assertNoCommonErrorPatternsInRows,
  assertNoCommonErrorPatternsInValue,
} from '../utils/outputQualityAssertions.js';

test('generateFromTextSpec returns validation error for missing spec', () => {
  const result = generateFromTextSpec({ textSpec: '', rowCount: 1, outputFormat: 'json' });
  expect(result.ok).toBe(false);
  expect(result.errors.length).toBeGreaterThan(0);
});

test('generateFromTextSpec returns validation error for invalid rowCount', () => {
  const result = generateFromTextSpec({ textSpec: 'Name\nBob', rowCount: -1, outputFormat: 'json' });
  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_row_count',
    })
  );
});

test('generateFromTextSpec returns validation error for invalid output format', () => {
  const result = generateFromTextSpec({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'invalid-format' });
  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_output_format',
    })
  );
});

test('generateFromTextSpec generates rows for valid spec', () => {
  const result = generateFromTextSpec({ textSpec: 'Name\nBob', rowCount: 2, outputFormat: 'json' });
  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Name']);
  expect(result.rows.length).toBe(2);
  expect(result.rows).toEqual([['Bob'], ['Bob']]);
  assertNoCommonErrorPatternsInRows(result.rows);
});

test('generateFromTextSpec supports pict-style inline schema definitions', () => {
  const result = generateFromTextSpec({
    textSpec: 'Browser: Chrome,Firefox,Safari\nStatus: enum("Open","Closed")\nName: person.fullName',
    rowCount: 3,
    outputFormat: 'json',
  });

  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Browser', 'Status', 'Name']);
  expect(result.rows).toHaveLength(3);
  result.rows.forEach((row) => {
    expect(['Chrome', 'Firefox', 'Safari']).toContain(row[0]);
    expect(['Open', 'Closed']).toContain(row[1]);
    expect(String(row[2]).length).toBeGreaterThan(0);
  });
  assertNoCommonErrorPatternsInRows(result.rows);
});

test('generateFromTextSpec serializes object return values as JSON strings', () => {
  const result = generateFromTextSpec({
    textSpec: 'Currency\nfinance.currency',
    rowCount: 1,
    outputFormat: 'csv',
  });

  expect(result.ok).toBe(true);
  expect(result.rows).toHaveLength(1);
  expect(typeof result.rows[0][0]).toBe('string');
  expect(result.rows[0][0].startsWith('{')).toBe(true);
  expect(result.rows[0][0]).toContain('"code"');
  expect(result.rows[0][0]).not.toContain('[object Object]');
  expect(result.rendered).not.toContain('[object Object]');
  assertNoCommonErrorPatternsInRows(result.rows);
});

test('generateFromTextSpec accepts comments and blank lines in spec', () => {
  const result = generateFromTextSpec({
    textSpec: '# comment\n\nPriority\nenum(high,medium,low)\n\nStatus\nenum(active,inactive,pending)',
    rowCount: 2,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Priority', 'Status']);
  expect(result.rows.length).toBe(2);
  for (const row of result.rows) {
    expect(['high', 'medium', 'low']).toContain(row[0]);
    expect(['active', 'inactive', 'pending']).toContain(row[1]);
  }
  assertNoCommonErrorPatternsInRows(result.rows);
});

test('generateFromTextSpec accepts # prefixed rule content lines', () => {
  const result = generateFromTextSpec({
    textSpec: 'Color\n#[A-F0-9]{6}',
    rowCount: 2,
    outputFormat: 'json',
  });
  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Color']);
  expect(result.rows).toHaveLength(2);
  for (const row of result.rows) {
    expect(row[0]).toMatch(/^#[A-F0-9]{6}$/);
  }
  assertNoCommonErrorPatternsInRows(result.rows);
});

test('generateFromTextSpec enforces IF THEN constraints during row generation', () => {
  const result = generateFromTextSpec({
    textSpec: `Priority
enum(high,low)
Status
enum(open,closed)
IF [Priority] = "high" THEN [Status] = "open" ENDIF`,
    rowCount: 20,
    outputFormat: 'json',
  });

  expect(result.ok).toBe(true);
  result.rows.forEach((row) => {
    if (row[0] === 'high') {
      expect(row[1]).toBe('open');
    }
  });
});

test('generateFromTextSpec returns an early validation error for impossible literal constraints', () => {
  const result = generateFromTextSpec({
    textSpec: `Status
literal(closed)
IF [Status] = "closed" THEN [Status] = "open" ENDIF`,
    rowCount: 1,
    outputFormat: 'json',
  });

  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_constraint_literal_value',
      parameterName: 'Status',
    })
  );
});

test('generateFromTextSpec returns semantic constraint validation errors for invalid enum and regex values', () => {
  const enumResult = generateFromTextSpec({
    textSpec: `Priority
enum(high,low)

IF [Priority] = "urgent" THEN [Priority] = "high" ENDIF`,
    rowCount: 1,
    outputFormat: 'json',
  });

  expect(enumResult.ok).toBe(false);
  expect(enumResult.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_constraint_enum_value',
      parameterName: 'Priority',
    })
  );

  const regexResult = generateFromTextSpec({
    textSpec: `Ticket
[A-Z]{3}-\\d{4}

IF [Ticket] = "bob" THEN [Ticket] <> "ABC-1234" ENDIF`,
    rowCount: 1,
    outputFormat: 'json',
  });

  expect(regexResult.ok).toBe(false);
  expect(regexResult.errors).toContainEqual(
    expect.objectContaining({
      code: 'invalid_constraint_regex_value',
      parameterName: 'Ticket',
    })
  );
});

test('generateFromTextSpec stops when constraints make row generation impossible at runtime', () => {
  const result = generateFromTextSpec({
    textSpec: `Status
enum("Open","Closed")

IF [Status] = "Open" THEN [Status] = "Closed";
IF [Status] = "Closed" THEN [Status] = "Open";`,
    rowCount: 3,
    outputFormat: 'json',
  });

  expect(result.ok).toBe(false);
  expect(result.errors).toContainEqual(
    expect.objectContaining({
      code: 'constraint_generation_failed',
      message:
        'Schema Constraints are impacting row generation - generated 0 rows, failed to generate 1000 rows. Consider changing constraints to improve row generation.',
      generatedCount: 0,
      failedCount: 1000,
    })
  );
});

test('validateSafeFakerRules ignores constraint lines when checking faker rules', () => {
  const result = validateSafeFakerRules(`Name
person.firstName("female")
Status
enum(active,inactive)
IF [Status] = "inactive" THEN [Name] <> "" ENDIF`);

  expect(result.ok).toBe(true);
});

test('generateFromTextSpec renders test framework output', () => {
  const result = generateFromTextSpec({ textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'pytest' });
  expect(result.ok).toBe(true);
  expect(result.format).toBe('pytest');
  expect(result.rendered).toMatch(/@pytest\.mark\.parametrize/);
  expect(result.rendered).toMatch(/Bob/);
});

test('generateFromTextSpec renders data-bearing output for all unit test frameworks', () => {
  const unitTestFrameworks = [
    'junit4',
    'junit5',
    'junit6',
    'testng',
    'pytest',
    'unittest',
    'nose2',
    'jest',
    'vitest',
    'mocha',
    'xunit',
    'nunit',
    'mstest',
    'rspec',
    'minitest',
    'phpunit',
    'pest',
    'kotest',
    'junit5-kotlin',
    'spek',
    'test-more',
    'test2-suite',
  ].filter((format) => SUPPORTED_FORMATS.includes(format));

  for (const outputFormat of unitTestFrameworks) {
    const result = generateFromTextSpec({ textSpec: 'Name\nBob', rowCount: 1, outputFormat });
    expect(result.ok).toBe(true);
    expect(result.format).toBe(outputFormat);
    expect(typeof result.rendered).toBe('string');
    expect(result.rendered.length).toBeGreaterThan(0);
    expect(result.rendered).toMatch(/Bob/);
    assertNoCommonErrorPatternsInValue(result.rendered);
  }
});

test('validateSafeFakerRules rejects unsafe expression syntax', () => {
  const result = validateSafeFakerRules('Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})');
  expect(result.ok).toBe(false);
});

test('validateSafeFakerRules rejects unknown faker commands in safe mode', () => {
  const result = validateSafeFakerRules('Name\nfaker.person.madeUpMethod()');
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/Unknown faker command in safe mode/);
});

test('validateSafeFakerRules rejects forbidden faker commands in safe mode', () => {
  const result = validateSafeFakerRules('Value\nhelpers.objectKey({"red":"#f00"})');
  expect(result.ok).toBe(false);
  expect(result.error).toMatch(/Forbidden faker command in safe mode/);
});

test('validateSafeFakerRules accepts known faker commands with literal args', () => {
  const result = validateSafeFakerRules('Name\nperson.firstName("female")');
  expect(result.ok).toBe(true);
});

test('validateSafeFakerRules accepts pict-style inline faker commands', () => {
  const result = validateSafeFakerRules('Name: person.firstName("female")\nStatus: enum(active,inactive)');
  expect(result.ok).toBe(true);
});

test('validateSafeFakerRules accepts registered domain keywords', () => {
  const result = validateSafeFakerRules(
    'CreatedAt\nautoIncrement.timestamp(start="12th June 2026 at 4pm", step=60, type="minutes")'
  );
  expect(result.ok).toBe(true);
});

test('validateSafeFakerRules accepts js-style object literal faker args', () => {
  const result = validateSafeFakerRules('Template\nhelpers.mustache("{{name}}", { name: "Ada" })');
  expect(result.ok).toBe(true);
});

test('generateFromTextSpec supports complex safe expressions with hybrid approach', () => {
  // Test that safe JSON object expressions work with hybrid approach
  const safeResult = generateFromTextSpec({
    textSpec: 'Age\nnumber.int({"min": 18, "max": 65})',
    rowCount: 1,
    outputFormat: 'json',
  });
  expect(safeResult.ok).toBe(true);

  // Verify the generated age is in the expected range
  const age = safeResult.rows[0][0];
  expect(typeof age).toBe('number');
  expect(age).toBeGreaterThanOrEqual(18);
  expect(age).toBeLessThanOrEqual(65);
  assertNoCommonErrorPatternsInRows(safeResult.rows);

  const mustacheResult = generateFromTextSpec({
    textSpec: 'Template\nhelpers.mustache("{{name}}", { name: "Ada" })',
    rowCount: 1,
    outputFormat: 'json',
  });
  expect(mustacheResult.ok).toBe(true);
  expect(mustacheResult.rows).toEqual([['Ada']]);
  assertNoCommonErrorPatternsInRows(mustacheResult.rows);

  // Test that unsafeFakerExpressions flag is accepted and processed
  const testSpec = 'Test\nBob';

  // Verify the flag can be passed without breaking generation
  const withoutFlag = generateFromTextSpec({
    textSpec: testSpec,
    rowCount: 1,
    outputFormat: 'json',
  });

  const withFlag = generateFromTextSpec({
    textSpec: testSpec,
    rowCount: 1,
    outputFormat: 'json',
    unsafeFakerExpressions: true,
  });

  // Both should succeed for simple literal content
  expect(withoutFlag.ok).toBe(true);
  expect(withFlag.ok).toBe(true);

  // Results should be identical for safe content
  expect(withoutFlag.rows).toEqual(withFlag.rows);
  assertNoCommonErrorPatternsInRows(withFlag.rows);
});

test('generateFromTextSpec applies csv options via exporter pipeline', () => {
  const withHeader = generateFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 1,
    outputFormat: 'csv',
  });
  const withoutHeader = generateFromTextSpec({
    textSpec: 'Name\nBob',
    rowCount: 1,
    outputFormat: 'csv',
    options: { header: false },
  });

  expect(withHeader.ok).toBe(true);
  expect(withoutHeader.ok).toBe(true);
  expect(withHeader.rendered).toMatch(/Name/);
  expect(withoutHeader.rendered).not.toMatch(/Name/);
  assertNoCommonErrorPatternsInValue(withHeader.rendered);
  assertNoCommonErrorPatternsInValue(withoutHeader.rendered);
});

test('generateFromTextSpec is deterministic for repeated seeded runs', () => {
  const payload = {
    textSpec: 'firstName\nperson.firstName',
    rowCount: 5,
    outputFormat: 'json',
    seed: 4242,
  };

  const first = generateFromTextSpec(payload);
  const second = generateFromTextSpec(payload);

  expect(first.ok).toBe(true);
  expect(second.ok).toBe(true);
  expect(first.rows).toEqual(second.rows);
  assertNoCommonErrorPatternsInRows(first.rows);
});

test('generateFromTextSpec isolates faker state across different seeds', () => {
  const spec = 'firstName\nperson.firstName';
  const seededA1 = generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed: 101 });
  const seededB = generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed: 202 });
  const seededA2 = generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed: 101 });

  expect(seededA1.ok).toBe(true);
  expect(seededB.ok).toBe(true);
  expect(seededA2.ok).toBe(true);
  expect(seededA1.rows).toEqual(seededA2.rows);
  expect(seededA1.rows).not.toEqual(seededB.rows);
  assertNoCommonErrorPatternsInRows(seededA1.rows);
  assertNoCommonErrorPatternsInRows(seededB.rows);
});

test('generateFromTextSpec remains deterministic under overlapping seeded invocations', async () => {
  const spec = 'firstName\nperson.firstName';
  const run = async (seed, delayMs) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed });
  };

  const [a, b, aAgain] = await Promise.all([run(303, 0), run(404, 1), run(303, 2)]);
  expect(a.ok).toBe(true);
  expect(b.ok).toBe(true);
  expect(aAgain.ok).toBe(true);
  expect(a.rows).toEqual(aAgain.rows);
  expect(a.rows).not.toEqual(b.rows);
  assertNoCommonErrorPatternsInRows(a.rows);
  assertNoCommonErrorPatternsInRows(b.rows);
});

test('generateFromTextSpec supports pairwise generation for enum rules', () => {
  const result = generateFromTextSpec({
    textSpec: 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark\nRegion\nUS,EU',
    rowCount: 100,
    outputFormat: 'json',
    pairwise: true,
  });

  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Browser', 'Theme', 'Region']);
  expect(result.rows.length).toBeLessThan(3 * 2 * 2);

  const valuesByHeader = {
    Browser: ['Chrome', 'Firefox', 'Safari'],
    Theme: ['Light', 'Dark'],
    Region: ['US', 'EU'],
  };
  const getValue = (row, header) => row[result.headers.indexOf(header)];

  const coveredPairs = new Set();
  for (const row of result.rows) {
    expect(valuesByHeader.Browser).toContain(getValue(row, 'Browser'));
    expect(valuesByHeader.Theme).toContain(getValue(row, 'Theme'));
    expect(valuesByHeader.Region).toContain(getValue(row, 'Region'));
    coveredPairs.add(`Browser:${getValue(row, 'Browser')}|Theme:${getValue(row, 'Theme')}`);
    coveredPairs.add(`Browser:${getValue(row, 'Browser')}|Region:${getValue(row, 'Region')}`);
    coveredPairs.add(`Theme:${getValue(row, 'Theme')}|Region:${getValue(row, 'Region')}`);
  }
  assertNoCommonErrorPatternsInRows(result.rows);

  for (const browser of valuesByHeader.Browser) {
    for (const theme of valuesByHeader.Theme) {
      expect(coveredPairs.has(`Browser:${browser}|Theme:${theme}`)).toBe(true);
    }
    for (const region of valuesByHeader.Region) {
      expect(coveredPairs.has(`Browser:${browser}|Region:${region}`)).toBe(true);
    }
  }
  for (const theme of valuesByHeader.Theme) {
    for (const region of valuesByHeader.Region) {
      expect(coveredPairs.has(`Theme:${theme}|Region:${region}`)).toBe(true);
    }
  }

  expect(result.diagnostics.pairwise).toBe(true);
  expect(result.diagnostics.rowCount).toBe(result.rows.length);
  expect(result.diagnostics.warnings).toContain('rowCount is ignored when pairwise generation is enabled.');
});

test('generateFromTextSpec rejects pairwise mode with fewer than 2 enum rules', () => {
  const result = generateFromTextSpec({
    textSpec: 'OnlyOne\nA,B,C',
    rowCount: 10,
    outputFormat: 'json',
    pairwise: true,
  });

  expect(result.ok).toBe(false);
  expect(result.errors[0].code).toBe('pairwise_initialization_error');
  expect(result.errors[0].message).toMatch(/requires at least 2 ENUM parameters/i);
});

test('generateFromTextSpec uses fallback message for pairwise initialization failures without errorMessage', () => {
  const originalInitializeFromRules = PairwiseTestDataGenerator.prototype.initializeFromRules;
  PairwiseTestDataGenerator.prototype.initializeFromRules = () => ({ isError: true });
  try {
    const result = generateFromTextSpec({
      textSpec: 'A\n1,2\nB\nx,y',
      rowCount: 10,
      outputFormat: 'json',
      pairwise: true,
    });
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toEqual(
      expect.objectContaining({
        code: 'pairwise_initialization_error',
        message: 'Failed to initialize pairwise generation.',
      })
    );
  } finally {
    PairwiseTestDataGenerator.prototype.initializeFromRules = originalInitializeFromRules;
  }
});

test('generateFromTextSpec uses fallback message for pairwise generation failures without errorMessage', () => {
  const originalGenerateAllDataRecordsAsRows = PairwiseTestDataGenerator.prototype.generateAllDataRecordsAsRows;
  PairwiseTestDataGenerator.prototype.generateAllDataRecordsAsRows = () => ({ isError: true });
  try {
    const result = generateFromTextSpec({
      textSpec: 'A\n1,2\nB\nx,y',
      rowCount: 10,
      outputFormat: 'json',
      pairwise: true,
    });
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toEqual(
      expect.objectContaining({
        code: 'pairwise_generation_error',
        message: 'Failed to generate pairwise rows.',
      })
    );
  } finally {
    PairwiseTestDataGenerator.prototype.generateAllDataRecordsAsRows = originalGenerateAllDataRecordsAsRows;
  }
});

test('generateFromTextSpec pairwise preserves original interleaved column order', () => {
  const result = generateFromTextSpec({
    textSpec: 'Name\nBob\nBrowser\nChrome,Firefox,Safari\nAge\n30\nTheme\nLight,Dark',
    rowCount: 100,
    outputFormat: 'json',
    pairwise: true,
  });

  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Name', 'Browser', 'Age', 'Theme']);
  expect(result.rows).toEqual([
    ['Bob', 'Chrome', '30', 'Light'],
    ['Bob', 'Chrome', '30', 'Dark'],
    ['Bob', 'Firefox', '30', 'Light'],
    ['Bob', 'Firefox', '30', 'Dark'],
    ['Bob', 'Safari', '30', 'Light'],
    ['Bob', 'Safari', '30', 'Dark'],
  ]);
  assertNoCommonErrorPatternsInRows(result.rows);
});
