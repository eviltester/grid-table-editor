import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaRuntimeService } from '../../../js/gui_components/generator/runtime/generator-schema-runtime-service.js';

describe('createGeneratorSchemaRuntimeService', () => {
  test('surfaces page errors through generator status by default and schema status when requested', () => {
    const showSchemaErrorStatus = jest.fn();
    const clearSchemaErrorStatus = jest.fn();
    const setGenerationStatus = jest.fn();
    const scheduleClearGenerationStatus = jest.fn();

    const service = createGeneratorSchemaRuntimeService({
      getSchemaDefinition: jest.fn(() => ({
        validateRows: jest.fn(() => ({ rows: [{ name: 'City' }], errors: [] })),
      })),
      getSchemaRows: jest.fn(() => [{ name: 'City' }]),
      getSchemaTextTokens: jest.fn(() => []),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      showSchemaErrorStatus,
      clearSchemaErrorStatus,
      setGenerationStatus,
      scheduleClearGenerationStatus,
    });

    expect(service.revalidateSchemaRows()).toEqual({
      rows: [{ name: 'City' }],
      errors: [],
    });

    service.surfacePageError('Broken schema');
    service.surfacePageError('Schema only', { useSchemaStatus: true });
    service.clearSchemaErrorStatus();

    expect(setGenerationStatus).toHaveBeenCalledWith('Broken schema', {
      severity: 'error',
      dismissable: true,
    });
    expect(scheduleClearGenerationStatus).toHaveBeenCalledWith(5000);
    expect(showSchemaErrorStatus).toHaveBeenCalledWith('Schema only');
    expect(clearSchemaErrorStatus).toHaveBeenCalledTimes(1);
  });

  test('syncs schema rows from text mode through the shared schema definition service', () => {
    const schemaDefinition = {
      getState: jest.fn(() => ({
        rows: [{ name: 'City', sourceType: 'literal', value: 'literal(London)' }],
        isTextMode: true,
      })),
      syncFromText: jest.fn(() => ({
        rows: [{ name: 'City', sourceType: 'literal', value: 'literal(London)' }],
        errors: [],
      })),
      validateRows: jest.fn(() => ({
        rows: [{ name: 'City', sourceType: 'literal', value: 'literal(London)' }],
        errors: [],
      })),
    };

    const service = createGeneratorSchemaRuntimeService({
      getSchemaDefinition: jest.fn(() => schemaDefinition),
      getSchemaRows: jest.fn(() => []),
      getSchemaTextTokens: jest.fn(() => []),
      validateSchemaRows: jest.fn((rows) => ({ rows, errors: [] })),
      showSchemaErrorStatus: jest.fn(),
      clearSchemaErrorStatus: jest.fn(),
      setGenerationStatus: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
    });

    const result = service.syncSchemaRowsFromTextMode({
      showErrors: true,
      applySemanticValidation: true,
    });

    expect(result.errors).toEqual([]);
    expect(schemaDefinition.syncFromText).toHaveBeenCalledWith({
      showErrors: true,
      force: true,
    });
    expect(schemaDefinition.validateRows).toHaveBeenCalledTimes(1);
  });
});
