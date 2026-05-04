import test from 'node:test';
import assert from 'node:assert/strict';
import { generateFromTextSpec, validateSafeFakerRules } from '../src/index.js';

test('generateFromTextSpec returns validation error for missing spec', () => {
  const result = generateFromTextSpec({ textSpec: '', rowCount: 1, outputFormat: 'json' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.length > 0);
});

test('generateFromTextSpec generates rows for valid spec', () => {
  const result = generateFromTextSpec({ textSpec: 'Name\nBob', rowCount: 2, outputFormat: 'json' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.headers, ['Name']);
  assert.equal(result.rows.length, 2);
});

test('validateSafeFakerRules rejects unsafe expression syntax', () => {
  const result = validateSafeFakerRules('Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})');
  assert.equal(result.ok, false);
});

test('validateSafeFakerRules rejects unknown faker commands in safe mode', () => {
  const result = validateSafeFakerRules('Name\nfaker.person.madeUpMethod()');
  assert.equal(result.ok, false);
  assert.match(result.error, /Unknown faker command in safe mode/);
});

test('validateSafeFakerRules accepts known faker commands with literal args', () => {
  const result = validateSafeFakerRules('Name\nperson.firstName("female")');
  assert.equal(result.ok, true);
});

test('generateFromTextSpec supports complex safe expressions with hybrid approach', () => {
  // Test that safe JSON object expressions work with hybrid approach
  const safeResult = generateFromTextSpec({
    textSpec: 'Age\nnumber.int({"min": 18, "max": 65})',
    rowCount: 1,
    outputFormat: 'json',
  });
  assert.equal(safeResult.ok, true);

  // Verify the generated age is in the expected range
  const age = safeResult.rows[0][0];
  assert.equal(typeof age, 'number');
  assert.ok(age >= 18 && age <= 65);

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
  assert.equal(withoutFlag.ok, true);
  assert.equal(withFlag.ok, true);

  // Results should be identical for safe content
  assert.deepEqual(withoutFlag.rows, withFlag.rows);
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

  assert.equal(withHeader.ok, true);
  assert.equal(withoutHeader.ok, true);
  assert.match(withHeader.rendered, /Name/);
  assert.doesNotMatch(withoutHeader.rendered, /Name/);
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

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.deepEqual(first.rows, second.rows);
});

test('generateFromTextSpec isolates faker state across different seeds', () => {
  const spec = 'firstName\nperson.firstName';
  const seededA1 = generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed: 101 });
  const seededB = generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed: 202 });
  const seededA2 = generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed: 101 });

  assert.equal(seededA1.ok, true);
  assert.equal(seededB.ok, true);
  assert.equal(seededA2.ok, true);
  assert.deepEqual(seededA1.rows, seededA2.rows);
  assert.notDeepEqual(seededA1.rows, seededB.rows);
});

test('generateFromTextSpec remains deterministic under overlapping seeded invocations', async () => {
  const spec = 'firstName\nperson.firstName';
  const run = async (seed, delayMs) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return generateFromTextSpec({ textSpec: spec, rowCount: 5, outputFormat: 'json', seed });
  };

  const [a, b, aAgain] = await Promise.all([run(303, 0), run(404, 1), run(303, 2)]);
  assert.equal(a.ok, true);
  assert.equal(b.ok, true);
  assert.equal(aAgain.ok, true);
  assert.deepEqual(a.rows, aAgain.rows);
  assert.notDeepEqual(a.rows, b.rows);
});
