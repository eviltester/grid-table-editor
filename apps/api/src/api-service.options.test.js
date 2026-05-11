import { SUPPORTED_FORMATS } from '@anywaydata/core';
import { createConcreteService } from './api-service.test-helpers.js';

describe('api-service options service calls', () => {
  test('handleGetOptionsRequest returns defaults for all supported formats', () => {
    const { service } = createConcreteService();

    for (const format of SUPPORTED_FORMATS) {
      const result = service.handleGetOptionsRequest({ format });
      expect(result.statusCode).toBe(200);
      expect(result.body.format).toBe(format);
      expect(typeof result.body.options).toBe('object');
      expect(typeof result.body.tips).toBe('object');
      expect(['custom-default', 'built-in-default']).toContain(result.body.source);
    }
  });

  test('set/get/reset lifecycle works for csv', () => {
    const { service } = createConcreteService();

    const setResult = service.handleSetOptionsRequest({
      format: 'csv',
      body: { header: false, quotes: true, quoteChar: "'" },
    });
    expect(setResult.statusCode).toBe(200);
    expect(setResult.body.options.header).toBe(false);
    expect(setResult.body.options.quotes).toBe(true);

    const getAfterSet = service.handleGetOptionsRequest({ format: 'csv' });
    expect(getAfterSet.body.source).toBe('custom-default');
    expect(getAfterSet.body.options.header).toBe(false);

    const reset = service.handleResetOptionsRequest({ format: 'csv' });
    expect(reset.statusCode).toBe(200);
    expect(reset.body.source).toBe('built-in-default');
  });

  test('supports custom tips and invalid tips payload fails', () => {
    const { service } = createConcreteService();

    const set = service.handleSetOptionsRequest({
      format: 'csv',
      body: { header: true, tips: { header: 'Custom tip for header option' } },
    });
    expect(set.statusCode).toBe(200);
    expect(set.body.tips.header).toBe('Custom tip for header option');

    const bad = service.handleSetOptionsRequest({
      format: 'csv',
      body: { header: true, tips: 'invalid-tips-should-be-object' },
    });
    expect(bad.statusCode).toBe(400);
  });

  test('set options for another format works', () => {
    const { service } = createConcreteService();
    const result = service.handleSetOptionsRequest({
      format: 'json',
      body: { prettyPrint: true, makeNumbersNumeric: false },
    });
    expect(result.statusCode).toBe(200);
    expect(result.body.format).toBe('json');
    expect(result.body.source).toBe('custom-default');
  });

  test('rejects non-object payload', () => {
    const { service } = createConcreteService();
    for (const payload of ['string-payload', 123, ['array', 'payload'], null]) {
      const result = service.handleSetOptionsRequest({ format: 'csv', body: payload });
      expect(result.statusCode).toBe(400);
      expect(Array.isArray(result.body.errors)).toBe(true);
    }
  });

  test('separate formats keep independent state', () => {
    const { service } = createConcreteService();

    service.handleSetOptionsRequest({ format: 'csv', body: { header: false } });
    service.handleSetOptionsRequest({ format: 'json', body: { prettyPrint: false } });

    const csv = service.handleGetOptionsRequest({ format: 'csv' });
    const json = service.handleGetOptionsRequest({ format: 'json' });

    expect(csv.body.source).toBe('custom-default');
    expect(json.body.source).toBe('custom-default');
    expect(csv.body.options).not.toEqual(json.body.options);
  });

  test('generate call uses saved defaults when options are omitted', () => {
    const { service } = createConcreteService();

    service.handleSetOptionsRequest({ format: 'dsv', body: { options: { header: false } } });
    const generated = service.handleGenerateRequest({
      body: {
        textSpec: 'Name\nBob',
        rowCount: 1,
        outputFormat: 'dsv',
        responseFormat: 'raw',
      },
    });

    expect(generated.statusCode).toBe(200);
    expect(generated.raw.includes('Name')).toBe(false);
  });

  test('options calls validate bad format and payload shapes', () => {
    const { service } = createConcreteService();

    expect(service.handleGetOptionsRequest({ format: 'invalid-format' }).statusCode).toBe(400);
    expect(
      service.handleSetOptionsRequest({ format: 'invalid-format', body: { someOption: 'value' } }).statusCode
    ).toBe(400);
    expect(service.handleResetOptionsRequest({ format: 'invalid-format' }).statusCode).toBe(400);
  });
});
