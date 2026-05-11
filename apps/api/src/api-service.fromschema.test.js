import { SUPPORTED_FORMATS } from '@anywaydata/core';
import { createConcreteService } from './api-service.test-helpers.js';

describe('api-service handleFromSchemaRequest', () => {
  test('generates from text/plain schema', () => {
    const { service } = createConcreteService();
    const result = service.handleFromSchemaRequest({
      body: 'Name\nBob',
      query: { rowCount: '1' },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.headers).toEqual(['Name']);
    expect(result.body.rows).toHaveLength(1);
  });

  test('supports all output formats in query', () => {
    const { service } = createConcreteService();
    for (const outputFormat of SUPPORTED_FORMATS) {
      const result = service.handleFromSchemaRequest({
        body: 'Name\nBob',
        query: { rowCount: '1', outputFormat },
      });
      expect(result.statusCode).toBe(200);
      expect(result.body.format).toBe(outputFormat);
    }
  });

  test('supports responseFormat query values', () => {
    const { service } = createConcreteService();
    const modes = ['rows', 'rendered', 'all', 'raw'];
    for (const responseFormat of modes) {
      const result = service.handleFromSchemaRequest({
        body: 'Name\nBob',
        query: { rowCount: '1', responseFormat, outputFormat: 'csv' },
      });
      expect(result.statusCode).toBe(200);
      if (responseFormat === 'raw') {
        expect(typeof result.raw).toBe('string');
      } else {
        expect(result.body).toBeTruthy();
      }
    }
  });

  test('seed is deterministic', () => {
    const { service } = createConcreteService();
    const query = { rowCount: '2', outputFormat: 'json', seed: '12345' };
    const a = service.handleFromSchemaRequest({ body: 'firstName\nperson.firstName', query });
    const b = service.handleFromSchemaRequest({ body: 'firstName\nperson.firstName', query });
    expect(a.statusCode).toBe(200);
    expect(b.statusCode).toBe(200);
    expect(a.body.rows).toEqual(b.body.rows);
  });

  test('supports pairwise query generation', () => {
    const { service } = createConcreteService();
    const result = service.handleFromSchemaRequest({
      body: 'Browser\nChrome,Firefox,Safari\nTheme\nLight,Dark',
      query: { rowCount: '50', pairwise: 'true', outputFormat: 'json' },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.headers).toEqual(['Browser', 'Theme']);
    expect(result.body.rows).toEqual([
      ['Chrome', 'Light'],
      ['Chrome', 'Dark'],
      ['Firefox', 'Light'],
      ['Firefox', 'Dark'],
      ['Safari', 'Light'],
      ['Safari', 'Dark'],
    ]);
  });

  test('supports complex schema', () => {
    const { service } = createConcreteService();
    const body = `Name\nfirstName\nEmail\nemail\nAge\ndatatype.number({"min":18,"max":65})\nCity\nlocation.city`;
    const result = service.handleFromSchemaRequest({ body, query: { rowCount: '3' } });

    expect(result.statusCode).toBe(200);
    expect(result.body.headers).toEqual(['Name', 'Email', 'Age', 'City']);
    expect(result.body.rows).toHaveLength(3);
  });

  test('rejects non-string body', () => {
    const { service } = createConcreteService();
    const result = service.handleFromSchemaRequest({
      body: { textSpec: 'Name\nBob' },
      query: { rowCount: '1' },
    });

    expect(result.statusCode).toBe(400);
    expect(result.body.errors[0]).toMatch(/text\/plain request body is required/);
  });

  test('rejects missing rowCount', () => {
    const { service } = createConcreteService();
    const result = service.handleFromSchemaRequest({ body: 'Name\nBob', query: {} });
    expect(result.statusCode).toBe(400);
  });

  test('rejects invalid rowCount/outputFormat/responseFormat/seed and empty schema', () => {
    const { service } = createConcreteService();

    expect(service.handleFromSchemaRequest({ body: 'Name\nBob', query: { rowCount: '-1' } }).statusCode).toBe(400);
    expect(
      service.handleFromSchemaRequest({ body: 'Name\nBob', query: { rowCount: '1', outputFormat: 'invalid' } })
        .statusCode
    ).toBe(400);
    expect(
      service.handleFromSchemaRequest({ body: 'Name\nBob', query: { rowCount: '1', responseFormat: 'nope' } })
        .statusCode
    ).toBe(400);
    expect(
      service.handleFromSchemaRequest({ body: 'Name\nBob', query: { rowCount: '1', seed: 'invalid' } }).statusCode
    ).toBe(400);
    expect(service.handleFromSchemaRequest({ body: '', query: { rowCount: '1' } }).statusCode).toBe(400);
  });
});
