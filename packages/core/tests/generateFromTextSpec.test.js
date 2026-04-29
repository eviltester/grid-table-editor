import test from 'node:test';
import assert from 'node:assert/strict';
import { generateFromTextSpec } from '../src/index.js';

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
