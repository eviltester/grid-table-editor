import { generateFromTextSpec, validateSafeFakerRules, SUPPORTED_FORMATS } from '../../index.js';

test('generateFromTextSpec returns validation error for missing spec', () => {
  const result = generateFromTextSpec({ textSpec: '', rowCount: 1, outputFormat: 'json' });
  expect(result.ok).toBe(false);
  expect(result.errors.length > 0).toBeTruthy();
});

test('generateFromTextSpec generates rows for valid spec', () => {
  const result = generateFromTextSpec({ textSpec: 'Name\nBob', rowCount: 2, outputFormat: 'json' });
  expect(result.ok).toBe(true);
  expect(result.headers).toEqual(['Name']);
  expect(result.rows.length).toBe(2);
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
    expect(result.rendered.length > 0).toBeTruthy();
    expect(result.rendered).toMatch(/Bob/);
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

test('validateSafeFakerRules accepts known faker commands with literal args', () => {
  const result = validateSafeFakerRules('Name\nperson.firstName("female")');
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
  expect(age >= 18 && age <= 65).toBeTruthy();

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
});
