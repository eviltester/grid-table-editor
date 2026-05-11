import { SUPPORTED_FORMATS } from '@anywaydata/core';
import { createConcreteService } from './api-service.test-helpers.js';

describe('api-service handleGenerateRequest', () => {
  test('returns rows payload by default', () => {
    const { service } = createConcreteService();
    const result = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv' },
    });

    expect(result.statusCode).toBe(200);
    expect(Array.isArray(result.body.headers)).toBe(true);
    expect(Array.isArray(result.body.rows)).toBe(true);
    expect(result.body.rendered).toBeUndefined();
  });

  test('supports all output formats', () => {
    const { service } = createConcreteService();
    for (const outputFormat of SUPPORTED_FORMATS) {
      const result = service.handleGenerateRequest({
        body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat },
      });
      expect(result.statusCode).toBe(200);
      expect(result.body.format).toBe(outputFormat);
    }
  });

  test('supports response formats rendered/all/raw', () => {
    const { service } = createConcreteService();

    const renderedResult = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv', responseFormat: 'rendered' },
    });
    expect(renderedResult.statusCode).toBe(200);
    expect(typeof renderedResult.body.rendered).toBe('string');

    const allResult = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv', responseFormat: 'all' },
    });
    expect(allResult.statusCode).toBe(200);
    expect(typeof allResult.body.rendered).toBe('string');

    const rawResult = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv', responseFormat: 'raw' },
    });
    expect(rawResult.statusCode).toBe(200);
    expect(typeof rawResult.raw).toBe('string');
    expect(rawResult.contentType).toMatch(/text\/csv/i);
  });

  test('seed is deterministic for faker output', () => {
    const { service } = createConcreteService();
    const body = {
      textSpec: 'firstName\nperson.firstName',
      rowCount: 3,
      outputFormat: 'json',
      seed: 12345,
    };
    const a = service.handleGenerateRequest({ body });
    const b = service.handleGenerateRequest({ body });

    expect(a.statusCode).toBe(200);
    expect(b.statusCode).toBe(200);
    expect(a.body.rows).toEqual(b.body.rows);
  });

  test('supports custom options and large rowCount', () => {
    const { service } = createConcreteService();
    const withOptions = service.handleGenerateRequest({
      body: {
        textSpec: 'Name\nBob',
        rowCount: 1,
        outputFormat: 'csv',
        options: { header: false, quotes: true },
        responseFormat: 'raw',
      },
    });
    expect(withOptions.statusCode).toBe(200);
    expect(withOptions.raw.includes('Name')).toBe(false);

    const large = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 100, outputFormat: 'json' },
    });
    expect(large.statusCode).toBe(200);
    expect(large.body.rows).toHaveLength(100);
  });

  test('rejects invalid responseFormat', () => {
    const { service } = createConcreteService();
    const result = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv', responseFormat: 'nope' },
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.errors[0]).toMatch(/responseFormat/);
  });

  test('rejects invalid outputFormat', () => {
    const { service } = createConcreteService();
    const result = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'badformat' },
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.errors[0]).toMatch(/outputFormat/);
  });

  test('rejects invalid seed', () => {
    const { service } = createConcreteService();
    const result = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: 1, outputFormat: 'csv', seed: 'abc' },
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.errors[0]).toMatch(/finite number/i);
  });

  test('rejects missing required fields and empty text schema', () => {
    const { service } = createConcreteService();
    const missingAll = service.handleGenerateRequest({ body: {} });
    expect(missingAll.statusCode).toBe(400);

    const missingRowCount = service.handleGenerateRequest({ body: { textSpec: 'Name\nBob', outputFormat: 'csv' } });
    expect(missingRowCount.statusCode).toBe(400);

    const missingTextSpec = service.handleGenerateRequest({ body: { rowCount: 1, outputFormat: 'csv' } });
    expect(missingTextSpec.statusCode).toBe(400);

    const emptySpec = service.handleGenerateRequest({ body: { textSpec: '', rowCount: 1, outputFormat: 'csv' } });
    expect(emptySpec.statusCode).toBe(400);
  });

  test('rejects invalid rowCount', () => {
    const { service } = createConcreteService();
    const result = service.handleGenerateRequest({
      body: { textSpec: 'Name\nBob', rowCount: -1, outputFormat: 'csv' },
    });
    expect(result.statusCode).toBe(400);
  });

  test('uses injected global unsafe faker setting', () => {
    const { service, setGlobalUnsafe } = createConcreteService({ unsafeEnabled: false });

    const safeResult = service.handleGenerateRequest({
      body: { textSpec: 'Name\nfaker.person.firstName', rowCount: 1, outputFormat: 'csv' },
    });
    expect(safeResult.statusCode).toBe(200);

    setGlobalUnsafe(true);
    const unsafeResult = service.handleGenerateRequest({
      body: { textSpec: 'Name\nfaker.person.firstName', rowCount: 1, outputFormat: 'csv' },
    });
    expect(unsafeResult.statusCode).toBe(200);
  });
});
