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

test('generateFromTextSpec rejects unsafe faker expressions by default', () => {
  const result = generateFromTextSpec({
    textSpec: 'Sentence\nhelpers.mustache("x", {count: () => `${this.number.int()}`})',
    rowCount: 1,
    outputFormat: 'json',
  });
  assert.equal(result.ok, false);
  assert.match(result.errors[0], /Unsafe faker rule syntax detected/);
});
