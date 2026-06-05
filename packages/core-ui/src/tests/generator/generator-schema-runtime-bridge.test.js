import { describe, expect, jest, test } from '@jest/globals';
import { createGeneratorSchemaRuntimeBridge } from '../../../js/gui_components/generator/runtime/generator-schema-runtime-bridge.js';

describe('generator schema runtime bridge', () => {
  test('routes generation errors to generator status and schema errors to schema status', () => {
    const showSchemaErrorStatus = jest.fn();
    const clearSchemaErrorStatus = jest.fn();
    const setGenerationStatus = jest.fn();
    const scheduleClearGenerationStatus = jest.fn();

    const bridge = createGeneratorSchemaRuntimeBridge({
      getSchemaDefinition: jest.fn(),
      getSchemaRows: () => [],
      getSchemaTextTokens: () => [],
      validateSchemaRows: jest.fn(),
      showSchemaErrorStatus,
      clearSchemaErrorStatus,
      setGenerationStatus,
      scheduleClearGenerationStatus,
    });

    bridge.surfacePageError('Bad export');
    expect(setGenerationStatus).toHaveBeenCalledWith('Bad export', {
      severity: 'error',
      dismissable: true,
    });
    expect(scheduleClearGenerationStatus).toHaveBeenCalledWith(5000);

    bridge.surfacePageError('Bad schema', { useSchemaStatus: true });
    expect(showSchemaErrorStatus).toHaveBeenCalledWith('Bad schema');

    bridge.clearSchemaErrorStatus();
    expect(clearSchemaErrorStatus).toHaveBeenCalledTimes(1);
  });

  test('revalidates rows and syncs text-mode schema through the shared schema definition', () => {
    const validateSchemaRows = jest.fn((rows) => ({ rows, errors: ['semantic'] }));
    const schemaDefinition = {
      getState: jest.fn(() => ({ isTextMode: false })),
      validateRows: jest.fn(() => ({
        rows: [{ name: 'Name' }],
        errors: ['schema error'],
      })),
    };

    const bridge = createGeneratorSchemaRuntimeBridge({
      getSchemaDefinition: () => schemaDefinition,
      getSchemaRows: () => [{ name: 'Name' }],
      getSchemaTextTokens: () => [{ kind: 'rule' }],
      validateSchemaRows,
      showSchemaErrorStatus: jest.fn(),
      clearSchemaErrorStatus: jest.fn(),
      setGenerationStatus: jest.fn(),
      scheduleClearGenerationStatus: jest.fn(),
    });

    expect(bridge.revalidateSchemaRows()).toEqual({
      rows: [{ name: 'Name' }],
      errors: ['schema error'],
    });

    expect(bridge.syncSchemaRowsFromTextMode()).toEqual({
      rows: [{ name: 'Name' }],
      errors: ['schema error'],
      tokens: [{ kind: 'rule' }],
    });
    expect(schemaDefinition.validateRows).toHaveBeenCalledTimes(2);
    expect(validateSchemaRows).not.toHaveBeenCalled();
  });
});
