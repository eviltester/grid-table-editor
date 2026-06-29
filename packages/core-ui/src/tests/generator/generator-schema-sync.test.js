import { jest } from '@jest/globals';
import { syncGeneratorSchemaRowsFromTextMode } from '../../../js/gui_components/generator/runtime/generator-schema-sync.js';

describe('syncGeneratorSchemaRowsFromTextMode', () => {
  test('surfaces formatted schema errors when text sync fails and showErrors is enabled', () => {
    const surfaceSchemaError = jest.fn();
    const revalidateSchemaRows = jest.fn();
    const result = syncGeneratorSchemaRowsFromTextMode({
      schemaDefinition: {
        getState: () => ({ isTextMode: true }),
        syncFromText: () => ({ rows: [], errors: [{ row: 1, message: 'bad rule' }] }),
      },
      getSchemaRows: () => [],
      getSchemaTextTokens: () => [],
      revalidateSchemaRows,
      surfaceSchemaError,
      formatSchemaErrors: jest.fn(() => 'Row 1: bad rule'),
      showErrors: true,
      applySemanticValidation: true,
    });

    expect(surfaceSchemaError).toHaveBeenCalledWith('Row 1: bad rule');
    expect(revalidateSchemaRows).not.toHaveBeenCalled();
    expect(result).toEqual({
      rows: [],
      errors: [{ row: 1, message: 'bad rule' }],
    });
  });

  test('keeps compiler errors from text mode instead of replacing them with row validation errors', () => {
    const compilerError = {
      code: 'compiler_validation_error',
      column: 'Name',
      message: 'Name failed domain validation - Unknown keyword: person.notACommand',
    };
    const revalidateSchemaRows = jest.fn(() => ({
      rows: [{ name: 'Name' }],
      errors: [{ code: 'unknown_domain_command', message: 'Row 1: unknown domain command "person.notACommand".' }],
    }));

    const result = syncGeneratorSchemaRowsFromTextMode({
      schemaDefinition: {
        getState: () => ({ isTextMode: true }),
        syncFromText: () => ({ rows: [{ name: 'Name' }], errors: [compilerError] }),
      },
      getSchemaRows: () => [],
      getSchemaTextTokens: () => [{ kind: 'rule' }],
      revalidateSchemaRows,
      surfaceSchemaError: jest.fn(),
      formatSchemaErrors: jest.fn(() => compilerError.message),
      showErrors: true,
      applySemanticValidation: true,
    });

    expect(revalidateSchemaRows).not.toHaveBeenCalled();
    expect(result.errors).toEqual([compilerError]);
  });

  test('returns semantic validation results when not in text mode', () => {
    const revalidateSchemaRows = jest.fn(() => ({
      rows: [{ name: 'Name' }],
      errors: ['missing command'],
    }));

    const result = syncGeneratorSchemaRowsFromTextMode({
      schemaDefinition: {
        getState: () => ({ isTextMode: false }),
      },
      getSchemaRows: () => [{ name: 'Name' }],
      getSchemaTextTokens: () => [{ kind: 'rule' }],
      revalidateSchemaRows,
      surfaceSchemaError: jest.fn(),
      formatSchemaErrors: jest.fn(),
      showErrors: false,
      applySemanticValidation: true,
    });

    expect(revalidateSchemaRows).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      rows: [{ name: 'Name' }],
      errors: ['missing command'],
      tokens: [{ kind: 'rule' }],
    });
  });
});
